const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./server");

class Categoria extends Model {}
Categoria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Categoria",
    freezeTableName: true,
    timestamps: false,
  },
);

class Usuario extends Model {}
Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perfil: {
      type: DataTypes.ENUM("usuario", "admin", "lojista"),
      allowNull: false,
      defaultValue: "usuario",
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    freezeTableName: true,
    timestamps: false,
  },
);

class Produto extends Model {}
Produto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    status: {
      type: DataTypes.ENUM("ativo", "inativo"),
      allowNull: false,
      defaultValue: "ativo",
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Produto",
    freezeTableName: true,
    timestamps: false,
  },
);

Produto.belongsTo(Categoria, { as: "categoria", foreignKey: "categoria_id" });
Categoria.hasMany(Produto, { as: "produtos", foreignKey: "categoria_id" });

Produto.belongsTo(Usuario, { as: "usuario", foreignKey: "usuario_id" });
Usuario.hasMany(Produto, { as: "produtos", foreignKey: "usuario_id" });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Modelos sincronizados com o banco de dados.");
  })
  .catch((error) => {
    console.error("Erro ao sincronizar modelos: ", error);
  });

module.exports = { Categoria, Usuario, Produto };
