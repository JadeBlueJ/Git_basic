const path = require('path')
exports.formPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','contact.html'))
}


exports.splash = (req,res,next)=>{
    res.send('<h1>Form Successfully filled</h1>')
}