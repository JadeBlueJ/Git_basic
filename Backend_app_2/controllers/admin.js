const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false  
  });
};

exports.postAddProduct = (req, res, next) => {
  const id = null;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(id,title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if(!editMode) 
    return res.redirect('/')
  const productID = req.params.productID
  Product.findbyID(productID,product=>{
    if(!product) 
      res.redirect('/')
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing:editMode,
      product: product
  });
});
}

exports.postEditProduct = (req, res, next) => {
  const prodID = req.body.productID
  const updateTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedProduct = new Product(prodID,updateTitle,updatedImageUrl,updatedPrice,updatedDescription)
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.deleteProduct = (req,res,next)=>{
  const productID = req.params.productID
  Product.deleteID(productID)
  res.redirect('/admin/products')

}
