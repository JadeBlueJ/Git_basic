const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const User = sequelize.define('user',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey:true
  },
  fname:{
    type:Sequelize.STRING,
    allowNull: false
  },
  email:{
    type:Sequelize.STRING,
    allowNull: false,
    unique:true

  },
  phone:{
    type:Sequelize.STRING,
    allowNull: false,
    unique:true
  },
  password:{
    type:Sequelize.STRING,
    allowNull: false,

  },
  bestScore:{
    type:Sequelize.BIGINT,
    default:null

  },
  bestTime:{
    type:Sequelize.TIME,
    default:null

  },
  newScore:{
    type:Sequelize.BIGINT,
    default:null

  },
  newTime:{
    type:Sequelize.TIME,
    default:null

  },
})

module.exports = User