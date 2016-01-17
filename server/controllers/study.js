var db = require('../config/db').models,
 Category = require("./category"),
 log = require('../config/winston');

module.exports.getProjects = function(req,res){

  var getByClinicIfNotAdmin = (req.user.clinic ? {clinic : req.user.clinic} : {});

  db.Project.find(getByClinicIfNotAdmin).sort({acronym : 'asc'}).exec(function(err,projects){
    if(err)
      res.json({error : 500,message : "Something wrong"});

    res.json({code : 200,data : projects});
  });
}

module.exports.getProject = function(req,res){
  db.Project.findById(req.params.id,function(err,data){
    if(err)
      res.json({code : 400,message : "Something wrong"});
    else
      res.json({code : 200,data : data});
  });
}

module.exports.createProject = function(req,res){
  var project = new db.Project(req.body);
  project['closed'] = project['closed'] ? project['closed'] : false;
  project.save(function(err,data){
    if(!err){
      Category.insertInTreeView({path : data.categories,id : data._id ,acronym : data.acronym},req.user.clinic);
      res.json({code : 200,data : data});
    }else
      res.json({code : 400,message : "The project has not been inserted"})

  });
}

module.exports.saveProject = function(req,res){
  var project = new db.Project(req.body);
  db.Project.update({_id:req.params.id}, project.toObject(), function(err,numAffected){
    if(!err)
      res.json({code : 200});
    else
      res.json({code : 400,message : "The project has not been updated"})
  });
}

module.exports.closeProject = function(req,res){
  db.Project.update({_id : id},{closed : true},{upsert : true},function(err,data){
    if(!err)
      res.json({code : 200,data : data});
    else
      res.json({code : 400,message : "The project has not been closed"})
  });
}

module.exports.countProject = function(req,res){
  db.Project.aggregate([{$group : {_id:"$categories",count:{$sum:1}}}],function(err,data){
      if(!err){
      var results = {};
      var key , value;
      for (var k in data){
        key = data[k]._id.substr(0,data[k]._id.indexOf("/"));
        value = data[k].count;
        results[key] = (key in results ? results[key] : 0) + value;
      }
      res.json({code : 200,data : results});
    }else
      res.json({code : 400,message : "The project can not be count"})
  });
}
