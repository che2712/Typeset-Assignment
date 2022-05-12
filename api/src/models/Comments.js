const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  
  sequelize.define('comments', {
    author: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },{timestamps: false});
};