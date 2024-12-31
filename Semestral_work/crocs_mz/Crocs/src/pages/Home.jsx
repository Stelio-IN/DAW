import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/style/home.css";
import "../assets/style/slide.css";
import "../assets/style/catalogo.css";

import { FiArrowLeft, FiArrowRight, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
// Images
import colecao_1 from "../assets/img/col1.avif";
import colecao_2 from "../assets/img/col2.avif";
import colecao_3 from "../assets/img/col3.avif";
import colecao_4 from "../assets/img/col4.avif";
import colecao_5 from "../assets/img/col5.avif";
import colecao_6 from "../assets/img/col6.avif";
import template from "../assets/img/template5.webp";
import template2 from "../assets/img/template4.webp";
import template3 from "../assets/img/template3.webp";
import template4 from "../assets/img/template6.webp";
import crocs1 from "../assets/img/crocsbolsa.jpeg";
import crocs2 from "../assets/img/crocssummer.jpeg";
//import crocs1 from '../assets/img/imgTeste.PNG';
import { useFavorites } from "../context/FavoritesContext"; // Importa o contexto
const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    // Fetching products from the API
    fetch("http://localhost:3005/api/products/pr")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, []);

  // moeda conversao

  const [currency, setCurrency] = useState("MZN"); // Moeda padrão
  const [exchangeRates, setExchangeRates] = useState({}); // Taxas de câmbio

  // Função para buscar taxas de câmbio dinamicamente
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/MZN"
        );
        const data = await response.json();
        setExchangeRates(data.rates); // Define todas as taxas disponíveis
      } catch (error) {
        console.error("Erro ao buscar taxas de câmbio:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  // Função para converter o preço
  const convertPrice = (price, targetCurrency) => {
    if (targetCurrency === "MZN" || !exchangeRates[targetCurrency]) {
      return price.toFixed(2); // Retorna o preço original se for MZN ou a taxa não existir
    }
    return (price * exchangeRates[targetCurrency]).toFixed(2);
  };

  // Atualizar moeda selecionada
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };

  return (
    <div className="content">
      <main>
        <article>
      



          {/* Section 1 */}
          <div className="Container">
            <div className="home-container">
              <h2>Crocs Mozambique</h2>
              <p>
                Novos modelos, com os últimos crocs. <br />
                Mais confortáveis do que nunca
              </p>
              <button id="shop_now">Comprar</button>
            </div>

            <div className="home-container-img"> </div>
          </div>

    

 <br /><br />
   {/* Section 3 */}   
   <div className="Container-promo">
   <img src={template} alt="" />
          </div>
        

          <div className="main">
              <header>
                <h1></h1>
                <p>
                  {" "}
                 <b style={{fontSize: '2rem'}}>CROCS™ | </b>  NOVOS MODELOS
                </p>
                <span><FiArrowLeft size={40} id="seta_esquerda"/></span>
                <span><FiArrowRight size={40} id="seta_direita"/></span>
              </header>
              <section>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div className="product" key={index}>
                    <picture>
                      <img
                        src={product.primary_image_url}
                        alt={product.product_name}
                        loading="lazy"
                      />
                    </picture>

                    <div className="detail">
                      <p>
                        <small>{product.product_name}</small>
                      </p>
                      <samp>
                        {currency === "MZN"
                          ? `${product.price} MZN`
                          : `${convertPrice(
                              product.price,
                              currency
                            )} ${currency}`}
                      </samp>
                      {/* Dropdown para selecionar a moeda */}
                      {/**<select
                      value={currency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                    >
                      <option value="MZN">MZN</option>
                      <option value="USD">USD</option>
                      <option value="ZAR">ZAR</option>
                    </select>*/}
                    </div>

                    <div className="button">
                      <div className="colors">
                        {Array.isArray(product.colors) &&
                          product.colors.map((color, index) => (
                            <div
                              key={index}
                              className="color-box"
                              style={{ backgroundColor: color.hex_code }}
                              title={color.name}
                            />
                          ))}
                      </div>
                      <button
                        className="product-button"
                        onClick={() => {
                          console.log(`Product ID: ${product.product_id}`);
                          navigate(`/produto/detalhes/${product.product_id}`);
                        }}
                      >
                        ver mais
                      </button>
                      <button className="btn_favoritoo"
                        onClick={() => {
                          console.log("Produto favorito clicado:", product);
                          toggleFavorite(product);
                        }}
                       
                      >
                        {favorites.some(
                          (item) => item.product_id === product.product_id
                        )
                        ? <FaHeart color={ 'gray'} />
                        : <FiHeart  size={25} />}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Carregando produtos...</p>
              )}
            </section>
            </div>

 {/* Popular Collections */}
 <section className="carrosel_1">
         
         <div className="slider">
         <p id="txt_colecao">
              <b style={{fontSize: '2rem'}}>CROCS™ | </b>  COLEÇÕES
             </p>
           <div className="slide-track">
             {[
               colecao_1,
               colecao_2,
               colecao_3,
               colecao_4,
               colecao_5,
               colecao_6,
               colecao_1,
               colecao_2,
               colecao_3,
               colecao_4,
               colecao_5,
               colecao_6,
             ].map((img, index) => (
               <div className="slide" key={index}>
                 <img src={img} alt={`Coleção ${index + 1}`} />
                 <p>Coleçao {index + 1}</p>
               </div>
             ))}
           </div>
         </div>
       </section>

          {/* Section 4 */}
          <div className="Container-extended">
            <div>
              <img src={template3} alt="" />
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi tempora magni</p>
             <button>Comprar agora</button>
            </div>
            <div>
            
              <h1>Aproveite as novidades crocs agora como nunca antes </h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut non quibusdam sint atque praesentium dignissimos id sunt eum provident ad earum, dolor eos consectetur doloribus repellendus aliquam.</p>
              <button>Comprar agora</button>
            </div>

            
          </div>

      {/* 
          <div className="Container_2">
            <div className="Container-content">
              <div className="promotion">
                <h1>SANDALIAS</h1>
                <h1>ESTILOSAS</h1>
              </div>
              <p> CROCS™ | SINTA-SE COMO NUNCA ANTES</p>
              <br />
              <p>
                {" "}
                Oferta especial. Obtenha desconto em qualquer pedido, apenas
                válido por hoje.
              </p>

              <button> Comprar agora</button>
            </div>

            <div className="Container-promocional">
              <div>
                <h1 style={{ fontSize: "40pt", color: "rgb(75, 134, 34)" }}>
                  25%
                </h1>
                <p style={{ color: "rgb(66, 67, 68)", lineHeight: 1.3 }}>
                  Oferta especial. Obtenha desconto em qualquer pedido, apenas
                  válido por hoje.
                </p>
              </div>
              <div>
                <img src={gif} />
              </div>
            </div>
          </div> */} 

          {/* Popular Collections */}
          <section className="carrosel_1">
         
            <div className="slider">
            <p id="txt_colecao">
                 <b style={{fontSize: '2rem'}}>CROCS™ | </b>  COLEÇÕES
                </p>
              <div className="slide-track">
                {[
                  colecao_1,
                  colecao_2,
                  colecao_3,
                  colecao_4,
                  colecao_5,
                  colecao_6,
                  colecao_1,
                  colecao_2,
                  colecao_3,
                  colecao_4,
                  colecao_5,
                  colecao_6,
                ].map((img, index) => (
                  <div className="slide" key={index}>
                    <img src={img} alt={`Coleção ${index + 1}`} />
                    <p>Coleçao {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

       


{/* Section 3 */}   <div className="Container-promo">
<img src={template4} alt="" />
          </div>
            <div className="main">
              <header>
                <h1></h1>
                <p>
                  {" "}
                 <b style={{fontSize: '2rem'}}>CROCS™ | </b>  NOVOS MODELOS
                </p>
                <span><FiArrowLeft size={40} id="seta_esquerda"/></span>
                <span><FiArrowRight size={40} id="seta_direita"/></span>
              </header>
              <section>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div className="product" key={index}>
                    <picture>
                      <img
                        src={product.primary_image_url}
                        alt={product.product_name}
                        loading="lazy"
                      />
                    </picture>

                    <div className="detail">
                      <p>
                        <small>{product.product_name}</small>
                      </p>
                      <samp>
                        {currency === "MZN"
                          ? `${product.price} MZN`
                          : `${convertPrice(
                              product.price,
                              currency
                            )} ${currency}`}
                      </samp>
                      {/* Dropdown para selecionar a moeda */}
                      {/**<select
                      value={currency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                    >
                      <option value="MZN">MZN</option>
                      <option value="USD">USD</option>
                      <option value="ZAR">ZAR</option>
                    </select>*/}
                    </div>

                    <div className="button">
                      <div className="colors">
                        {Array.isArray(product.colors) &&
                          product.colors.map((color, index) => (
                            <div
                              key={index}
                              className="color-box"
                              style={{ backgroundColor: color.hex_code }}
                              title={color.name}
                            />
                          ))}
                      </div>
                      <button
                        className="product-button"
                        onClick={() => {
                          console.log(`Product ID: ${product.product_id}`);
                          navigate(`/produto/detalhes/${product.product_id}`);
                        }}
                      >
                        ver mais
                      </button>
                      <button className="btn_favoritoo"
                        onClick={() => {
                          console.log("Produto favorito clicado:", product);
                          toggleFavorite(product);
                        }}
                       
                      >
                        {favorites.some(
                          (item) => item.product_id === product.product_id
                        )
                        ? <FaHeart color={ 'gray'}/>
                        : <FiHeart  size={25} />}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Carregando produtos...</p>
              )}
            </section>
            </div>
           
                {/* Section 3 */}   <div className="Container-promo">
<img src={template4} alt="" />
          </div>


            <section className="categorias"> 
        <div className="social">
          <br />
          <h1>@CROCS_MOZAMBIQUE | <b style={{fontSize: '15pt', fontWeight: '100'}}>No Instagram</b></h1>
          <button>Seguir  @crocs_mozambique</button>
         
        </div>
                <div className="categore">
                  <div className="categor">
                  
                   <img src={template} alt="" />
                   <h2>Cartões</h2>
                   <button>Solicitar</button>
                  </div>
                  <div className="categor">
                    <img src={template4} alt="" />
                    <h2>jibbitz</h2>
                    <button>Comprar</button>
                  </div>
                  <div className="categor">
                    <img src={template4} alt="" />
                    <h2>LOJAs</h2>
                    <button>Ver lojas</button>
                  </div>
                </div>
         </section>
        
       
        </article>
      </main>
    </div>
  );
};

export default Home;
