const http = require('http')
const fs = require('fs')
// const localStorage = require('node-localstorage').LocalStorage


const bodyParser = require('body-parser')
const admin_routes = require('./routes/admin')
const login_routes = require('./routes/login')

const exp = require('express');

const app = exp()

app.use(bodyParser.urlencoded({extended:false}))


//login page
app.use('/login',(req,res,next)=>{
    res.send('<form onsubmit="localStorage.setItem(`username`,document.getElementById(`username`).value)" action = "/home" method = "POST"><input type = "text" id = "username" name = "title"><button type = "submit">Enter username</button></form>')
    
})

//check if chats present before hand or else respond with a "send message" form. 
app.use('/home',(req,res,next)=>{
    fs.readFile('msg.txt',(e,data)=>{
        if(data.length==0)
        {
            res.setHeader('Content-Type', 'text/html')
            res.write(`<body>No chats Yet</body>`)
            res.write(' <form action="/chat" method="POST" onsubmit="document.getElementById(`uname`).value=localStorage.getItem(`username`)"><input type = "text" id = "msg" name = "message"><input type = "hidden" id = "uname" name = "username"><button type = "submit">Enter Your Message</button></form>')
            res.write('</html>')
            return res.end();
        }
        res.send(
            '<form action="/chat" method="POST" onsubmit="document.getElementById(`uname`).value=localStorage.getItem(`username`)"><input type = "text" id = "msg" name = "message"><input type = "hidden" id = "uname" name = "username"><button type = "submit">Enter Your Message</button></form>')

    })
        
})

// Here we read from the file and post the chat string and then wait for the next request from client
app.use('/chat',(req,res,next)=>{
    fs.appendFile('msg.txt',`${req.body.username} :${req.body.message}`,()=>{
        fs.readFile('msg.txt',(e,data)=>{
            res.setHeader('Content-Type', 'text/html')
            res.write(`<body>${data}</body>`)
            res.write(' <form action="/chat" method="POST" onsubmit="document.getElementById(`uname`).value=localStorage.getItem(`username`)"><input type = "text" id = "msg" name = "message"><input type = "hidden" id = "uname" name = "username"><button type = "submit">Enter Your Message</button></form>')
            res.write('</html>')
            return res.end();

        })
    });
    
   
})

app.use((req,res,next)=>{
    res.status('404').send('<h1>Error 404: Page not Found</h1>')
})

// const server = http.createServer(app);
// server.listen(4000)
 
app.listen(4000)



