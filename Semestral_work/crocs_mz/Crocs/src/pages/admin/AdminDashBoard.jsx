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
  Legend,
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
const [produtosMargem, setProdutosMargem] = useState([]);
  const [lucroMensal, setLucroMensal] = useState(0);
  const [lucroSemPromo, setLucroSemPromo] = useState(0);
  const [perdaPromocao, setPerdaPromocao] = useState(0);
  const [vendasPromocao, setVendasPromocao] = useState(0);

  const [SelecionadoMes, setSelecionadoMes] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
  });

  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().split("T")[0]; // formato: yyyy-mm-dd
  });

  const ticketMedio = totalPedidos > 0 ? receitaMensal / totalPedidos : 0;

  //lucro mensal
  useEffect(() => {
    fetch("http://localhost:3005/api/products/lucro/mensal")
      .then((res) => res.json())
      .then((data) => {
        setLucroMensal(parseFloat(data?.lucro_total || 0));
      })
      .catch((err) => console.error("Erro ao buscar lucro mensal:", err));
  }, []);

  //perda com promocao
  useEffect(() => {
    fetch("http://localhost:3005/api/products/perdas-promocao/mensal")
      .then((res) => res.json())
      .then((data) => {
        setPerdaPromocao(parseFloat(data?.perda_lucro_promocao || 0));
      })
      .catch((err) => console.error("Erro ao buscar perdas:", err));
  }, []);

  //Nr de vendas em promocao
  useEffect(() => {
    fetch("http://localhost:3005/api/products/pedidos-promocao/mensal")
      .then((res) => res.json())
      .then((data) => {
        setVendasPromocao(data?.total_itens_promocao || 0);
      })
      .catch((err) => console.error("Erro ao buscar vendas promoção:", err));
  }, []);

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
        console.error("Erro ao buscar vendas por categoria:", err),
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
          `http://localhost:3005/api/products/produto/mais-vendidos-mensal?mes=${SelecionadoMes}`,
        );
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchMaisVendidos();
  }, [SelecionadoMes]);

  // seleciona o mes actual no grafico categorias
  useEffect(() => {
    if (categoriasMensais) {
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, "0");

      const mesAtual = `${ano}-${mes}`;

      if (categoriasMensais[mesAtual]) {
        setMesSelecionado(mesAtual);
      } else {
        // Se não existir o mês atual, pega o primeiro disponível
        const primeiroMes = Object.keys(categoriasMensais)[0];
        setMesSelecionado(primeiroMes);
      }
    }
  }, [categoriasMensais]);

  // Productos com Maior margem
  useEffect(() => {
  const fetchProdutosMaiorMargem = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/products/produto/maior-margem?mes=${SelecionadoMes}`
      );

      const data = await response.json();
      setProdutosMargem(data);
    } catch (error) {
      console.error("Erro ao buscar produtos com maior margem:", error);
    }
  };

  fetchProdutosMaiorMargem();
}, [SelecionadoMes]);



  const dataPie = [
    { name: "Homens", value: 60 },
    { name: "Mulheres", value: 40 },
  ];

  return (
    <div className="admin-dashboard">
      <main className="admin-main">
        <div className="admin-container">
          <div className="kpi-grid">
            {[
              {
                icon: <FiDollarSign />,
                title: "Lucro Mensal",
                value: `MZN ${lucroMensal.toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                })}`,
              },
              {
                icon: <FiShoppingCart />,
                title: "Nº vendas em Promoção",
                value: vendasPromocao,
              },
              {
                icon: <FiShoppingCart />,
                title: "Perdas Promocionais",
                value: `MZN ${perdaPromocao.toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                })}`,
              },
              {
                icon: <FiDollarSign />,
                title: "Receita Mensal Total",
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
              {
                icon: <FiDollarSign />,
                title: "Ticket Médio",
                value: `MZN ${ticketMedio.toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                })}`,
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

            <div className="tabela-vendas-container">
              <div className="header-filtro">
                <h2>📊 Produtos Mais Vendidos</h2>
                <br />

                <select
                  value={SelecionadoMes}
                  onChange={(e) => setSelecionadoMes(e.target.value)}
                >
                  {Array.from({ length: 12 }).map((_, i) => {
                    const hoje = new Date();
                    const anoAtual = hoje.getFullYear();

                    const date = new Date(anoAtual, i);
                    const mes = String(i + 1).padStart(2, "0");

                    return (
                      <option key={mes} value={`${anoAtual}-${mes}`}>
                        {date.toLocaleString("pt-PT", { month: "long" })}{" "}
                        {anoAtual}
                      </option>
                    );
                  })}
                </select>
              </div>

              <table className="tabela-vendas">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Cor</th>
                    <th>Tamanho</th>
                    <th>Vendas</th>
                    <th>Faturamento (MZN)</th>
                  </tr>
                </thead>

                <tbody>
                  {dados.length > 0 ? (
                    dados.map((item, i) => (
                      <tr key={i}>
                        <td className="produto-info">
                          <img
                            src={item.imagem_principal || "/placeholder.png"}
                            alt={item.nome_produto}
                            className="produto-img"
                          />
                          <div>
                            <strong>{item.nome_produto}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="badge-cor">{item.cor || "-"}</span>
                        </td>

                        <td>
                          <span className="badge-tamanho">
                            {item.tamanho || "-"}
                          </span>
                        </td>

                        <td className="vendas">{item.total_vendas}</td>

                        <td className="faturamento">
                          {parseFloat(item.total_faturado).toLocaleString(
                            "pt-PT",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>Nenhum dado disponível para este mês.</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                          ),
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}

            <div className="tabela-vendas-container">
  <div className="header-filtro">
    <h2>💰 Produtos com Maior Margem</h2>
  </div>

  <table className="tabela-vendas">
    <thead>
      <tr>
        <th>Produto</th>
        <th>Receita (MZN)</th>
        <th>Custo (MZN)</th>
        <th>Lucro (MZN)</th>
        <th>Margem %</th>
      </tr>
    </thead>

    <tbody>
      {produtosMargem.length > 0 ? (
        produtosMargem.map((item, i) => {
          const receita = parseFloat(item.receita || 0);
          const custo = parseFloat(item.custo || 0);
          const lucro = parseFloat(item.lucro || 0);

          const margem =
            receita > 0 ? (lucro / receita) * 100 : 0;

          return (
            <tr key={i}>
              <td className="produto-info">
                <img
                  src={item.imagem_principal || "/placeholder.png"}
                  alt={item.produto}
                  className="produto-img"
                />
                <div>
                  <strong>{item.produto}</strong>
                </div>
              </td>

              <td>
                {receita.toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                })}
              </td>

              <td>
                {custo.toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                })}
              </td>

              <td className="faturamento">
                {lucro.toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                })}
              </td>

              <td
                style={{
                  fontWeight: "600",
                  color:
                    margem >= 40
                      ? "#059669"
                      : margem < 20
                      ? "#dc2626"
                      : "#d97706",
                }}
              >
                {margem.toFixed(2)}%
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan={5}>
            Nenhum dado disponível para este mês.
          </td>
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

          
          </div>

      
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
