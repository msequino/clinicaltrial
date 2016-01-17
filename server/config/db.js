var mongoose = require('mongoose');
var fs        = require("fs");
var path      = require("path");

mongoose.connect('mongodb://localhost/app')
//clinicaltrialapp 1cf45$gv$er2
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open',function(callback){

  fs
  .readdirSync(__dirname + '/../models/')
  .filter(function(file) {
    return (file.indexOf(".") !== 0);
  })
  .forEach(function(file) {
    db[file.substr(0,file.length-3)] = require("../models/" + file.substr(0,file.length-3))
  });
});

module.exports = db;
