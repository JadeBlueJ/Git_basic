const jwt = require('jsonwebtoken')
const User =require('../models/User')

exports.authenticate = (req,res,next)=>{
    try{
        const token = req.header("authorization")
        const user = jwt.verify(token,'admin')
        // console.log(user.userId)
        User.findByPk(user.userId).then(user=>{
            req.user=user
            next();
        })
    }
    catch(err){
        console.log(err)
        return res.status(401).json({success:false})
    }
}