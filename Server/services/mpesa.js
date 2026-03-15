import crypto from 'crypto';

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
        if (!phoneNumber || String(phoneNumber).replace(/\s/g, '').length < 8) {
            throw new Error('Número de telefone inválido');
        }

        // Usa mock somente quando ativado explicitamente
        if (process.env.MPESA_MOCK === 'true') {
            return mockPagamento(amount, String(phoneNumber).replace(/\s/g, ''));
        }

        const fullPhoneNumber = `258${String(phoneNumber).replace(/\s/g, '')}`;
        const token = getBearerToken();

        const url = `https://${process.env.MPESA_API_HOST}/ipg/v1x/c2bPayment/singleStage/`;

        const body = {
            input_TransactionReference: reference,
            input_CustomerMSISDN: fullPhoneNumber,
            input_Amount: String(amount),
            input_ThirdPartyReference: reference,
            input_ServiceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Origin': process.env.MPESA_ORIGIN,
            },
            body: JSON.stringify(body),
        });

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
        console.error('Erro no pagamento M-Pesa:', error);

        const causeCode = error?.cause?.code || null;
        const isNetworkTimeout = causeCode === 'UND_ERR_CONNECT_TIMEOUT';

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
