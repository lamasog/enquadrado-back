const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');
const authentication = require('./middlewares/auth');

routes.get('/', (req, res) => {
  return res.status(200).json('Rota inicial');
});

routes.post('/login', UserController.login);
routes.post('/users', UserController.create);
routes.get('/users', authentication, UserController.read);
routes.put('/users', authentication, UserController.update);
routes.delete('/users', authentication, UserController.delete);

module.exports = routes;