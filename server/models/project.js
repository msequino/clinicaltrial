var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var project = Schema({
  title : String,
  acronym : String,
  categories : String,
  description : String,
  inclusions: String,
  exclusions: String,
  line : String,
  drug : String,
  clinic : String,
  closed : Boolean
});

// specify the transform schema option
if (!project.options.toObject) project.options.toObject = {};
project.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
}

var Project = mongoose.model('Project',project);

module.exports = Project;
