'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Player, {
        foreignKey: 'id',
      });
    }
  }
  User.init({
    username: {
      type:DataTypes.STRING,
      validate: {
        isAlphanumeric: {
          msg: 'El nombre de usuario debe ser alfanumérico'
        }
      }
    },
    mail: {
      type:DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'El email debe cumplir con el formato de correo electrónico'
        }
      }
    },
    password: {
      type:DataTypes.STRING,
      validate: {
        isValidPassword(value) {
          if (value.length < 8 || !value.match(/[a-z]/) || !value.match(/[0-9]/)) {
            throw new Error('La contraseña debe tener al menos 8 caracteres, una letra y un número');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};