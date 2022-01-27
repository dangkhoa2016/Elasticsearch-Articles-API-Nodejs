
module.exports = function (sequelize, DataTypes) {
  const model = sequelize.define('articles', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    published_on: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    abstract: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shares: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'articles',
    timestamps: true,

    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  model.prototype.as_indexed_json = async function () {
    var document = this.dataValues;
    var categories = await this.getCategories().then(res => res.map(c => c.title));
    var authors = await this.getAuthors().then(res => res.map(a => ({ full_name: a.full_name() })));
    var comments = await this.getComments().then(res => res.map(c => c.as_indexed_json()));
    return { ...document, categories, authors, comments };
  };

  // model.indexName = "articles";

  return model;
};
