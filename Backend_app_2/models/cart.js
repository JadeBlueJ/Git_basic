const fs = require('fs')
const path = require('path')

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
  );

module.exports = class Cart{
    static addProduct(id,productPrice)
    {   //Fetch previous cart

        fs.readFile(p,(e,data)=>{
            let cart = {products:[], totalPrice:0} 
            if(!e) {
                cart = JSON.parse(data)
            }
            
        //Analyse cart -> Find existing product
        const existingProductIndex = cart.products.findIndex(prod=> prod.id==id)
        const existingProduct = cart.products[existingProductIndex]
        let updatedProduct
        if(existingProduct){
            updatedProduct = {...existingProduct}
            updatedProduct.qty = updatedProduct.qty+1
            cart.products = [...cart.products]
            cart.products[existingProductIndex] = updatedProduct
        }
        else {
            updatedProduct = {id:id, qty:1}
            cart.products = [...cart.products,updatedProduct] 
        }
        cart.totalPrice = cart.totalPrice + +productPrice
        fs.writeFile(p,JSON.stringify(cart),e=>console.log(e))
        })

    }

}