const Sequelize = require('sequelize')
require('dotenv').config()
const DBpwd = process.env.DB_PASSWORD
const host = process.env.HOST
// console.log(DBpwd)
const sequelize = new Sequelize('expense_app','root',DBpwd,
{dialect:'mysql',host:host})

 module.exports=sequelize