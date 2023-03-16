const express = require('express')
const localStorage = require('node-localstorage')

const router = express.Router();

router.get('/',(req,res,next)=>{
    console.log(res);
    res.send('<form action = "/" method = "POST"><input type = "text" name = "username"><button type = "submit">Enter username</button></form>')
    
})

// router.post('/',(req,res,next)=>{
//     console.log(req.body)
//     localStorage.setItem(req.body);
//     res.redirect('/')
// })


module.exports = router