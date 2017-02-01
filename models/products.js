var mongoose = require('mongoose');
var moment = require('moment');

// Product Schema
var ProductSchema = mongoose.Schema({
	name: {
		type: String
	},
	description: {
		type: String
	},
	category: {
		type: String
	},
	image: {
		type: String
	},
	price: {
		type: Number
	},
  stock: {
		type: Number
	},
  owner: {
    type: mongoose.Schema.ObjectId
  },
	privacyStatus: {
		type: String,
		default: 'public'
	},
	publishedAt: {
		type: String,
		// default: moment().format("DD-MM-YYYY HH:mm:ss")
		default: moment().locale("es").format("LLLL") // mostramos en español
	}
}, { versionKey: false }); // { timestamps: true }

var Product = module.exports = mongoose.model('Product', ProductSchema); // exportamos

module.exports.createProduct = function(newProduct, callback){
  return newProduct.save(callback); // creamos un Product
};

module.exports.getProductByName = function(productName, callback){
	Product.findOne({ name: productName }, callback); // obtenemos un producto por nombre
};

module.exports.getProductById = function(productId, callback){ // obtenemos un producto por id
	Product.findById(productId, callback);
};

module.exports.getProductByOwner = function (ownerId, callback) {
  Product.find({ owner: ownerId }, callback);
};
