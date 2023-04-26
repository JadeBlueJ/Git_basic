const Expense = require('../models/Expense')
const User= require('../models/User')
const Sequelize = require('sequelize')
exports.getBoard = async (req, res, next) => {
    try {
      const topUsers = await User.findAll({
        attributes: [
          'name',
          'totalExp',
        ],
        // group: ['name'],
        order: [['totalExp', 'DESC']],
        limit: 10,
      });
      res.status(201).json(topUsers);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };
