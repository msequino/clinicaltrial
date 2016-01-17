var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var category = Schema({
  label : String,
  clinic : String,
  children : []
});

var Category = mongoose.model('Category',category);

module.exports = Category;
