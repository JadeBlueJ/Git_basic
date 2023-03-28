const Expense = require('../models/Expense');

exports.postExpense = async (req,res,next)=>{
  try{
  const amount = req.body.amount
  const description = req.body.description
  const category = req.body.category
  const data = await Expense.create({amount:amount, description:description, category:category})
  res.status(201).json({newExpDetail:data})
  console.log('Added')
  }
  catch(e) 
  {
      res.status(500).json({
          error:e
      })
  }
}

exports.getExpense = async(req,res,next)=>{

  const expenses = await Expense.findAll()
  res.json({allExp:expenses})
}

exports.deleteExpense = async(req,res,next)=>{
  const delexp = req.params.id
  // console.log(deluser)
  Expense.findByPk(delexp)
  .then(exp=>{
    exp.destroy()
  })
  .then(result=>{
    console.log('Deleted')
  })
  .catch(e=>console.log(e))
}