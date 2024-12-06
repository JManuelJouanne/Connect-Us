'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cell extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.Game, {
          foreignKey: 'gameId',
        });
    }
  }
  Cell.init({
    gameId: DataTypes.INTEGER,
    column: DataTypes.INTEGER,
    row: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cell',
  });
  return Cell;
};