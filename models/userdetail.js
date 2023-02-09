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
      date = new Date(date)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      date = date.toUTCString()

      month = `${month}`.length < 2 ? `0${month}` : month
      day = `${day}`.length < 2 ? `0${day}` : day

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