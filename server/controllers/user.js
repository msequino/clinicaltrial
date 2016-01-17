var db = require('../config/db').models,
  log = require('../config/winston'),
  nodemailer = require('nodemailer');

module.exports.getAll = function(req,res,next){

  var getByClinicIfNotAdmin = (req.user.clinic ? {clinic : req.user.clinic} : {});

  db.User.find(getByClinicIfNotAdmin,{password : false},function(err,users){
    if(err)
      res.json({code : 400,message : "Something wrong"});

    res.json({code : 200,data : users});
  });
}

module.exports.get = function(req,res,next){
  db.User.findById(req.params.id,{password : false},function(err,user){
    if(err)
      res.json({code : 400,message : "Something wrong"});

      res.json({code : 200,data : user});
  });
}

module.exports.getUserByUsername = function(req,res,next){
  models.User.findOne({where : {username:req.params.username}, attributes:['id','name','surname','username','active','GroupId','ClinicId']}).then(function(user){
    res.json(user);
  });
}

module.exports.create = function(req,res,next){

  require('crypto').randomBytes(48, function(ex, buf) {
    var token = buf.toString('hex').substr(0,8);

    var user = new db.User(req.body);
    user.password = user.hashPassword(token);

    user.save(function(err,data){
      user['password'] = token;
      if(!err){
        sendEmailToUser(data,0);
        res.json({code : 200,data : data});
      }else
        res.json({code : 400,message : "The user has not been inserted"})

    });

  });
}

module.exports.save = function(req,res,next){

  var newUser = new db.User(req.body);
  if(newUser['password'])
    newUser.password = newUser.hashPassword(req.body['password']);

  db.User.update({_id:req.params.id},newUser.toObject(), function(err, numAffected){
    if(!err){
      res.json({code : 200});
    }else
      res.json({code : 400,message : "The user has not been inserted"})

  });
}

module.exports.resetPassword = function(req,res,next){

  require('crypto').randomBytes(48, function(ex, buf) {
    var token = buf.toString('hex').substr(0,8);
    db.User.findById(req.params.id,function(err,user){
      user.password = user.hashPassword(token);
      user.save(function(err,data){
        if(!err){
          data.password = token;
          sendEmailToUser(data,1);
          res.json({code : 200});
        }else
          res.json({code : 400,message : "The user has not been inserted"})

      });
    });

 });
}

function defineHtml(user,isReset){
  var link = "http://192.168.1.232:3000/?mail="+user.email+"&pass="+user.password;
  if(isReset == 0)
    return '<b>Gentile dott./dott.ssa '+ user.lastName + ' ' + user.firstName +',</b><br/> sei stato/a registrato/a all\'interno dell\'app per trial clinici.<br> ' +
      'Accedendo tramite la <a href="' + link +'">pagina web</a> o l\'applicazione <a>Android</a> è possibile inviare richieste di condivisione degli studi con i centri di interesse. '+
      '<br><br>Cordiali saluti. <br> Il team.';
  else
    return '<b>Gentile dott./dott.ssa '+ user.lastName + ' ' + user.firstName +',</b><br/> la sua mail è stata resettata.<br> ' +
      'La tua nuova password è: <b>' + user.password + '</b>. Si prega di cambiarla appena <a href="' + link +'">possibile</a>. <br><br>Cordiali saluti. <br> Il team.';

}
function sendEmailToUser(user,isReset){
  // create reusable transporter object using SMTP transport
  var transport = nodemailer.createTransport("SMTP", {
    host: 'smtp.aruba.it',
    port : 25,
    auth: {
      user : '5859205@aruba.it',
      pass : '8308n3dxs4',
    }
  });
  // NB! No need to recreate the transporter object. You can use
  // the same transporter object for all e-mails

  var html = defineHtml(user,isReset);

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: 'Trial Clinici <mansequino@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: (isReset ? 'Aggiornamento password' : 'Registrazione') + '  Trial Clinici avvenut' +(isReset ? 'o' : 'a'), // Subject line
      html: html
    };

  // send mail with defined transport object
  transport.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent');

  });
}
