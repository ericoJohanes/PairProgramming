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
      Course.belongsToMany(models.User, { through: models.StudentCourse, foreignKey: 'CourseId' })
    }
  }
  Course.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'name cannot be empty' },
        notNull: { msg: 'name cannot be null' }
      }
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'level cannot be empty' },
        notNull: { msg: 'level cannot be null' }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'duration cannot be empty' },
        notNull: { msg: 'duration cannot be null' },
        isNumeric: { msg: 'duration must be a number' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'description cannot be empty' },
        notNull: { msg: 'description cannot be null' }
      }
    },
    TeacherId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: { msg: 'name cannot be empty' },
        notNull: { msg: 'name cannot be null' }
      }
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};