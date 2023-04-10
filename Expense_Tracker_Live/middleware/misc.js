const User =require('../models/User')

exports.setStorage = (req,res,next)=>{
    try{

        // console.log(user.userId)
        User.findByPk(req.user.id).then(user=>{
            res.render('../resetpassword.html', {
                user: JSON.stringify(req.user)
              });
        })
    }
    catch(err){
        console.log(err)
        return res.status(401).json({success:false})
    }
}