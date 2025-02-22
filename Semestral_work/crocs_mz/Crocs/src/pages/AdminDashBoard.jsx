import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const salesData = [
    { month: 'Jan', sales: 45000, lastYear: 40000 },
    { month: 'Feb', sales: 52000, lastYear: 45000 },
    { month: 'Mar', sales: 49000, lastYear: 48000 },
    { month: 'Apr', sales: 58000, lastYear: 51000 },
    { month: 'May', sales: 55000, lastYear: 49000 },
    { month: 'Jun', sales: 62000, lastYear: 52000 },
  ];

  const popularShoes = [
    { name: 'Nike Air Max', sales: 240 },
    { name: 'Adidas Ultra', sales: 220 },
    { name: 'Puma RS-X', sales: 180 },
    { name: 'Nike Jordan', sales: 160 },
    { name: 'Reebok Classic', sales: 140 },
  ];

  return (
    <>
      <style>
        {`
          .dashboard {
            padding: 24px;
            background-color: #f5f5f5;
            min-height: 100vh;
          }

          .header {
            margin-bottom: 32px;
          }

          .header h1 {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin: 0;
          }

          .header p {
            color: #6b7280;
            margin-top: 8px;
          }

          .stats_grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
          }

          .stat_card {
            background: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .stat_card .label {
            font-size: 14px;
            color: #6b7280;
            font-weight: 500;
          }

          .stat_card .value {
            font-size: 24px;
            font-weight: bold;
            margin: 8px 0;
          }

          .stat_card .change {
            font-size: 14px;
            display: flex;
            align-items: center;
          }

          .change.positive {
            color: #059669;
          }

          .change.negative {
            color: #dc2626;
          }

          .charts_grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
            margin-bottom: 32px;
          }

          @media (min-width: 1024px) {
            .charts_grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          .chart_card {
            background: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .chart_card h2 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #1f2937;
          }

          .chart_container {
            height: 320px;
          }

          .sales_table {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .sales_table h2 {
            font-size: 18px;
            font-weight: 600;
            padding: 24px 24px 16px;
            color: #1f2937;
          }

          .table_container {
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }

          th {
            text-align: left;
            padding: 12px 16px;
            border-bottom: 1px solid #e5e7eb;
            color: #6b7280;
            font-weight: 500;
          }

          td {
            padding: 12px 16px;
            border-bottom: 1px solid #e5e7eb;
          }

          .status_badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 12px;
          }

          .status_delivered {
            background-color: #dcfce7;
            color: #166534;
          }

          .status_transit {
            background-color: #dbeafe;
            color: #1e40af;
          }

          .status_processing {
            background-color: #fef3c7;
            color: #92400e;
          }
        `}
      </style>

      <div className="dashboard">
        {/* Header */}
        <div className="header">
          <h1>Dashboard de Vendas</h1>
          <p>Visão geral do desempenho da loja</p>
        </div>

        {/* Stats Grid */}
        <div className="stats_grid">
          <div className="stat_card">
            <div className="label">Vendas Totais</div>
            <div className="value">R$ 62.000</div>
            <div className="change positive">+12% do mês anterior</div>
          </div>

          <div className="stat_card">
            <div className="label">Produtos Vendidos</div>
            <div className="value">847</div>
            <div className="change positive">+8% do mês anterior</div>
          </div>

          <div className="stat_card">
            <div className="label">Novos Clientes</div>
            <div className="value">286</div>
            <div className="change negative">-3% do mês anterior</div>
          </div>

          <div className="stat_card">
            <div className="label">Previsão Mensal</div>
            <div className="value">R$ 68.000</div>
            <div className="change positive">+5% projeção</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts_grid">
          <div className="chart_card">
            <h2>Comparativo de Vendas</h2>
            <div className="chart_container">
              <ResponsiveContainer width="100%" height="100%">
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
          </div>

          <div className="chart_card">
            <h2>Produtos Mais Vendidos</h2>
            <div className="chart_container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularShoes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="sales_table">
          <h2>Vendas Recentes</h2>
          <div className="table_container">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nike Air Max</td>
                  <td>R$ 899,90</td>
                  <td>22/02/2024</td>
                  <td>
                    <span className="status_badge status_delivered">Entregue</span>
                  </td>
                </tr>
                <tr>
                  <td>Adidas Ultra</td>
                  <td>R$ 799,90</td>
                  <td>22/02/2024</td>
                  <td>
                    <span className="status_badge status_transit">Em trânsito</span>
                  </td>
                </tr>
                <tr>
                  <td>Puma RS-X</td>
                  <td>R$ 649,90</td>
                  <td>21/02/2024</td>
                  <td>
                    <span className="status_badge status_processing">Processando</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;