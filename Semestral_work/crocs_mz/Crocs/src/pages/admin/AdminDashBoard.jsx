import React from "react";
import {
  FiUsers,
  FiCreditCard,
  FiDollarSign,
  FiActivity
} from "react-icons/fi";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import "../../assets/style/AdminDashboard.css";

const COLORS = ["#4EF55F", "#F5A04E", "#3D4B3E"];

const AdminDashboard = () => {
  const clientesAtivos = 120;
  const maquinasAtivas = 30;
  const receitaMensal = 15000;
  const maquinasEmManutencao = 3;

  const pagamentosPorDia = [
    { date: "01/07", count: 10 },
    { date: "02/07", count: 15 },
    { date: "03/07", count: 12 },
    { date: "04/07", count: 18 }
  ];

  const dataPie = [
    { name: "Homens", value: 60 },
    { name: "Mulheres", value: 40 }
  ];

  const dadosGrafico = [
    { category: "Sandálias", value: 40 },
    { category: "Tênis", value: 30 },
    { category: "Chinelos", value: 25 }
  ];

  const planDistribution = [
    { name: "Plano A", value: 45 },
    { name: "Plano B", value: 30 },
    { name: "Plano C", value: 25 }
  ];

  const expiracoes = [
    { cliente: "João", plano: "Plano A", vencimento: "2025-07-10" },
    { cliente: "Maria", plano: "Plano B", vencimento: "2025-07-12" },
    { cliente: "Pedro", plano: "Plano C", vencimento: "2025-07-15" }
  ];

  return (
    <div className="admin-dashboard">
      <main className="admin-main">
        <div className="admin-container">
          <div className="kpi-grid">
            {[
              { icon: <FiUsers />, title: "Clientes Ativos", value: clientesAtivos },
              { icon: <FiCreditCard />, title: "Máquinas Ativas", value: maquinasAtivas },
              { icon: <FiDollarSign />, title: "Receita Mensal", value: `Mzn ${receitaMensal.toLocaleString()}` },
              { icon: <FiActivity />, title: "Máq. Manutenção", value: maquinasEmManutencao }
            ].map((kpi, index) => (
              <div className="kpi-card" key={index}>
                <div className="kpi-icon">{kpi.icon}</div>
                <div className="kpi-info">
                  <p className="kpi-title">{kpi.title}</p>
                  <p className="kpi-value">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="chart-grid">
            <div className="chart-card">
              <h3>Pagamentos no Mês</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={pagamentosPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#4EF55F" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Distribuição por Gêneros</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={dataPie} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" label>
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Vendas na Loja</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Distribuição de Planos</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={planDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="table-card">
            <h3>Expirações Próximas</h3>
            <table className="exp-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Plano</th>
                  <th>Vencimento</th>
                </tr>
              </thead>
              <tbody>
                {expiracoes.map((item, i) => (
                  <tr key={i}>
                    <td>{item.cliente}</td>
                    <td>{item.plano}</td>
                    <td>{new Date(item.vencimento).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
