'use strict';
const {
  Model
} = require('sequelize');
const bcryptjs = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    hashingPass() {
      let salt = bcryptjs.genSaltSync(7);
      let passHashed = bcryptjs.hashSync(this.password, salt)
      return passHashed
    }

    static associate(models) {
      // define association here

      User.hasOne(models.UserDetail)
      User.belongsToMany(models.Course, { through: models.StudentCourse, foreignKey: 'StudentId' })

    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user, opt) => {
    user.password = user.hashingPass()
  })

  return User;
};
