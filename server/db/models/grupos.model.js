const Sequelize = require('sequelize');
const db = require("../db")
const Participantes = require("./participantes.model")

const Grupos = db.define("grupos", {
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
    nivel: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    id_rival: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    is_batalha: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Grupos.hasMany(Participantes, { foreignKey: 'grupo_id', as: 'participantes' });
Participantes.belongsTo(Grupos, { foreignKey: 'grupo_id', as: 'grupo' });

db.sync().then(() => {
    console.log('tabela Grupos Criada com Sucesso!');
}).catch((error) => {
    console.error('Erro Sync Model Grupos ', error);
});

module.exports = Grupos;
