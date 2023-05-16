const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Room =  sequelize.define('room',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
      },
      name:{
        type:Sequelize.STRING,
        allowNull: false,
      },
      createdBy:{
        type:Sequelize.STRING,
        allowNull: false,
      },
      })
    
module.exports = Room