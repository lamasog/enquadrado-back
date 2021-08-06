const Sequelize = require('sequelize');
const db = require('../config/database');

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const connection = new Sequelize(db);

connection.authenticate().
  then(() => console.log('Connected to the database...'))
  .catch((error) => console.log(error));

User.init(connection);
Product.init(connection);
Category.init(connection);

Category.associate(connection.models);
Product.associate(connection.models);

module.exports = connection;