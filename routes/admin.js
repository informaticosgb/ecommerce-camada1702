var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin', { shopTitle: 'Ecommerce Camada 1702', adminTitle: 'Bienvenido admin', isAuth: req.isAuthenticated(), user: req.user });
});

module.exports = router;
