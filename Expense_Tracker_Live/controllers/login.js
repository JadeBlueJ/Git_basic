const User = require('../models/User');

exports.checkUser = async (req,res,next)=>{
  try{
    const mail = req.body.mail
    const password = req.body.password

    const mailExists = await User.findOne({where:{mail:mail}})    
    if(mailExists){
        const passCorrect = await User.findOne({where:{mail:mail,password:password}})
            if(passCorrect)
            {   
                console.log('You are now logged in')
                return res.alert('Success').status(201).json({message:'User logged in successfully',success:true})
            }
            else
            {   
                console.log('Passwords do not match')
                return res.status(500).json({message:'Passwords do not match',success:false})
            }
        }
    else 
    {       console.log('Failed to login-Email not registered')
        return res.status(404).json({ message: 'Failed to login-Email not registered', success: false });
    }
    }
    catch(err) {
        
            res.status(500).json({
                error:err
            })
    }
}