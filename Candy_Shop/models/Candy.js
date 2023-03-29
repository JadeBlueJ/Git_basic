const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Candy = sequelize.define('candy',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey:true
  },
  cname:{
    type:Sequelize.STRING,
    allowNull: false
  },
  description:{
    type:Sequelize.STRING,
    allowNull: false,
  },
  cprice:{
    type:Sequelize.INTEGER,
    allowNull: false,
  },
  qty:{
    type:Sequelize.INTEGER,
    allowNull: false,

  },
})

module.exports = Candy