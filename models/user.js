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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'email cannot be empty' },
        notNull: { msg: 'email cannot be null' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'password cannot be empty' },
        notNull: { msg: 'password cannot be null' }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'role cannot be empty' },
        notNull: { msg: 'role cannot be null' }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user, opt) => {
    user.password = User.hashingPass()
  })

  return User;
};
