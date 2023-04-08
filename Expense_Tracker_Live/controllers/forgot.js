
const Sib = require('sib-api-v3-sdk')
require('dotenv').config()
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']

apiKey.apiKey=process.env.API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()


exports.forgotPwd = async (req,res,next)=>{
    const mail = req.params.mail
    // console.log(`a${mail}a` )

    try{
        const sender = {
            email:'jayjeetchamp@gmail.com'
        }
        
        const receivers = [{
            email:'jayjeet.mandhata98@gmail.com'
        }]
        
    await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject:'SendInBlueWorks',
            textContent:`New email received`,
        })
       return res.status(201).json({success:true})
            
    }
    catch(e) 
    {   
        return res.status(500).json({success:false,error:e})
    }
  }
  