const express = require('express');
const routes = express.Router();

const multer = require('multer');
const imgConfig = require('./middlewares/imgConfig');

const UserController = require('./controllers/UserController');
const CategoryController = require('./controllers/CategoryController');
const ProductController = require('./controllers/ProductController');
const authentication = require('./middlewares/auth');

routes.get('/', (req, res) => {
  return res.status(200).json('Rota inicial');
});

routes.post('/login', UserController.login);
routes.post('/users', UserController.create);
routes.get('/users', authentication, UserController.read);
routes.put('/users', authentication, UserController.update);
routes.delete('/users', authentication, UserController.delete);

routes.post('/categories', authentication, CategoryController.create);
routes.get('/categories', CategoryController.read);
routes.put('/categories/:id_category', authentication, CategoryController.update);
routes.delete('/categories/:id_category', authentication, CategoryController.delete);

// Recebe apenas uma imagem no campo "image"
routes.post('/products', authentication, multer(imgConfig).single('image'), ProductController.create);
routes.get('/products', ProductController.read);
routes.put('/products/:id_product', authentication, multer(imgConfig).single('image'), ProductController.update);
routes.delete('/products/:id_product', authentication, ProductController.delete);

module.exports = routes;
