var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var clinic = Schema({
  code : {
    type : String
  },
  name : {
    type : String,
    required : true
  },
  address : {
    type : String
  },
  cap : {
    type : Number
  },
  coords : {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    }
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
