'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Boards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Columns, {
        sourceKey: 'boardId',
        foreignKey: 'boardId',
      });
      this.hasMany(models.UserBoards, {
        sourceKey: 'boardId',
        foreignKey: 'boardId',
      });
    }
  }
  Boards.init(
    {
      boardId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      color: {
        allowNull: false,
        type: DataTypes.ENUM('WHITE', 'RED', 'GREEN'),
        defaultValue: 'WHITE',
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Boards',
    },
  );
  return Boards;
};
