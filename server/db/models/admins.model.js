const Sequelize = require('sequelize');
const db = require("../db")

const Admins = db.define("admin", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    usuario: {
      type: Sequelize.STRING,
      allowNull: false
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: false
    }
});

db.sync().then(() => {
    console.log('tabela Admins Criada com Sucesso!');
}).catch((error) => {
    console.error('Erro Sync Model Admins ', error);
});

module.exports = Admins;