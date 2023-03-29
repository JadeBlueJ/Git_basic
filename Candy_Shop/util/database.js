const Sequelize = require('sequelize')

const sequelize = new Sequelize('candy_shop','root','admin',
{dialect:'mysql',host:'localhost'})

 module.exports=sequelize