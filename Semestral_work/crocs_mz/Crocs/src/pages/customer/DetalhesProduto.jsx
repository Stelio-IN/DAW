import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/style/about.css';
import '../../assets/style/detalhesProduto.css';
import { useFavorites } from "../../context/FavoritesContext"; // Importa o contexto

import crocs from '../../assets/img/sap1.webp';
import crocs1 from '../../assets/img/sap2.webp';
import crocs2 from '../../assets/img/sap3.webp';
import crocs3 from '../../assets/img/sap4.webp';
import crocs4 from '../../assets/img/sap5.webp';
const ProdutoDetalhado = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState([null]);
  const [corSelecionada, setCorSelecionada] = useState(null);
const [imagemPrincipal, setImagemPrincipal] = useState(null);




  const navigate = useNavigate();
 const { favorites, toggleFavorite } = useFavorites();
  useEffect(() => {
    if (productID) {
      console.log(`O parâmetro productID foi capturado: ${productID}`);
      fetch(`http://localhost:3005/api/products/pr/${productID}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.product_id) {
            setProduct(data);
          } else {
            console.error('Dados recebidos não são um array:', data);
          }
        })
        .catch((error) =>
          console.error('Erro ao buscar detalhes do produto:', error)
        );
    }
  }, [productID]);

  
useEffect(() => {
  if (product && product.colors && product.colors.length > 0) {
    setCorSelecionada(product.colors[0]);
  }
}, [product]);

useEffect(() => {
  if (corSelecionada && corSelecionada.images && corSelecionada.images.length > 0) {
    // Busca a principal ou a primeira imagem da cor
    const imagem = corSelecionada.images.find((img) => img.is_primary) || corSelecionada.images[0];
    setImagemPrincipal(imagem?.image_url);
  }
}, [corSelecionada]);



  const addToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...currentCart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log('Produto adicionado ao carrinho:', product);
  };

  return (
    <div className="container-detalhes-produto">
      <section className='container_detalhes'>
        <div className="box-conteudo">
        {product ? (
        <div className="col-esquerda">
          <div className="imagem-principal">
            <div key={product.product_id} className='principal'>
              <img
                 src={imagemPrincipal || 'Sem Imagem Principal'}
                alt={product.name}
              
              />
            </div>
          </div>
       <div className="opcoes">
  {corSelecionada?.images?.map((img, idx) => (
    <img
      key={idx}
      src={img.image_url}
      alt={`Variação ${idx}`}
      onClick={() => setImagemPrincipal(img.image_url)}
      style={{
        cursor: 'pointer',
        border: imagemPrincipal === img.image_url ? '2px solid black' : '1px solid transparent',
        borderRadius: '6px',
        marginRight: '8px',
        width: '60px',
        height: '60px',
        objectFit: 'cover'
      }}
    />
  ))}
</div>


        </div>
          ) : (
            <p>Carregando detalhes do produto...</p>
          )}

          {product ? (
            <div className="col-direita">
              <div className="informacao-tamanho">
                <h1>{product.name}</h1>
               
             <div className="alternativas">
  <div>
    {product.colors
  ?.filter((cor) => cor.stock_quantity > 0)
  .map((cor, idx) => {
    const imagem = cor.images?.find((img) => img.is_primary) || cor.images?.[0];
    return (
      <img
        key={idx}
        src={imagem?.image_url || 'default.png'}
        alt={cor.name}
        onClick={() => setCorSelecionada(cor)}
        style={{
          cursor: 'pointer',
          border: corSelecionada?.product_color_id === cor.product_color_id ? '2px solid black' : 'none',
          borderRadius: '6px',
          marginRight: '8px',
          width: '60px',
          height: '60px',
          objectFit: 'cover'
        }}
      />
    );
  })}

  </div>
</div>

              <p style={{fontWeight: 'bold', fontSize: '20pt'}}>  {product.price} Mzn</p>
              <p style={{ maxWidth: '600px', fontStyle: 'italic' }}>
                  {product.description}
                </p>
                <p style={{ textDecoration: 'underline', fontWeight: '900', fontSize: '13pt' }}>Tamanho</p>
                <p>Os tamanhos podem variar de acordo com o estilo.</p>
                <button className="botao-genero">HOMEM</button>
                <button className="botao-genero">MULHER</button>
              </div>
              <div className="lista-tamanhos">
                {[7, 10, 15, 16, 19, 23, 25, 30, 31, 34, 36].map((tamanho) => (
                  <button key={tamanho} className="botao-tamanho">
                    {tamanho}
                  </button>
                ))}
              </div>
            
              
              <button style={styles.button} onClick={() => addToCart(product)} className='cart'>
                Adicionar ao Carrinho
              </button>
              <button
            onClick={() => {
              console.log("Produto favorito clicado:", product);
              toggleFavorite(product);
            }}
            className='favor'
          >
            {favorites.some((item) => item.product_id === product.product_id)
              ? <span style={{color: 'red', textDecoration: 'underline'}}>Remover Favorito</span>
              : "Adicionar aos Favoritos"}
          </button>
            </div>
          ) : (
            <p>Carregando...</p>
          )}
        </div>

        <div className=''>

        </div>
      </section>

      
    </div>
  );
};

const styles = {
  card: {
   
  },
};

export default ProdutoDetalhado;
