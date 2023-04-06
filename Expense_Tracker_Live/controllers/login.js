const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.checkUser = async (req,res,next)=>{
  try{
    const mail = req.body.mail
    const password = req.body.password
    const user = await User.findOne({where:{mail:mail}})    

    if(user){
            bcrypt.compare(password, user.password,(err,result)=>{
            if(!err && result)
            {                   
                    console.log('You are now logged in, user details:',user.id,user.name)

                    return res.status(201).json({message:'User logged in successfully',success:true,token:generateAccessToken(user.id,user.name)})
            }
            else
            {   
                console.log('Passwords do not match')
                return res.status(401).json({message:'Passwords do not match',success:false})
            }
        })    
        }
    else 
        {   
            console.log('Failed to login-Email not registered')
            return res.status(404).json({ message: 'Failed to login-Email not registered', success: false });
        }
    }
    catch(err) {
            res.status(500).json({
                message:err,
                success:false
            })
    }
}

const generateAccessToken=(id,name)=>{
    return jwt.sign({userId:id,name:name},'admin')
  }
  