const express = require('express');
const routes = require('./routes');

require('dotenv').config();
require('./database');

const app = express();

app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});