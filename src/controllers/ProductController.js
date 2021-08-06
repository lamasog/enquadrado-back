const Category = require('../models/Category');
const Product = require('../models/Product');

const { deleteFile } = require('../utils/deleteFile');
const { hasNull } = require('../utils/hasNull');

module.exports = {
  async create(req, res) {
    if (!req.isAdmin) {
      // deleta arquivo enviado no corpo da requisição
      if (req.file)
        deleteFile(req.file.key);
      return res.status(403).send({ msg: 'Forbidden' });
    }

    if (hasNull(req.body, ['id_category', 'name', 'description', 'price']) || !req.file) {
      if (req.file)
        deleteFile(req.file.key);
      return res.status(400).send({ msg: 'Missing required data' });
    }

    const { id_category, name, description, price } = req.body;

    try {
      const productExists = await Product.findAll({
        where: { name }
      });

      if (productExists.length > 0)
        return res.status(400).send({ msg: "Duplicate entries in the database" });

      const category = await Category.findByPk(id_category);

      if (!category) {
        deleteFile(req.file.key);
        return res.status(404).send({ msg: 'Category not found' });
      }

      let product = await Product.create({
        id_category,
        name,
        description,
        price,
        image_uri: `${process.env.API_URL}/images/${req.file.key}`
      });

      return res.status(200).send(product);

    } catch (error) {
      if (req.file)
        deleteFile(req.file.key);
      console.log(error);
      res.status(500).send({ msg: 'Internal server error' });
    }
  },

  async read(req, res) {
    if(hasNull(req.query, ['limit', 'page']))
      return res.status(400).send({ msg: 'Missing required data' });
    
    // Filtro por categoria
    const { id_category, limit, page } = req.query;

    let query = {
      where: {},
      limit: parseInt(limit),
      // Página (começa em 0) * limite por página
      offset: (page - 1) * limit,
      include: [{ association: 'category' }]
    };

    if(id_category)
      query.where.id_category = parseInt(id_category);

    try {
      const products = await Product.findAll(query);

      if(products.length === 0)
        return res.status(404).send({ msg: 'Not found' });

      return res.status(200).send(products);

    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: 'Internal server error' });
    }
  },

  async update(req, res) {
    if (!req.isAdmin) {
      if (req.file)
        deleteFile(req.file.key);
      return res.status(403).send({ msg: 'Forbidden' });
    }

    if (hasNull(req.params, ['id_product'])) {
      if (req.file)
        deleteFile(req.file.key);
      return res.status(400).send({ msg: 'Missing required data' });
    }

    const { id_product } = req.params;
    const { id_category, name, description, price } = req.body;

    try {
      const product = await Product.findByPk(id_product);

      if (!product)
        return res.status(404).send({ msg: 'Not found' });

      if (id_category) {
        const category = await Category.findByPk(id_category);
        if (!category)
          return res.status(404).send({ mag: 'Category not found' });
      }

      if (req.file) {
        if (product.image_uri) {
          const filename = product.image_uri.split('/images/')[1];
          deleteFile(filename);
        }

        await product.update({
          id_category,
          name,
          description,
          price,
          image_uri: `${process.env.API_URL}/images/${req.file.key}`
        });
      }
      else {
        await product.update({
          id_category,
          name,
          description,
          price,
        });
      }

      return res.status(200).send(product);

    } catch (error) {
      if (req.file)
        deleteFile(req.file.key);
      console.log(error);
      return res.status(500).send({ msg: 'Internal server error' });
    }
  },

  async delete(req, res) {
    if (!req.isAdmin)
      return res.status(403).send({ msg: 'Forbidden' });

    if (hasNull(req.params, ['id_product']))
      return res.status(400).send({ msg: 'Missing required data' });

    const { id_product } = req.params;

    try {
      const product = await Product.findByPk(id_product);

      if (!product)
        return res.status(404).send({ msg: 'Not found' });

      const filename = product.image_uri.split('/images/')[1];
      deleteFile(filename);
      await product.destroy();
      return res.status(200).send({ msg: 'Product deleted' });

    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: 'Internal server error' });
    }
  }
}