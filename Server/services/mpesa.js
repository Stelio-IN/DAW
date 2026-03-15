import crypto from 'crypto';

const DEFAULT_REQUEST_TIMEOUT_MS = 15000;
const DEFAULT_RETRY_ATTEMPTS = 2;

const isTrue = (value) => String(value).toLowerCase() === 'true';

const toPositiveInt = (value, fallback) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const sanitizePhone = (phoneNumber) => {
    const digits = String(phoneNumber || '').replace(/\D/g, '');
    return digits.startsWith('+258') ? digits.slice(3) : digits;
};

const isTransientNetworkError = (error) => {
    const code = error?.cause?.code || error?.code || '';
    return [
        'UND_ERR_CONNECT_TIMEOUT',
        'UND_ERR_HEADERS_TIMEOUT',
        'UND_ERR_SOCKET',
        'ECONNRESET',
        'ECONNREFUSED',
        'ENOTFOUND',
        'ETIMEDOUT',
        'ABORT_ERR',
    ].includes(code);
};

/**
 * Simula resposta M-Pesa em modo de desenvolvimento (MPESA_MOCK=true)
 */
const mockPagamento = (amount, phoneNumber) => {
    const reference = transactionReference();
    console.log(`[M-Pesa MOCK] Pagamento simulado — Valor: ${amount}, Telefone: 258${phoneNumber}, Ref: ${reference}`);
    return {
        success: true,
        status: 'success',
        reference,
        data: {
            output_ResponseCode: 'INS-0',
            output_ResponseDesc: 'Request processed successfully (mock)',
            output_TransactionID: `MOCK${Date.now()}`,
            output_ConversationID: reference,
            output_ThirdPartyReference: reference,
        },
    };
};

/**
 * Gera o Bearer token cifrando a API key com a chave pública RSA do M-Pesa
 */
const getBearerToken = () => {
    const publicKey =
        `-----BEGIN PUBLIC KEY-----\n${process.env.MPESA_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;

    const encrypted = crypto.publicEncrypt(
        { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
        Buffer.from(process.env.MPESA_API_KEY)
    );

    return encrypted.toString('base64');
};

/**
 * Gera uma referência de transação única para M-Pesa
 */
const transactionReference = (length = 10) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'ref';
    const targetLength = Math.max(Number(length), 4);
    for (let i = 3; i < targetLength; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Realiza o pagamento via M-Pesa C2B Single Stage
 * @param {number|string} amount - Valor a pagar
 * @param {string} phoneNumber   - Número sem código do país (ex: 84XXXXXXX)
 */
const pagamentoMpesa = async (amount, phoneNumber) => {
    const reference = transactionReference();

    try {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            throw new Error('Valor inválido informado');
        }
        const normalizedPhone = sanitizePhone(phoneNumber);
        if (!normalizedPhone || normalizedPhone.length < 8) {
            throw new Error('Número de telefone inválido');
        }

        // Usa mock somente quando ativado explicitamente
        if (isTrue(process.env.MPESA_MOCK)) {
            return mockPagamento(amount, normalizedPhone);
        }

        const fullPhoneNumber = `258${normalizedPhone}`;
        const token = getBearerToken();
        const timeoutMs = toPositiveInt(process.env.MPESA_REQUEST_TIMEOUT_MS, DEFAULT_REQUEST_TIMEOUT_MS);
        const maxAttempts = toPositiveInt(process.env.MPESA_RETRY_ATTEMPTS, DEFAULT_RETRY_ATTEMPTS);

        const url = `https://${process.env.MPESA_API_HOST}/ipg/v1x/c2bPayment/singleStage/`;

        const body = {
            input_TransactionReference: reference,
            input_CustomerMSISDN: fullPhoneNumber,
            input_Amount: String(amount),
            input_ThirdPartyReference: reference,
            input_ServiceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
        };

        let response;
        let lastError;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Origin': process.env.MPESA_ORIGIN,
                    },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(timeoutMs),
                });
                lastError = null;
                break;
            } catch (err) {
                lastError = err;
                if (!isTransientNetworkError(err) || attempt === maxAttempts) {
                    throw err;
                }
            }
        }

        if (!response && lastError) {
            throw lastError;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.output_ResponseDesc || `HTTP ${response.status}`);
        }

        const responseCode = String(data?.output_ResponseCode || '');
        if (responseCode !== 'INS-0') {
            throw new Error(data.output_ResponseDesc || 'Pagamento M-Pesa não autorizado');
        }

        return {
            success: true,
            status: 'success',
            reference,
            data,
        };

    } catch (error) {
        const causeCode = error?.cause?.code || error?.code || null;
        const isNetworkTimeout = [
            'UND_ERR_CONNECT_TIMEOUT',
            'UND_ERR_HEADERS_TIMEOUT',
            'ETIMEDOUT',
            'ABORT_ERR',
        ].includes(causeCode);

        if (isNetworkTimeout && isTrue(process.env.MPESA_TIMEOUT_FALLBACK_MOCK)) {
            console.warn('M-Pesa indisponível por timeout de rede; usando fallback mock');
            const fallback = mockPagamento(amount, sanitizePhone(phoneNumber));
            return {
                ...fallback,
                fallback_used: true,
                fallback_reason: 'network_timeout',
                original_error: error.message,
                cause_code: causeCode,
                host: process.env.MPESA_API_HOST,
            };
        }

        console.error('Erro no pagamento M-Pesa:', error);

        return {
            success: false,
            status: 'error',
            message: isNetworkTimeout
                ? 'Nao foi possivel conectar ao sandbox M-Pesa (timeout de rede)'
                : 'Erro no processamento do pagamento',
            error: error.message,
            cause_code: causeCode,
            host: process.env.MPESA_API_HOST,
            reference,
        };
    }
};

export { pagamentoMpesa };
