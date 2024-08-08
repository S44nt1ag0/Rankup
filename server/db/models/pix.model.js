const Sequelize = require('sequelize');
const db = require("../db")

const Pix = db.define("pix", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    pix_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false
    }
});

db.sync().then(() => {
    console.log('tabela Pix Criada com Sucesso!');
}).catch((error) => {
    console.error('Erro Sync Model Pix ', error);
});

module.exports = Pix;