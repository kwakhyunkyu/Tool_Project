'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Columns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Cards, {
        sourceKey: 'columnId',
        foreignKey: 'columnId',
      });
      this.belongsTo(models.Boards, {
        targetKey: 'boardId',
        foreignKey: 'boardId',
      });
    }
  }
  Columns.init(
    {
      columnId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      boardId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      order: {
        allowNull: false,
        type: DataTypes.INTEGER,
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
      modelName: 'Columns',
    },
  );
  return Columns;
};
