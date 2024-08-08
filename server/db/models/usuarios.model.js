const Sequelize = require('sequelize');
const db = require("../db")

const Usuarios = db.define("usuarios", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    membership: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
});

db.sync().then(() => {
    console.log('tabela Usuario Criada com Sucesso!');
}).catch((error) => {
    console.error('Erro Sync Model Usuarios ', error);
});

module.exports = Usuarios;
