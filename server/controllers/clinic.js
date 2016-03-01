var db = require('../config/db').models,
 log = require('../config/winston');

module.exports.getAll = function(req,res){

  db.Clinic.find({},function(err,clinics){
    if(err)
      res.json({error : 500,message : "Something wrong"});

    res.json({code : 200,data : clinics});
  });
}

module.exports.getByName = function(req,res){
  db.Clinic.find({$or : [{name : { "$regex": req.query.s, "$options": "i" }}, {city : { "$regex": req.query.s, "$options": "i" }}]},'name city',function(err,clinics){
    if(err)
      res.json({error : 500,message : "Something wrong"});

    res.json({code : 200,data : clinics});
  });
}

module.exports.get = function(req,res){
  db.Clinic.findById(req.params.id,function(err,data){
    if(err)
      res.json({code : 400,message : "Something wrong"});
    else
      res.json({code : 200,data : data});
  });
}

module.exports.create = function(req,res){
  var clinic = new db.Clinic(req.body);
  clinic.save(function(err,data){
    if(!err){
      res.json({code : 200,data : data});
    }else
      res.json({code : 400,message : "The clinic has not been inserted"})

  });
}

module.exports.save = function(req,res){
  var clinic = new db.Clinic(req.body);

  db.Clinic.update({_id:req.params.id}, clinic.toObject(), function(err,numAffected){
    if(!err)
      res.json({code : 200});
    else
      res.json({code : 400,message : "The clinic has not been updated"})
  });
}
