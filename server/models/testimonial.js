'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Testimonial extends Model {
    static associate(models) {
      // Tidak ada asosiasi untuk model ini
    }
  }
  Testimonial.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Testimonial',
  });
  return Testimonial;
};