import React, { useEffect, useState } from "react";
import { FiUsers, FiDollarSign, FiBox, FiShoppingCart } from "react-icons/fi";
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
  Bar,
   Legend
} from "recharts";
import "../../assets/style/AdminDashboard.css";

const COLORS = ["#4EF55F", "#F5A04E", "#3D4B3E"];

const AdminDashboard = () => {
  const [receitaMensal, setReceitaMensal] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [faturamentoPorDia, setFaturamentoPorDia] = useState([]);
  const [vendasPorCategoria, setVendasPorCategoria] = useState([]);
  const [categoriasMensais, setCategoriasMensais] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [dadosHora, setDadosHora] = useState([]);
  const [dados, setDados] = useState([]);

  const [SelecionadoMes, setSelecionadoMes] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const [dataSelecionada, setDataSelecionada] = useState(() => {
  const hoje = new Date();
  return hoje.toISOString().split("T")[0]; // formato: yyyy-mm-dd
});


  // Faturamento mensal
  useEffect(() => {
    fetch("http://localhost:3005/api/products/faturamento/mensal")
      .then((res) => res.json())
      .then((data) => {
        const valor = parseFloat(data?.total_faturado || 0);
        setReceitaMensal(valor);
      })
      .catch((err) => console.error("Erro ao buscar receita mensal:", err));
  }, []);

  // Pedidos mensais
  useEffect(() => {
    fetch("http://localhost:3005/api/products/pedido/mensal")
      .then((res) => res.json())
      .then((data) => {
        setTotalPedidos(data?.total_pedidos || 0);
      })
      .catch((err) => console.error("Erro ao buscar total de pedidos:", err));
  }, []);

  // Pagamentos diarios
  useEffect(() => {
    fetch("http://localhost:3005/api/products/faturamento/diario")
      .then((res) => res.json())
      .then((data) => {
        const formatado = data.map((item) => ({
          date: new Date(item.data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
          total: parseFloat(item.faturamento_diario),
        }));
        setFaturamentoPorDia(formatado);
      })
      .catch((err) => console.error("Erro ao buscar faturamento diário:", err));
  }, []);

  // Categorias mais vendidas
  useEffect(() => {
    fetch("http://localhost:3005/api/products/categorias/mais-vendidas")
      .then((res) => res.json())
      .then((data) => {
        const formatado = data.map((item) => ({
          category: item.category,
          value: item.total_vendido,
        }));
        setVendasPorCategoria(formatado);
      })
      .catch((err) =>
        console.error("Erro ao buscar vendas por categoria:", err)
      );
  }, []);

  // Categorias mais vendidas por mes
  useEffect(() => {
    fetch("http://localhost:3005/api/products/categorias/mais-vendidas-mensal")
      .then((res) => res.json())
      .then((data) => {
        // Agrupa por mês
        const agrupado = {};
        data.forEach(({ mes, categoria, total_vendido }) => {
          if (!agrupado[mes]) agrupado[mes] = [];
          agrupado[mes].push({ category: categoria, value: total_vendido });
        });
        setCategoriasMensais(agrupado);
      })
      .catch((err) => console.error("Erro ao buscar categorias mensais:", err));
  }, []);

  // Produtos mais vendidos por mes
  useEffect(() => {
    const fetchMaisVendidos = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/products/produto/mais-vendidos-mensal?mes=${SelecionadoMes}`
        );
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchMaisVendidos();
  }, [SelecionadoMes]);

// Faturamento por hora
const [somaPedidosDia, setSomaPedidosDia] = useState(0);
const [somaReceitaDia, setSomaReceitaDia] = useState(0);

useEffect(() => {
  const carregarDadosHora = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/products/faturamento/por-hora?data=${dataSelecionada}`);
      const json = await response.json();

      const formatado = json.map(item => ({
        hora: `${item.hora}h`,
        Pedidos: item.total_pedidos,
        Receita: item.total_receita
      }));

      // Calcular os totais do dia
      const totalPedidoss = formatado.reduce((acc, curr) => acc + curr.Pedidos, 0);
      const totalReceita = formatado.reduce((acc, curr) => acc + parseFloat(curr.Receita), 0);

      setDadosHora(formatado);
      setSomaPedidosDia(totalPedidoss);
      setSomaReceitaDia(totalReceita);
    } catch (error) {
      console.error("Erro ao carregar dados por hora:", error);
    }
  };

  carregarDadosHora();
}, [dataSelecionada]);




















  const clientesAtivos = 120;
  const totalEstoque = 30;

  const dataPie = [
    { name: "Homens", value: 60 },
    { name: "Mulheres", value: 40 },
  ];

  

  const planDistribution = [
    { name: "Plano A", value: 45 },
    { name: "Plano B", value: 30 },
    { name: "Plano C", value: 25 },
  ];

  const expiracoes = [
    { cliente: "João", plano: "Plano A", vencimento: "2025-07-10" },
    { cliente: "Maria", plano: "Plano B", vencimento: "2025-07-12" },
    { cliente: "Pedro", plano: "Plano C", vencimento: "2025-07-15" },
  ];

  return (
    <div className="admin-dashboard">
      <main className="admin-main">
        <div className="admin-container">
          <div className="kpi-grid">
            {[
              {
                icon: <FiUsers />,
                title: "Clientes Ativos",
                value: clientesAtivos,
              },
              {
                icon: <FiBox />,
                title: "Produtos em Estoque",
                value: totalEstoque,
              },
              {
                icon: <FiDollarSign />,
                title: "Receita Mensal",
                value: `MZN ${receitaMensal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
              },
              {
                icon: <FiShoppingCart />,
                title: "Pedidos/Compras",
                value: totalPedidos,
              },
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
            <br />
  <input
    type="date"
    value={dataSelecionada}
    onChange={(e) => setDataSelecionada(e.target.value)}
    style={{ marginBottom: "10px", padding: "5px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
  />

  <h3>Faturamento e Pedidos por Hora</h3>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={dadosHora}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="hora" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Pedidos" fill="#1e88e5" />
      <Bar dataKey="Receita" fill="#81c784" />
    </BarChart>
  </ResponsiveContainer>

  <div style={{ marginTop: 20, textAlign: "right", fontSize: "15px", color: "#333" }}>
    <p><strong>Total de Pedidos:</strong> {somaPedidosDia}</p>
    <p><strong>Total de Receita:</strong> MZN {somaReceitaDia.toFixed(2)}</p>
  </div>
</div>




            <div className="chart-card">
              <h3>Faturamento Diario (Mensal)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={faturamentoPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `MZN ${value}`} />
                  <Line type="monotone" dataKey="total" stroke="#4EF55F" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {categoriasMensais && (
              <div className="chart-card">
                <h3>Vendas por Categoria</h3>

                <select
                  value={mesSelecionado}
                  onChange={(e) => setMesSelecionado(e.target.value)}
                >
                  <option value="">Selecione o mês</option>
                  {Object.keys(categoriasMensais).map((mes, i) => (
                    <option key={i} value={mes}>
                      {mes}
                    </option>
                  ))}
                </select>

                {mesSelecionado && (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoriasMensais[mesSelecionado]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value">
                        {categoriasMensais[mesSelecionado].map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}


              <div className="tabela-vendas-container">
      <div className="header-filtro">
        <h2>📊 Produtos Mais Vendidos</h2>
        <br />
        <select value={SelecionadoMes} onChange={(e) => setSelecionadoMes(e.target.value)}>
          {Array.from({ length: 12 }).map((_, i) => {
            const date = new Date();
            date.setMonth(i);
            const mes = String(i + 1).padStart(2, "0");
            return (
              <option key={mes} value={`2025-${mes}`}>
                {date.toLocaleString("pt-PT", { month: "long" })} 2025
              </option>
            );
          })}
        </select>
      </div>

      <table className="tabela-vendas">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Produto</th>
            <th>Vendas</th>
            <th>Faturamento (MZN)</th>
          </tr>
        </thead>
        <tbody>
          {dados.length > 0 ? (
            dados.map((item, i) => (
              <tr key={i}>
                <td>
                  <img src={item.imagem_principal} alt={item.nome_produto} className="produto-img" />
                </td>
                <td>{item.nome_produto}</td>
                <td>{item.total_vendas}</td>
                <td>{parseFloat(item.total_faturado).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Nenhum dado disponível para este mês.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

            <div className="chart-card">
              <h3>Distribuição por Gêneros</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dataPie}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label
                  >
                    {dataPie.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Vendas na Loja</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={vendasPorCategoria}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {vendasPorCategoria.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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
