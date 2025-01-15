import React from 'react';
import '../assets/style/footer.css'; // Assuming you're keeping the CSS in a separate file
import { FiInstagram } from 'react-icons/fi';
import { FaInstagram } from 'react-icons/fa';
import instagram from '../assets/img/instagram.svg';
import facebook from '../assets/img/facebook.svg';
import whatssap from '../assets/img/whatsapp.svg';

const Footer = () => {
  return (
    <section className="footer">
      <div className="footer-box">
       <div className='div_logo'>
         
         <a href="#" className="logo">
           <h1 style={{color: 'white', fontWeight: '900' }}>CROCS<sup style={{ fontSize: '0.5rem', color: 'white' }}>TM</sup></h1>
         </a>
       </div>
        <div className="social">
          <div className="media">
            <a href="https://www.instagram.com/crocs_mozambique/" target='blank' >
              <img src={instagram} alt="" />
            </a>
            <a href="#" >
              <img src={facebook} alt="" />
            </a>
            <a href="https://l.instagram.com/?u=https%3A%2F%2Fwa.link%2Fyf8ouz%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAaZp5qrymObZbVXK6AQQCSVv9z-bWqsny34UoPtj7ld8BAp4U-hk7D-n-tI_aem_eApgtOr7NKTrPSIku4CqeA&e=AT1fuYKfA7k2KQwOX5cn81cFtl4rfPhC3XDFDnW2Es-NFBTqSFoJJE95n66MFuBSLU9YEvnBYyaXo3MLYIjW-AslOX7cyjpqJQhHEcY" >
              <img src={whatssap} alt="" style={{width: '28px'}}/>
            </a>
          </div>

          <p style={{ textAlign: 'left', textDecoration: 'underline', fontSize: '1.1rem' }}><b style={{  color: 'white' }}>Inscreva-se na nossa Newsletter </b></p>
          <p style={{ width: '330px', fontSize: '0.8rem' }}>Ao se inscrever você concorda com os termos de uso e política de privacidade. Você pode cancelar a sua inscrição a qualquer momento</p>
          <div className="newsletter">
            <form action="">
              <input type="email" placeholder="Digite o seu melhor E-mail" className="email-box" required />
              <input type="submit" value="Inscrever-se" className="btn" />
            </form>
          </div>

          <div className="contacts">
            <h3>Contactos</h3>
            <p><b  style={{  color: 'white' }}>Email</b>: suporte@crocsmz.co.mz</p> <br />
            <p><b  style={{  color: 'white' }}>Contacto do suporte</b>: +258 821234567</p>
            <p>Seg-Sex: 7:00H - 21:00H</p>
            <p>Sab-Dom: 8:15H - 20:00H</p>
          </div>
        </div>
      </div>

      <div className="footer-box">
        <h3>Paginas</h3>
        <a href="#home">Home</a>
        <a href="#featured">Sobre-nós</a>
        <a href="#shop">Novas Tendências</a>
        <a href="#new">Jibbitz</a>
      </div>

      <div className="footer-box">
        <h3>Políticas</h3>
        <a href="#">Política de Privacidade</a>
        <a href="#">Termos de Uso</a>
        <a href="#">Termos de Uso</a>
        <a href="#">Termos de Uso</a>
      </div>

      <div className="footer-box">
        <h3>Pedido & Suporte</h3>
        <p>Devoluções & Trocas</p>
        <p>Delivery (Entrega)</p>
        <p>Ajuda</p>
        <p>Perguntas Frequentes</p>
      </div>
    </section>
  );
};

export default Footer;
