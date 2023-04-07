const Expense = require('../models/Expense');
const User = require('../models/User')

exports.postExpense = async (req,res,next)=>{
  try{
  const amount = req.body.amount
  const description = req.body.description
  const category = req.body.category
  const data = await Expense.create({amount:amount, description:description, category:category,userId:req.user.id})
  console.log('Added')
  const user = await User.findByPk(req.user.id)
  if(!user.totalExp==null) user.totalExp =0.0
  else user.totalExp+=parseFloat(amount)
  await user.save()
  return res.status(201).json({newExpDetail:data})

  }
  catch(e) 
  {
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

exports.deleteExpense = async(req,res,next)=>{
  const delexp = req.params.id
  console.log(req.user.id)
  if(delexp==undefined||delexp.length==0)
  return res.status(400).json({success:false})
    Expense.destroy({where:{id:delexp,userId:req.user.id}}).then(()=>{
      return res.status(200).json({success:false,message:'Deleted Successfully'})
    })
    .catch(err=>{
      console.log(err)
      return res.status(500).json({success:false,message:'Failed'})
    })
  }