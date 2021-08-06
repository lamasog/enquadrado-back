const Category = require('../models/Category');
const { hasNull } = require('../utils/hasNull');

module.exports = {
    async create(req, res) {
        if(!req.isAdmin)
            return res.status(403).send({ msg: 'Forbidden' });

        if(hasNull(req.body, ['name']))
            return res.status(400).send({ mag: 'Missing required data' });

        const { name } = req.body;

        try {
            const categoryExists = await Category.findAll({ 
                where: { name }
            });

            if(categoryExists.length > 0)
                return res.status(400).send({ msg: "Duplicate entries in the database" });

            const category = await Category.create({ name });
            return res.status(200).send(category);

        } catch (error) {
            console.log(error);
            return res.status(500).send({ msg: 'internal server error' });
        }
    },

    async read(req, res) {
        try {
            const categories = await Category.findAll();

            if (categories.length == 0)
                return res.status(404).send({ msg: 'Not found' });

            return res.status(200).send(categories);

        } catch (error) {
            console.log(error);
            return res.status(500).send({ msg: 'Internal server error' });
        }
    },

    async update(req, res) {
        if(!req.isAdmin)
            return res.status(403).send({ msg: 'Forbidden' });

        if(hasNull(req.params, ['id_category']))
            return res.status(400).send({ msg: 'Missing required data' });

        const { id_category } = req.params;
        const { name } = req.body;

        try {
            const category = await Category.findByPk(id_category);

            if (!category)
                return res.status(404).send({ msg: 'Not found' });

            await category.update({ name });
            return res.status(200).send(category);

        } catch (error) {
            console.log(error);
            return res.status(500).send({ msg: 'Internal server error' });
        }
    },

    async delete(req, res) {
        if(!req.isAdmin)
            return res.status(403).send({ msg: 'Forbidden' });

        if(hasNull(req.params, ['id_category']))
            return res.status(400).send({ msg: 'Missing required data' });

        const { id_category } = req.params;

        try {
            const category = await Category.findByPk(id_category);

            if (!category)
                return res.status(404).send({ msg: 'Not found' });

            await category.destroy();
            return res.status(200).send({ msg: 'Category deleted' });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ msg: 'Internal server error' });
        }
    }
}