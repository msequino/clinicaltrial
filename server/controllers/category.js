var db = require('../config/db').models,
 log = require('../config/winston');

module.exports.getCategories = function(req,res){
  //If req is from mobile I also need of projects var, otherwise just categories
   var payload = {},
    getByClinicIfNotAdmin = (req.user.clinic ? {clinic : req.user.clinic} : {});

  getByClinicIfNotAdmin['closed'] = false;
  db.Project.find(getByClinicIfNotAdmin).distinct('categories',function(err,data){
     payload['categories'] = data;
     getByClinicIfNotAdmin['closed'] = false;
     db.Project.find(getByClinicIfNotAdmin).sort({acronym : 'asc'}).exec(function(err,projects){
       payload['projects'] = projects;
       if(err)
         res.json({code : 400 , message : "Something wrong"});
       else
         res.json({code : 200 , message : "GOT CATEGORIES", data : payload});
     });
   });

 }

 module.exports.getTreeViewCategories = function(req,res){
    var getByClinicIfNotAdmin = (req.user.clinic ? {clinic : req.user.clinic} : {});

    db.Category.find(getByClinicIfNotAdmin,function(err,data){
      if(err)
        res.json({code : 400 , message : "Something wrong"});
      else
        res.json({code : 200 , message : "GOT CATEGORIES", data : data});
    });
  }

module.exports.insertInTreeView = function(object,clinic){
  //console.log(object);
  var splitted = object.path.split('/');
  //splitted.push(object.acronym);
  db.Category.findOne({clinic : clinic, label : splitted[0]},function(err,data){
    if(!data){
      data = new db.Category();
      data.label = splitted[0];
      data.children = [];
      data.clinic = clinic;
    }
    data = recursiveAdd(data,splitted,1);
    //data.save();

  });
}

function recursiveAdd(list,values,index){
  if(index == values.length - 1)
    return list;
  var addInList = true;
  var itemList = 0;

  for(var jj=0;jj<list.children.length;jj++)
  {
    if(list.children[jj].label == values[index]){
      addInList = false;
      itemList = jj;
      jj=list.length;
    }
  }
  if(addInList){
    list.children.push({label : values[index] , children : []});
    index = index + 1;
    recursiveAdd(list.children[list.length-1],values,index);
  }
  else{
    index = index + 1;
    recursiveAdd(list.children[itemList],values,index);
  }
  console.log(list);
  list.save();
  return list;
}
