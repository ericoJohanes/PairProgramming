'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentCourse.belongsTo(models.User)
      StudentCourse.belongsTo(models.Course)
    }
  }
  StudentCourse.init({
    StudentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    CourseId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Courses',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'StudentCourse',
  });
  return StudentCourse;
};