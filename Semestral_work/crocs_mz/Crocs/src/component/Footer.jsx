import React from 'react';
import '../assets/footer.css'; // Assuming you're keeping the CSS in a separate file

const Footer = () => {
  return (
    <section className="footer">
      <div className="footer-box">
        <a href="#" className="logo">
          <h1>CROCS<sup style={{ fontSize: '0.5rem' }}>TM</sup></h1>
        </a>
        <div className="social">
          <div className="media">
            <a href="#"><i className='bx bxl-facebook'></i></a>
            <a href="#"><i className='bx bxl-instagram'></i></a>
            <a href="#"><i className='bx bxl-whatsapp'></i></a>
          </div>

          <p style={{ textAlign: 'left', textDecoration: 'underline', fontSize: '1.1rem' }}><b>Inscreva-se Newsletter</b></p>
          <p style={{ width: '330px', fontSize: '0.8rem' }}>Ao se inscrever você concorda com os termos de uso e política de privacidade.</p>
          <div className="newsletter">
            <form action="">
              <input type="email" placeholder="Enter your email..." className="email-box" required />
              <input type="submit" value="Subscribe" className="btn" />
            </form>
          </div>

          <div className="contacts">
            <h3>Contacts</h3>
            <p><b>Email</b>: suporte@crocsmz.co.mz</p> <br />
            <p><b>Contacto do suporte</b>: +258 821234567</p>
            <p>Seg-Sex: 7:00H - 21:00H</p>
            <p>Sab-Dom: 8:15H - 20:00H</p>
          </div>
        </div>
      </div>

      <div className="footer-box">
        <h3>Pages</h3>
        <a href="#home">Home</a>
        <a href="#featured">Featured</a>
        <a href="#shop">Shop</a>
        <a href="#new">New</a>
      </div>

      <div className="footer-box">
        <h3>Legal</h3>
        <a href="#">Privacy Policy</a>
        <a href="#">Refund Policy</a>
        <a href="#">Terms of Use</a>
        <a href="#">Disclaimer</a>
      </div>

      <div className="footer-box">
        <h3>Branches</h3>
        <p>United States</p>
        <p>Japan</p>
        <p>Germany</p>
        <p>Mozambique</p>
      </div>
    </section>
  );
};

export default Footer;
