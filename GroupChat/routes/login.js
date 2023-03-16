const express = require('express')

const router = express.Router();

router.get('/',(req,res,next)=>{

    console.log(req.body);
    localStorage.setItem(req.body);
    res.send('<form action = "/" method = "POST"><input type = "text" name = "username"><button type = "submit">Enter username</button></form>')

    res.redirect('/')
})


module.exports = router