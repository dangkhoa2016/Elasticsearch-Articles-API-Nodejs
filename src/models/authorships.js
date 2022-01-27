module.exports = function(sequelize, DataTypes) {
  return sequelize.define('authorships', {
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
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'authors',
        key: 'id'
      }
    },
  }, {
    sequelize,
    tableName: 'authorships',
    timestamps: true,
    
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "index_authorships_on_article_id",
        fields: [
          { name: "article_id" },
        ]
      },
      {
        name: "index_authorships_on_author_id",
        fields: [
          { name: "author_id" },
        ]
      },
    ]
  });
};
