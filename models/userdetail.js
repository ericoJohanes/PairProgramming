'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User)
    }
  }
  UserDetail.init({
    fullName: DataTypes.STRING,
    class: DataTypes.STRING,
    school: DataTypes.STRING,
    age: DataTypes.INTEGER,
    about: DataTypes.STRING,
    teacher: DataTypes.BOOLEAN,
    UserId: {
      type: DataTypes.INTEGER, allowNull: false,
      references: { model: 'User', key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'UserDetail',
  });
  return UserDetail;
};