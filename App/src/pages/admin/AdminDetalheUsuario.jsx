import React, { useEffect, useState } from "react";
import {
  FiBox,
  FiTrendingUp,
  FiAlertTriangle,
  FiList
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "../../assets/style/AdminGestaoProdutos.css";

const AdminGestaoProdutos = () => {
const [totalProdutos, setTotalProdutos] = useState(0);
const [estoqueTotal, setEstoqueTotal] = useState(0);
const [totalCategorias, setTotalCategorias] = useState(0);
const [semEstoque, setSemEstoque] = useState(0);
const [produtosSemEstoque, setProdutosSemEstoque] = useState([]);
const [estoquePorCor, setEstoquePorCor] = useState([]);
// Produtos cadastrados
useEffect(() => {
  const fetchProdutos = async () => {
    try {
      const response = await fetch("http://localhost:3005/api/products");
      const produtos = await response.json();
      setTotalProdutos(produtos.length);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  fetchProdutos();
}, []);

// Estoque Total
useEffect(() => {
  const buscarEstoqueTotal = async () => {
    try {
      const res = await fetch("http://localhost:3005/api/products/estoque/total");
      const data = await res.json();
      setEstoqueTotal(data.totalEstoque || 0);
    } catch (error) {
      console.error("Erro ao buscar estoque total:", error);
    }
  };

  buscarEstoqueTotal();
}, []);

// Produtos Sem Estoque 
useEffect(() => {
  const buscarSemEstoque = async () => {
    try {
      const res = await fetch("http://localhost:3005/api/products/estoque/zero");
      const data = await res.json();
      setSemEstoque(data.semEstoque || 0);
    } catch (error) {
      console.error("Erro ao buscar Sem estoque :", error);
    }
  };

  buscarSemEstoque();
}, []);

// Categorias Cadastradas
 useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/categories");
        if (response.ok) {
          const data = await response.json();
          setTotalCategorias(data.length);
        } else {
          console.error("Erro ao buscar categorias");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchCategories();
  }, []); 

  // Produtos (cor) sem estoque
  useEffect(() => {
  const carregarProdutosSemEstoque = async () => {
    try {
      const res = await fetch("http://localhost:3005/api/products/produto/Semestoque");
      const json = await res.json();
      setProdutosSemEstoque(json);
    } catch (err) {
      console.error("Erro ao buscar produtos sem estoque:", err);
    }
  };

  carregarProdutosSemEstoque();
}, []);

// Estoque do produto por cor  
useEffect(() => {
  const fetchEstoquePorCor = async () => {
    try {
      const res = await fetch("http://localhost:3005/api/products/produto/estoque-por-cor");
      const json = await res.json();
      setEstoquePorCor(json);
    } catch (err) {
      console.error("Erro ao buscar estoque por cor:", err);
    }
  };

  fetchEstoquePorCor();
}, []);








  const [dadosKPIs, setDadosKPIs] = useState({
    totalProdutosn: 0,
    totalEstoque: 0,
    produtosCriticos: 0,
    categorias: 0
  });
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [produtosCriticos, setProdutosCriticos] = useState([]);

  useEffect(() => {
    const carregarKPIs = async () => {
      const res = await fetch("http://localhost:3005/api/products/dashboard-kpi");
      const json = await res.json();
      setDadosKPIs(json);
    };

    const carregarGrafico = async () => {
      const res = await fetch("http://localhost:3005/api/products/estoque-por-categoria");
      const json = await res.json();
      setDadosGrafico(json);
    };

    const carregarCriticos = async () => {
      const res = await fetch("http://localhost:3005/api/products/estoque-critico");
      const json = await res.json();
      setProdutosCriticos(json);
    };

    carregarKPIs();
    carregarGrafico();
    carregarCriticos();
  }, []);

  return (
    <div className="produto-dashboard">
      <h1 className="titulo-dashboard">Gestão de Produtos</h1>

      <div className="kpi-produtos-grid">
        {[
          { icon: <FiBox />, title: "Produtos Cadastrados", value: totalProdutos },
          { icon: <FiTrendingUp />, title: "Estoque Total", value: estoqueTotal },
          { icon: <FiAlertTriangle />, title: "Produtos Sem Estoque", value: semEstoque },
          { icon: <FiList />, title: "Categorias", value: totalCategorias }
        ].map((kpi, idx) => (
          <div className="kpi-produto-card" key={idx}>
            <div className="kpi-produto-icon">{kpi.icon}</div>
            <div>
              <p className="kpi-produto-title">{kpi.title}</p>
              <p className="kpi-produto-value">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <br />
     
      <br />


{/* estoque do produto por cor  */}
      <div className="table-card">
  <h3>Detalhe de Estoque por Produto e Cor</h3>

  <div className="scroll-table-container custom-scrollbar">
    <table className="exp-table">
      <thead>
        <tr>
          <th>Imagem</th>
          <th>Produto</th>
          <th>Cor</th>
          <th>Quantidade</th>
        </tr>
      </thead>
      <tbody>
        {estoquePorCor.map((item, index) => (
          <tr key={index}>
            <td>
              <img
                src={item.primary_image_url || '/no-image.png'}
                alt={item.product_name}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            </td>
            <td>{item.product_name}</td>
            <td>{item.color_name || "N/A"}</td>
            <td>{item.stock_quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
      </div>



      {/* Produtos com estoque critico*/}
    <div className="table-card">
  <h3>Produtos Com Estoque Crítico</h3>
  <table className="exp-table">
    <thead>
      <tr>
        <th>Imagem</th>
        <th>Produto</th>
        <th>Cor</th>
        <th>Preço</th>
        <th>Estoque</th>
      </tr>
    </thead>
    <tbody>
      {produtosSemEstoque.map((item, i) => (
        <tr key={i}>
          <td>
            <img
              src={item.primary_image_url || '/no-image.png'}
              alt={item.product_name}
              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
            />
          </td>
          <td>{item.product_name}</td>
          <td>{item.color_name || "Sem cor"}</td>
          <td>{Number(item.price).toFixed(2)} MZN</td>
           <td>{item.stock_quantity}</td>
        </tr>
      ))}
    </tbody>
  </table>
    </div>

    </div>
  );
};

export default AdminGestaoProdutos;
