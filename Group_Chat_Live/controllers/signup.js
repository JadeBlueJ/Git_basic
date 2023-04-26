const User = require('../models/User');
const bcrypt = require('bcrypt')


exports.postUser = async (req,res,next)=>{
  try{
  const name = req.body.name
  const mail = req.body.mail
  const phone =req.body.phone
  const password = req.body.password

  let userExists = await User.findOne({where:{ mail: mail }});
    if (userExists) {
      console.log(userExists)
      return res.status(400).json({ message: "Email already exists" });
    }
    else{
      bcrypt.hash(password,10, async (err,hashed)=>{
        if(err) console.log(err)
        const data = await User.create({name:name, mail:mail,phone:phone, password:hashed})
        console.log('Added')
        return res.status(201).json({newUserDetail:data,message:'New User created'})
    }) 
    }
  }
  catch(err) 
  {
      res.status(500).json({
          message:err.message, success:false
      })
  }
}

