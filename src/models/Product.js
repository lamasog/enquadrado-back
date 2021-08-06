const { Model, DataTypes } = require('sequelize');

class Product extends Model {
    static init(connection) {
        super.init({
            id_category: DataTypes.INTEGER,
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            price: DataTypes.FLOAT,
            image_uri: DataTypes.STRING,
            created_at: DataTypes.DATE
        }, {
            sequelize: connection
        })
    }
    static associate(models) {
        this.belongsTo(models.Category, { foreignKey: 'id_category', as: 'category' })
    }
}

module.exports = Product;