const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Message = sequelize.define('message',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey:true
  },
  username:{
    type:Sequelize.STRING,
    allowNull: false
  },
  text:{
    type:Sequelize.STRING,
    allowNull: false
  },
  isIntro:Sequelize.BOOLEAN,
  isMedia:Sequelize.BOOLEAN,
  alt: Sequelize.STRING,
  fileType:Sequelize.STRING,
  
})

module.exports = Message