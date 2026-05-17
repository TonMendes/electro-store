const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "produtos",
  "avaliacao_fullstack",
  "avaliacao_fullstack",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com banco de dados estabelecida com sucesso.");
  })
  .catch((error) => {
    console.error("Erro ao se conectar ao banco de dados: ", error);
  });

module.exports = sequelize;
