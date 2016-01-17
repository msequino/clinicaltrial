var db = require('../config/db').models,
  log = require('../config/winston');

module.exports.getConfig = function(req,res){
  var data = {};

  data['userProfile'] = db.User.schema.path("group").enumValues;
  db.Clinic.findById(req.user.clinic,function(err,name){
    data['appName'] = (name ? name['name'] : null);
    db.Clinic.find({},function(err,name){
      data['clinics'] = name;

      res.json(data);
    });
  });
}
