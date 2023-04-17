const Expense = require('../models/Expense');
const User = require('../models/User')
const DLArchive= require('../models/DLArchive')
const sequelize = require('../util/database')
const S3Services = require('../services/s3services')
require('dotenv').config()
const UserServices = require('../services/userservices')

exports.getArchive=async(req,res,next)=>{
  try{
    const archives = await DLArchive.findAll({where:{userId:req.user.id},order: [['createdAt', 'DESC']]})
    return res.status(200).json({allDl:archives,success:true})
  }
  catch(err){
    console.log(err)
    return res.status(500).json({allDl:'',success:false})
  }
}


exports.downExpenses = async(req,res)=>{
 try{
    const expenses = await UserServices.getExpenses(req)
    const stringifiedExp = JSON.stringify(expenses)
    const filename=`Expense_${req.user.id}_${new Date()}.txt`
    const fileUrl = await S3Services.uploadToS3(stringifiedExp,filename)
    // console.log(fileUrl)
    await DLArchive.create({fileUrl:fileUrl,userId:req.user.id})
    res.status(201).json({fileUrl:fileUrl, success:true})
 }
 catch(err){
  res.status(500).json({fileUrl:'', success:false,error:err})
 }
}

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


