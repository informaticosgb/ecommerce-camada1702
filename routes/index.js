var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { shopTitle: 'Ecommerce Camada 1702', isAuth: req.isAuthenticated() });
});

module.exports = router;
