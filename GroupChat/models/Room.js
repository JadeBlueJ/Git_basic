const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const { v4: uuidv4 } = require('uuid');

const Room = sequelize.define('room', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isPrivate: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  last_activity: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  last_message: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  last_userId:Sequelize.INTEGER,
  last_userName:Sequelize.STRING
});

module.exports = Room;
