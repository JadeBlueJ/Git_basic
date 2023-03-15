const http = require('http')
const bodyParser = require('body-parser')

const exp = require('express');

const app = exp()

app.use(bodyParser.urlencoded({extended:false}))


app.use('/add-product',(req,res,next)=>{
    res.send('<form action = "/product" method = "POST"><input type = "text" name = "title"><input type = "text" name = "size"><button type = "submit">Add Prod</button></form>')
})

app.post('/product',(req,res,next)=>{
    console.log(req.body)
    res.redirect('/')
})

app.use('/',(req,res,next)=>{
    res.send('<h1>Hello from Express</h1>')
})


// const server = http.createServer(app);

// server.listen(4000)
app.listen(4000)



