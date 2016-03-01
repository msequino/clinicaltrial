var db = require('../config/db').models,
  log = require('../config/winston');

module.exports.getConfig = function(req,res){
  var data = {};

  data['userProfile'] = [{id: 1,  label: 'Admin'}, {id: 2,  label: 'Responsabile' }, {id: 3,  label: 'User' }];
  db.Clinic.findById(req.user.clinic,function(err,name){
    data['appName'] = (name ? name['name'] : null);
    db.Clinic.find({},function(err,name){
      data['clinics'] = name;

      res.json(data);
    });
  });
}
