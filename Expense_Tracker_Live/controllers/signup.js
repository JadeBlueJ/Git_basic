const User = require('../models/User');

exports.postUser = async (req,res,next)=>{
  try{
  const name = req.body.name
  const mail = req.body.mail
  const password = req.body.password

  const userExists = await User.findOne({ mail: mail });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
  const data = await User.create({name:name, mail:mail, password:password})
  res.status(201).json({newUserDetail:data})
  console.log('Added')
  }
  catch(e) 
  {
      res.status(500).json({
          error:e
      })
  }
}

// exports.getUsers = async(req,res,next)=>{

//   const expenses = await User.findAll()
//   res.json({allExp:expenses})
// }