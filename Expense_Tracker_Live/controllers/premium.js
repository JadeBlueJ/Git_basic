const Razorpay = require('razorpay')
const Expense = require('../models/Expense')
const User= require('../models/User')
const Sequelize = require('sequelize')
exports.getBoard = async (req, res, next) => {
    try {
      const topUsers = await Expense.findAll({
        attributes: [
          'userid',
          [Sequelize.fn('sum', Sequelize.col('amount')), 'totalExpense'],
        ],
        group: ['userid'],
        include: [{ model: User, attributes: ['name'] }],
        order: [[Sequelize.literal('totalExpense'), 'DESC']],
        limit: 10,
      });
      res.status(201).json(topUsers);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };
