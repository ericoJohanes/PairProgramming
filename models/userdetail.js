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

    get age() {
      const thisYear = new Date().getFullYear()
      const birthYear = new Date(this.dateOfBirth).getFullYear()

      return thisYear - birthYear
    }

    static dateConvert(date) {
      date = JSON.stringify(date).split('T')[0].slice(1)
      return date
    }

    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User)
    }
  }
  UserDetail.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'fullName cannot be empty' },
        notNull: { msg: 'fullName cannot be null' }
      }
    },
    profilePicture: DataTypes.STRING,
    school: DataTypes.STRING,
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'dateOfBirth cannot be empty' },
        notNull: { msg: 'dateOfBirth cannot be null' }
      }
    },
    about: DataTypes.STRING,
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: { msg: 'about cannot be empty' },
        notNull: { msg: 'about cannot be null' }
      }
    }
  }, {
    sequelize,
    modelName: 'UserDetail',
  });
  return UserDetail;
};