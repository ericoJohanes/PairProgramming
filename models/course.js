'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Course.init({
    courseName: DataTypes.STRING,
    courseLevel: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    description: DataTypes.STRING,
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'User', key: 'id'
      }
    },
    CategoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Category', key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};