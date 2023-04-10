
const Sib = require('sib-api-v3-sdk')
require('dotenv').config()
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
const User = require('../models/User')
const Forgotpwd = require('../models/Forgotpwd')
const path = require('path');
const bcrypt=require('bcrypt')


apiKey.apiKey=process.env.API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()


exports.forgotPwd = async (req,res,next)=>{
    const mail = req.params.mail
    const user = await User.findOne({where:{mail:mail}})
    if(user)
    {
    // console.log(`a${mail}a` )
        try{
            const resetToken = await Forgotpwd.create({userId:user.id,isActive:true})
            
            const sender = {
                email:'jayjeetchamp@gmail.com'
            }
            
            const receivers = [{
                email:mail
            }]
            
        await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject:'Password Reset Link',
                textContent:`http://localhost:3000/password/resetpassword/${resetToken.id}`,
            })
        return res.status(201).json({success:true})
                
        }
        catch(e) 
        {   
            return res.status(500).json({success:false,error:e})
        }
  }
  else {
    return res.status(404).json({success:false,message:"User Not Found"})
  }
}
exports.resetPwd = (req, res) => {
    const id =  req.params.id;
    Forgotpwd.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest.isActive){
            forgotpasswordrequest.update({ isActive: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>` 
                                )
            res.end()

        }
        else return res.status(500).json({message:"Link expired"})
    }).catch(err=>{
        console.log(err)
        res.status(500).json({error:err})
    })
}
exports.updatePwd = async (req,res,next)=>{
  
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpwd.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                resetpasswordrequest.update({isActive:false}).then(()=>res.status(201).json({message: 'Successfuly update the new password'}))
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}
