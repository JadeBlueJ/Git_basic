const Sequelize = require('sequelize')
// require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME,'root',process.env.DB_PASSWORD,
{dialect:'mysql',host:process.env.HOST})

 module.exports=sequelize