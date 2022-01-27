module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categories', {
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
  }, {
    sequelize,
    tableName: 'categories',
    timestamps: true,
    
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
};
