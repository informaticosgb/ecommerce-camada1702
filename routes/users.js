var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/users');
var Product = require('../models/products');
var ensure = require('../middlewares/ensure');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');

mongoose.connect('mongodb://localhost:27017/ecommerce');

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
     if(err) throw err;
   	 if(!user) return done(null, false, { message: 'Unknown User' });
   	 User.comparePassword(password, user.password, function(err, isMatch){
   	   if(err) throw err;
   	   if(isMatch){
 		    return done(null, user);
   		 } else {
   		  return done(null, false, { message: 'Invalid password' });
   		 }
 	   });
 });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   // console.log(req.isAuthenticated());
//   res.render('index', { isAuth: req.isAuthenticated(), user: req.user });
// });

// dashboard
router.get('/dashboard', ensure.ensureAuthenticated, function (req, res, next) {
  Product.find({ owner: req.user.id }, function (err, products) {
    if (err) throw err;
    res.render('dashboard', { shopTitle: 'Ecommerce Camada 1702', isAuth: req.isAuthenticated(), products: products });
  });
});

router.post('/signUp', function (req, res, next) {
  var user = new User({
    username: req.body.username, name: req.body.name,
    lastName: req.body.lastName, email: req.body.email, password: req.body.password
  });

  User.createUser(user, function (err, user) {
    if (err) console.error(err);
    // console.log(user);
  });

  res.redirect('/');
});

// peticion post a signIn. iniciamos sesion
router.post('/signIn', passport.authenticate( 'local', { successRedirect:'/users/dashboard', failureRedirect:'/' }));

// cerramos sesion
router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

router.post('/newProduct', upload.single('image'), function (req, res) {

  var dir = 'uploads/' + req.user.id.toString() + '/';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  };

  /** When using the "single"
  data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;
  /** The original name of the uploaded file
  stored in the variable "originalname". **/
  var target_path = dir + req.file.originalname;
  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function(err) {
    fs.unlink(tmp_path, function (err) {
      if (err) throw err;
      // console.error("Only .png files are allowed!");
    });
  });

  var product = new Product({
    name: req.body.name, description: req.body.description, category: req.body.category,
    image: req.user.id.toString() + '/' + req.file.originalname.toString(), price: req.body.price,
    stock: req.body.stock, privacyStatus: req.body.privacyStatus, owner: req.user.id, ownerName: req.user.username
  });

  Product.createProduct(product, function (err, product) {
    if (err) console.error(err);
    console.log(product);
  });

  res.redirect('/users/dashboard');
});

router.post('/cart', function (req, res) {

  console.log(req.body._id);
  var addToSet = {
    $addToSet: {
      cart: { _id: req.body._id, qty: parseInt(req.body.qty) }
    }
  };

  User.update({ _id: req.user.id }, addToSet, function (err, ok) {
    if (err) throw err;
    console.log(ok);
  });

  res.redirect('/');
});

module.exports = router;
