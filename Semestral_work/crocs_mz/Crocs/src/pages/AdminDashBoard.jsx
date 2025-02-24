import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../assets/style/admindashboard.css';

const AdminDashboard = () => {
  const salesData = [
    { month: 'Jan', sales: 45000, lastYear: 40000 },
    { month: 'Feb', sales: 52000, lastYear: 45000 },
    { month: 'Mar', sales: 49000, lastYear: 48000 },
    { month: 'Apr', sales: 58000, lastYear: 51000 },
  ];

  const summaryData = [
    { title: 'Total de Vendas', value: 'R$ 210.000' },
    { title: 'Meta de Vendas', value: 'R$ 250.000' },
    { title: 'Média Mensal', value: 'R$ 52.500' },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <main className="dashboard-content">
        <div className="summary-cards">
          {summaryData.map((item, index) => (
            <div key={index} className="summary-card">
              <h3>{item.title}</h3>
              <p>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <h2>Comparativo de Vendas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#2563eb" name="Vendas 2024" />
              <Line type="monotone" dataKey="lastYear" stroke="#94a3b8" name="Vendas 2023" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Vendas por Mês (Gráfico de Barras)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#2563eb" name="Vendas 2024" />
              <Bar dataKey="lastYear" fill="#94a3b8" name="Vendas 2023" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="table-container">
          <h2>Detalhes das Vendas</h2>
          <table className="category-table">
            <thead>
              <tr>
                <th>Mês</th>
                <th>Vendas 2024</th>
                <th>Vendas 2023</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((data, index) => (
                <tr key={index}>
                  <td>{data.month}</td>
                  <td>{`R$ ${data.sales.toLocaleString()}`}</td>
                  <td>{`R$ ${data.lastYear.toLocaleString()}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
