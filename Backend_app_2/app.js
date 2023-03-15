const http = require('http')

const exp = require('express');

const app = exp()

app.use((req,res,next)=>{
    console.log('inside first mw');
    next();
})

app.use((req,res,next)=>{
    console.log('inside 2nd mw');
    res.send('<h1>Hello from Express</h1>')

})
// const server = http.createServer(app);

// server.listen(4000)
app.listen(4000)



