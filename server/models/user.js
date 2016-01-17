var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var user = Schema({
  firstName : {
    type : String
  },
  lastName : {
    type : String
  },
  email : {
    type : String,
    unique : true,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  phone : {
    type : String,
  },
  image : {
    type : String,
  },

  group : {
    type : String,
    enum : ["Admin", "User","Responsabile"]
  },
  clinic : String,
  active : Boolean,
});
user.methods.isValidPassword = function isValidPassword(pass){
  return bcrypt.compareSync(pass, this.password);
};
user.methods.hashPassword = function hashPassword(pass){
  return bcrypt.hashSync(pass);
};
user.methods.read_info = function read_info(){
  return {
    id	: this.id,
    email : this.email,
    group : (this.group.indexOf("Admin") >= 0 ? 1 : (this.group.indexOf("Responsabile") >= 0 ? 2 : this.group.indexOf("User") >= 0 ? 3 : null)),
    clinic : this.clinic
  };
};
user.methods.isAdmin = function(){
  return this.group.indexOf("Admin") >= 0;
}
user.methods.isResponsible = function(){
  return this.group.indexOf("Admin") >= 0 || this.group.indexOf("Responsabile") >= 0;
}
user.methods.isActive = function(){
  return this.active;
}

// specify the transform schema option
if (!user.options.toObject) user.options.toObject = {};
user.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
}

var User = mongoose.model('User',user);

module.exports = User;
