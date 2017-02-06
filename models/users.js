var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var moment = require('moment');

// User Schema
var UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	lastName: {
		type: String
	},
	username: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	cart: [],
	bought: [],
	removed: [],
	joined_at: {
		type: String,
		// default: moment().format("DD-MM-YYYY HH:mm:ss")
		default: moment().locale("es").format("LLLL") // mostramos en español
	}

}, { versionKey: false }); // { timestamps: true }

var User = module.exports = mongoose.model('User', UserSchema); // exportamos

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
};

module.exports.getUserByUsername = function(username, callback){
	User.findOne({ username: username }, callback);
};

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
};
