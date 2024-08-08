const Sequelize = require('sequelize');
const db = require("../db")

const Participantes = db.define("participantes", {
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
    grupo_id: {
        type: Sequelize.STRING,
        allowNull: true  
    }
});

db.sync().then(() => {
    console.log('tabela Participantes Criada com Sucesso!');
}).catch((error) => {
    console.error('Erro Sync Model Participantes ', error);
});

module.exports = Participantes;
