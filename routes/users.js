var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/users');
var ensure = require('../middlewares/ensure');

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
  res.render('dashboard', { shopTitle: 'Ecommerce Camada 1702', isAuth: req.isAuthenticated() });
});

router.post('/signUp', function (req, res, next) {
  var user = new User({
    username: req.body.username, name: req.body.name,
    lastName: req.body.lastName, email: req.body.email, password: req.body.password
  });

  User.createUser(user, function (err, user) {
    if (err) console.error(err);
    console.log(user);
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

module.exports = router;
