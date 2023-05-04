const User = require('../models/User');
const bcrypt = require('bcrypt')


exports.postUser = async (req,res,next)=>{
  try{
    const fname = req.body.fname
    const email = req.body.email
    const phone =req.body.phone
    const password = req.body.password


    let userExists = await User.findOne({where:{ email: email }});

      if (userExists) {
        console.log('User data: ',userExists)
        return res.status(200).json({ message: "Email already exists, please login" });
      }
      else{
        bcrypt.hash(password,10, async (err,hashed)=>{
          if(err) console.log(err)
          const data = await User.create({fname:fname, email:email,phone:phone, password:hashed})
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

