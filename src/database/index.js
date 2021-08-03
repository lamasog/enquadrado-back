const Sequelize = require('sequelize');
const db = require('../config/database');

const connection = new Sequelize(db);

connection.authenticate().
  then(() => console.log('Connected to the database...'))
  .catch((error) => console.log(error));

module.exports = connection;