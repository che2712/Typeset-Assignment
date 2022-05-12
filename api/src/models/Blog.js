const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  
  sequelize.define('blog', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tittle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{timestamps: false});
};


