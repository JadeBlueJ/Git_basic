const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(require.main.filename),
'data', 
'products.json')



const getProdsFromFile = (cb)=>{

    fs.readFile(p,(e,data)=>{
        if(e)
        cb ([]);
        cb(JSON.parse(data))
    })

}

module.exports = class Product {
    constructor(t){
        this.title = t; 
    }

    save(){
        getProdsFromFile(products=>{
        products.push(this)
        fs.writeFile(p,JSON.stringify(products),e=>{
            console.log(e)
        })  
        })
    }

    static fetchAll(cb)
    {
        getProdsFromFile(cb) 
    }
}