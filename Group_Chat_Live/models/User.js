const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const User = sequelize.define('user',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey:true
  },
  name:{
    type:Sequelize.STRING,
    allowNull: false
  },
  mail:{
    type:Sequelize.STRING,
    allowNull: false,
    unique:true

  },
  password:{
    type:Sequelize.STRING,
    allowNull: false,

  },
  isPremium:Sequelize.BOOLEAN,
  totalExp:{
    type:Sequelize.DOUBLE,
    defaultValue:0.0,
  }
})

module.exports = User