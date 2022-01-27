module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('authors', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'authors',
    timestamps: true,
    
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }, {
    /*
    getterMethods: {
      full_name() {
        return `${this.first_name} ${this.last_name}`;
      }
    },
    */
  });

  model.prototype.full_name = function() {
    return `${this.first_name} ${this.last_name}`
  };

  return model;
};
