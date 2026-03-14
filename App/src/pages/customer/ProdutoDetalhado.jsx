import React, { useState, useEffect } from 'react';

const ProdutoDetalhado = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Termo de pesquisa
  const [products, setProducts] = useState([]); // Lista de produtos

  // Função para buscar produtos
  const fetchProducts = async (search = '') => {
    try {
      const response = await fetch(`http://localhost:3005/api/products/pr?search=${search}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Busca os produtos ao carregar o componente
  useEffect(() => {
    fetchProducts(); // Busca sem filtro inicialmente
  }, []);

  // Manipula a pesquisa
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    fetchProducts(value); // Faz a busca conforme o termo
  };

  return (
    <div className='content'>
      <input
        type="text"
        placeholder="Pesquisar produtos..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          padding: '10px',
          marginBottom: '20px',
          width: '50%',
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: 'red',
          marginTop: '200px',
        }}
      />
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.product_id} className="product-card">
              <img
                src={product.primary_image_url || '/default-image.png'}
                alt={product.product_name}
                style={{ width: '150px', height: '150px' }}
              />
              <h3>{product.product_name}</h3>
              <p>Preço: {product.price} MZN</p>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ProdutoDetalhado;
