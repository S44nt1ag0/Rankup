const { Sequelize } = require("sequelize");
const dotenv = require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize(
     dbName,
     dbUser,
     dbPassword,
     {
       host: dbHost,
       dialect: 'mysql'
     }
);

sequelize.authenticate().then(() => {
    console.log('Conectado com Sucesso');
}).catch((error) => {
    console.error('Erro ao Acessar banco de dados: ', error);
});
  
module.exports = sequelize;