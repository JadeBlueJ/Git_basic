const Sequelize = require('sequelize')


const sequelize = new Sequelize('quiz_app','root','admin',
{dialect:'mysql',host:'localhost'})

 module.exports=sequelize