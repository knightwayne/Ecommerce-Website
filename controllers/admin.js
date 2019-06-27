const fs = require('fs');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.file;
  const price = req.body.price;
  const description = req.body.description;
  console.log('req', req.file);
  if(!imageUrl){
    //req.flash('error', 'Invalid file format.');
    return res.redirect('/admin/add-product');
  }
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: '/' + imageUrl.path,  //absolute path
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      //console.log(err);
      const error=new Error('Error on server side!');
      error.httpStatusCode=500;
      next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => {
      //console.log(err);
      const error=new Error('Error on server side!');
      error.httpStatusCode=500;
      next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.file;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
      //console.log(err);
      const error=new Error('Error on server side!');
      error.httpStatusCode=500;
      next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      //console.log(err);
      const error=new Error('Error on server side!');
      error.httpStatusCode=500;
      next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  
  Product.findById(prodId)
  .then(product=>{
    const fileDelPath=product.imageUrl;
    //console.log(product.imageUrl);
    fs.unlink('./'+fileDelPath, (err)=>{
      if(err)
      next(err);
    });
    console.log('DESTROYED PRODUCT');
    return Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(result=>{
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
  })
  // .catch(err=>next(err));
  // Product.deleteOne({ _id: prodId, userId: req.user._id })
  //   .then(() => {
  //     console.log('DESTROYED PRODUCT');
  //     res.redirect('/admin/products');
  //   })
  // .then(result=>{
  //   console.log(result);
  //   res.redirect('/admin/products');
  // })
  .catch(err => {
    //console.log(err);
    const error=new Error('Error on server side!');
    error.httpStatusCode=500;
    next(error);
  });
};

