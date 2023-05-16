const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Room_User =  sequelize.define('room_user',{
id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey:true
    },
    userId: {
    type: Sequelize.INTEGER,
    references: {
        model: 'users',
        key: 'id'
    }
    },
    roomId: {
    type: Sequelize.INTEGER,
    references: {
        model: 'rooms',
        key: 'id'
    }
    },
    isAdmin:Sequelize.BOOLEAN,
});
    
module.exports = Room_User