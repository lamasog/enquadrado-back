const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('../models/User');

const connection = new Sequelize(db);

connection.authenticate().
  then(() => console.log('Connected to the database...'))
  .catch((error) => console.log(error));

User.init(connection);

module.exports = connection;