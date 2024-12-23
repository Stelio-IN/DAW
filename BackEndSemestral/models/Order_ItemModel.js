export default (sequelize, DataTypes) => {
  return sequelize.define('OrderItem', {
    order_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pagamento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'payments', // Nome da tabela de pagamentos
        key: 'pagamento_id',
      },
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products', // Nome da tabela de produtos
        key: 'product_id',
      },
    },
    nome_produto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    preco_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, { 
    tableName: 'order_items', // Nome da tabela no banco
    timestamps: false, // Remove as colunas createdAt e updatedAt
  });
};
