var express = require('express');
var router = express.Router();

var ensure = require('../middlewares/ensure');
var User = require('../models/users');

/* GET home page. */
router.get('/', ensure.ensureAuthenticated, function(req, res, next) {
  User.find({ role: { $ne: 'superAdmin' } }, function (err, users) {
    if (err) throw err;
    // if (req.user.role !== "superAdmin") {
    //   res.redirect('/');
    // }
    res.render('admin', { shopTitle: 'Ecommerce Camada 1702', adminTitle: 'Bienvenido admin',
    isAuth: req.isAuthenticated(), user: req.user, users: users });

  });
});

router.post('/update', function (req, res) {

  User.update({ _id: req.body._id }, { $set: { role: req.body.role === "admin" ? "user" : "admin" } }, function (err, user) {
    if (err) throw err;
    res.redirect('/admin');
  });

});

module.exports = router;
