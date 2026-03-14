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
import { useNavigate } from "react-router-dom";



const AdminGestaoProdutos = () => {
const [totalProdutos, setTotalProdutos] = useState(0);
const [estoqueTotal, setEstoqueTotal] = useState(0);
const [totalCategorias, setTotalCategorias] = useState(0);
const [semEstoque, setSemEstoque] = useState(0);
const [produtosSemEstoque, setProdutosSemEstoque] = useState([]);
const [estoquePorCor, setEstoquePorCor] = useState([]);
const [estoqueCritico, setEstoqueCritico] = useState([]);
const navigate = useNavigate();
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

// Produto estoque critico
useEffect(() => {
  const fetchProdutoEstoqueCritico = async () => {
    try {
      const res = await fetch("http://localhost:3005/api/products/produto/estoque-critico");
      const json = await res.json();
      setEstoqueCritico(json);
    } catch (err) {
      console.error("Erro ao buscar estoque por cor:", err);
    }
  };

  fetchProdutoEstoqueCritico();
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
      <th>Nº de Cores</th>
      <th>Preço Base</th>
      <th>Ação</th>
    </tr>
  </thead>

  <tbody>
    {estoquePorCor.map((item) => (
      <tr
        key={item.product_id}
        onClick={() =>
          navigate(`/admin/produto/estoque-produto/${item.product_id}`)
        }
        style={{ cursor: "pointer" }}
        className="table-row-hover"
      >
        <td>
          <img
            src={item.primary_image_url || "/no-image.png"}
            alt={item.product_name}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </td>

        <td>{item.product_name}</td>

        <td>{item.total_cores || "N/A"}</td>

        <td>{Number(item.price).toFixed(2)} MZN</td>

        {/* BOTÃO */}
        <td>
          <button
            className="btn-detalhes"
            onClick={(e) => {
              e.stopPropagation(); // 🔥 impede conflito com clique da linha
              navigate(`/admin/produto/estoque-produto/${item.product_id}`);
            }}
          >
            Detalhes
          </button>
        </td>
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
      <th>Tamanho</th>
      <th>Preço</th>
      <th>Estoque</th>
    </tr>
  </thead>

  <tbody>
    {estoqueCritico.map((produto) =>
      produto.colors?.map((cor) =>
        cor.sizes?.map((size) => (
          <tr
            key={size.product_color_size_id}
            onClick={() =>
              navigate(`/admin/produto/estoque-produto/${produto.product_id}`)
            }
            style={{ cursor: "pointer" }}
          >
            {/* IMAGEM */}
            <td>
              <img
                src={cor.images?.[0] || "/no-image.png"}
                alt={produto.name}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </td>

            {/* PRODUTO */}
            <td>{produto.name}</td>

            {/* COR */}
            <td>{cor.color_name}</td>

            {/* TAMANHO */}
            <td>{size.size}</td>

            {/* PREÇO */}
            <td>{Number(produto.price).toFixed(2)} MZN</td>

            {/* ESTOQUE CRÍTICO */}
            <td style={{ color: "red", fontWeight: "bold" }}>
              {size.stock_quantity}
            </td>
          </tr>
        ))
      )
    )}
  </tbody>
</table>
    </div>

    </div>
  );
};

export default AdminGestaoProdutos;
