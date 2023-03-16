const express = require('express')
const path = require('path')
const router = express.Router();


router.get('/add-product',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','add-product.html'))
})

router.post('/add-product',(req,res,next)=>{
    console.log(req.body)
    res.redirect('/shop')
})



module.exports = router