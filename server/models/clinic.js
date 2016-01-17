var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var clinic = Schema({
  name : {
    type : String,
    required : true
  },
  address : {
    type : String
  },
  city : {
    type : String
  },
  tel : {
    type : String
  },
});

// specify the transform schema option
if (!clinic.options.toObject) clinic.options.toObject = {};
clinic.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
}

var Clinic = mongoose.model('Clinic',clinic);

module.exports = clinic;
