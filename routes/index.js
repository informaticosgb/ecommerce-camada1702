var express = require('express');
var router = express.Router();
var Product = require('../models/products');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find({ privacyStatus: 'public' }, function (err, products) {
    if (err) throw err;
    res.render('index', { shopTitle: 'Ecommerce Camada 1702', isAuth: req.isAuthenticated(), products: products });
  });

});

module.exports = router;
