import React, { useEffect, useState } from "react";
import {
  FiBox,
  FiDroplet,
  FiLayers,
  FiAlertCircle
} from "react-icons/fi";
import "../../assets/style/AdminGestaoProdutos.css";

const AdminGestaoProdutos = () => {
  const [dados, setDados] = useState({
    totalProdutos: 0,
    totalCores: 0,
    estoqueTotal: 0,
    estoqueZerado: 0
  });

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/products/kpis-estoque");
        const json = await res.json();
        setDados(json);
      } catch (error) {
        console.error("Erro ao carregar KPIs:", error);
      }
    };

    fetchDados();
  }, []);

  const kpis = [
    { title: "Produtos Cadastrados", icon: <FiBox />, value: dados.totalProdutos },
    { title: "Variações de Cor", icon: <FiDroplet />, value: dados.totalCores },
    { title: "Estoque Total", icon: <FiLayers />, value: dados.estoqueTotal },
    { title: "Estoque Zerado", icon: <FiAlertCircle />, value: dados.estoqueZerado }
  ];

  return (
    <div className="produto-dashboard">
      <h1 className="titulo-dashboard">Gestão de Produtos</h1>

      <div className="kpi-produtos-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-produto-card">
            <div className="kpi-produto-icon">{kpi.icon}</div>
            <div className="kpi-produto-info">
              <p className="kpi-produto-title">{kpi.title}</p>
              <p className="kpi-produto-value">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos e tabelas podem vir aqui depois */}
    </div>
  );
};

export default AdminGestaoProdutos;
