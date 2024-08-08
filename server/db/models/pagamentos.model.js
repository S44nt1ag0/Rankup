const Sequelize = require('sequelize');
const db = require("../db")

const Pagamentos = db.define("pagamentos", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    transaction_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    id_pagamento: {
      type: Sequelize.STRING,
      allowNull: false
    },
    id_usuario: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

db.sync().then(() => {
    console.log('tabela Pagamentos Criada com Sucesso!');
}).catch((error) => {
    console.error('Erro Sync Model Pagamentos ', error);
});

module.exports = Pagamentos;