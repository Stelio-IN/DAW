import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../assets/style/admindashboard.css';

const AdminCategoria = () => {
  const categorias = [
    { id: 1, nome: 'Clássicos', produtos: 120 },
    { id: 2, nome: 'Sandálias', produtos: 80 },
    { id: 3, nome: 'Infantil', produtos: 95 },
    { id: 4, nome: 'Acessórios', produtos: 60 },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Gerenciamento de Categorias</h1>
      </header>

      <main className="dashboard-content">
        {/* Tabela de categorias */}
        <div className="table-container">
          <h2>Lista de Categorias</h2>
          <table className="category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Produtos</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.id}</td>
                  <td>{categoria.nome}</td>
                  <td>{categoria.produtos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gráfico de categorias */}
        <div className="chart-container">
          <h2>Produtos por Categoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="produtos" fill="#2563eb" name="Produtos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default AdminCategoria;
