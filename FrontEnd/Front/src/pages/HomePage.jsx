import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Buscando produtos...');
        const response = await axios.get('http://localhost:3005/api/products/pr');
        console.log('Produtos recebidos:', response.data);  // Verifique os dados recebidos
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Erro ao carregar os produtos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Certifique-se de que o useEffect está rodando apenas uma vez.

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      {/* products.length === 0 ? (
        <div>Nenhum produto encontrado.</div>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product.product_id}
            productName={product.product_name}
            productPrice={product.price}
          //  productColors={Array(product.color_count).fill(product.color_name)} // Exemplo de como passar o número de cores
          //  productImage={product.image_url} // A imagem principal
          />
        ))
      )*/}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
};

export default HomePage;
