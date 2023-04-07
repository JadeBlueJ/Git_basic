const Expense = require('../models/Expense');
const User = require('../models/User')
const sequelize = require('../util/database')



exports.postExpense = async (req,res,next)=>{
  const t = await sequelize.transaction()
  const {amount,description,category} = req.body
  try{
  const data = await Expense.create({amount:amount, description:description, category:category,userId:req.user.id},{transaction:t})
  console.log('Added')
  const user = await User.findByPk(req.user.id)
  if(!user.totalExp==null) user.totalExp =0.0
  else user.totalExp+=parseFloat(amount)
  await user.save({ transaction: t })
  await t.commit()
  return res.status(201).json({newExpDetail:data})

  }
  catch(e) 
  {   await t.rollback()
      res.status(500).json({
          error:e
      })
  }
}

exports.getExpense = async(req,res,next)=>{
          //or req.user.getExpenses()[from sql]
    await Expense.findAll({where:{userId:req.user.id}}).then(expenses=>{
    return res.status(200).json({allExp:expenses, success:true})
  })

}

exports.deleteExpense = async (req, res, next) => {
  const delexp = req.params.id;
  const t = await sequelize.transaction();
  const user = await User.findByPk(req.user.id);

  if (delexp == undefined || delexp.length == 0) {
    return res.status(400).json({ success: false });
  }

  try {
    const expense = await Expense.findOne({
      where: { id: delexp, userId: req.user.id },
      transaction: t,
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    await Expense.destroy({
      where: { id: delexp, userId: req.user.id },
      transaction: t,
    });

    user.totalExp -= expense.amount;
    await user.save({ transaction: t });

    await t.commit();
    return res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res.status(500).json({ success: false, message: "Failed" });
  }
};
