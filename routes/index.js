var express = require('express');
var router = express.Router();
var Product = require('../models/products');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find({ privacyStatus: 'public' }, function (err, products) {
    if (err) throw err;
    return res.render('index', { shopTitle: 'Ecommerce Camada 1702', isAuth: req.isAuthenticated(), products: products,
    userId: req.isAuthenticated() ? req.user.id : "", role: req.isAuthenticated() ? req.user.role : "" });
  });

});

// router.get('/search', function (req, res) {
//
// });

router.post('/search', function (req, res) {

  Product.find({ name: { $regex : ".*" + req.body.query + ".*" } }, function (err, products) {
    if (err) throw err;
    console.log(products);

    res.render('search', { shopTitle: 'Ecommerce Camada 1702', isAuth: req.isAuthenticated(), products: products,
    userId: req.isAuthenticated() ? req.user.id : "", role: req.isAuthenticated() ? req.user.role : "" });
    // res.redirect('/search');
  });

});

module.exports = router;
