const Sequelize = require('sequelize');
const db = require("../db")

const Dados = db.define("dados", {
    cadastrados: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pix: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    authorization_ML: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    WebHook: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    valor: {
      type: Sequelize.STRING,
      allowNull: false,
    }
});

db.sync().then(() => {
    console.log('tabela Dados Criada com Sucesso!');
}).catch((error) => {
    console.error('Erro Sync Model Dados ', error);
});

module.exports = Dados;