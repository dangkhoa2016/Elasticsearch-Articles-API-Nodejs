module.exports = function(sequelize, DataTypes) {
  return sequelize.define('articles_categories', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'articles',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'articles_categories',
    timestamps: false,
    indexes: [
      {
        name: "index_articles_categories_on_article_id",
        fields: [
          { name: "article_id" },
        ]
      },
      {
        name: "index_articles_categories_on_category_id",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });
};
