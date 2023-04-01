const User = require('../models/User');

exports.postUser = async (req,res,next)=>{
  try{
  const name = req.body.name
  const mail = req.body.mail
  const password = req.body.password

  let userExists = await User.findOne({where:{ mail: mail }});
    if (userExists) {
      console.log(userExists)
      return res.status(400).json({ message: "Email already exists" });
    }
  const data = await User.create({name:name, mail:mail, password:password})
  console.log('Added')
  return res.status(201).json({newUserDetail:data})
  
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