const _ = require('lodash-core');

module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('comments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pick: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'articles',
        key: 'id'
      }
    },
  }, {
    sequelize,
    tableName: 'comments',
    timestamps: true,
    
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "index_comments_on_article_id",
        fields: [
          { name: "article_id" },
        ]
      },
    ]
  });

  model.prototype.as_indexed_json = function() {
    return _.pick(this.dataValues, ['body', 'stars', 'pick', 'user', 'user_location']);
  };

  return model;
};
