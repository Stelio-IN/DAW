import React, {useState, useEffect} from 'react';
import '../assets/style/pagamento.css';
import  '../assets/style/loja.css';
import Timeline from '../component/TimeLine';

const  Pay = () => {
  const [selectedSize, setSelectedSize] = useState(null);
const [currentStep, setCurrentStep] = useState(1);
    return (
            <div className='content-pagamento'>

            <div className='pagamento'>

            <div className="catalog-container">
          <header className="catalog-header">
            <h1>Novas Tendências</h1>
          </header>

          <Timeline currentStep={currentStep} />

          <section className="catalog-items">
            
<div className='delivery'>
             <div> <input type="text" placeholder='   Pais/Regiao'/> </div>
             <div> <input type="text" placeholder='   Seu primeiro nome'/> <input type="text" placeholder='   Seu sobrenome'/> </div>
             <div> <input type="text" placeholder='   Endereço primario'/> </div>
             <div> <input type="text" placeholder='   Endereço secundario'/> </div>
             <div>
              <input type="text" placeholder='   Cidade'/> <input type="text" placeholder='   Provincia'/> <input type="text " placeholder='   Código Postal'/>
              </div>
             <div> <input type="text" placeholder='   Telefone'/> </div>
             <button>Continuar</button>

             
             <div className="payment_method">
              <button id="btn_paypal"> Paypal</button>

              <button id="btn_card">Cards</button> 
             </div>

             <div className="paypal_method">
                <p>Voce sera redirecionado ao paypal para autorizar o seu pagamento.<span style={{color: "aqua", textDecoration: "underline"}}> O que e paypal?</span></p>
                <button>Pagar com paypal</button>

                <div className="descount">
                <p>+ Aplicar cupom de desconto</p>
                <input type="text" placeholder="Insira o codigo promocional"/>
                <input type="submit" />
                </div>
            </div>
             
              <div className="card_method">

</div>

             
</div>





         
          </section>
        </div>

             <div></div>

            </div>




            </div>
    );
};