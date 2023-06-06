'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class park extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  park.init({
    fullName: DataTypes.STRING,
    parkCode: DataTypes.STRING,
    name: DataTypes.STRING,
    designation: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'park',
  });
  return park;
};