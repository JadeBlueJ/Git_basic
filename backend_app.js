const http = require('http')
const fs = require('fs');


const server = http.createServer((req,res)=>{
    const url = req.url; 
    const method = req.method;
    if (req.url==='/')
    {

        fs.readFile('msg.txt',(e,data)=>{
            
            res.setHeader('Content-Type', 'text/html')
            res.write(data+'<br></br>')
            res.write('<head><title>My first hosted page</title></head>')
            res.write('<body>')
            res.write(' <form action = "/message" method = "POST"><input type = "text" name="msg"><button type = "submit">Send</button></form>')
            res.write('</body>')
            res.write('</html>')
            return res.end();
                // console.log(data.toString())
                // res.write(data.toString())
            })

    }
    // process.exit();
    if(req.url==='/message' && method==='POST')
    {   const body = [];
        req.on('data',(chunk)=>{
            // console.log(chunk);
            body.push(chunk)
        })
            return req.on('end',()=>{
            const parsedBody = Buffer.concat(body).toString();
            const msg = parsedBody.split('=')[1];
            fs.writeFile('msg.txt',msg, ()=>{
                res.statusCode=302;
                res.setHeader('Location','/')
                return res.end();
            })
           
        })
    }
        // res.setHeader('Content-Type', 'text/html')
        // res.write('<head><title>My first hosted page</title></head>')
        // res.write('<body><h1>HIIIII</h1></body>')
        // res.write('</html>')
        // res.end();
    
});

server.listen(4000)



