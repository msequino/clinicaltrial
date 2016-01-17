var passport =	require('passport');

var Auth = require("./controllers/auth"),
  User = require("./controllers/user"),
  Category = require("./controllers/category"),
  Study = require("./controllers/study"),
  Clinic = require("./controllers/clinic"),
  Config = require("./controllers/config");

module.exports = function(app) {
  // Define a middleware function to be used for every secured routes
  //- See more at:
  // https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs
  var isAuthenticated = function(req, res, next){
    if (!req.isAuthenticated())
      return res.json({code : 401});
    next();
  };

  // Deny only USER
  var isTopUser = function(req, res, next){
    if (!req.isAuthenticated())
      return res.json({code : 401});
    if (!req.user.isResponsible() )
      return res.json({code : 401});
    next();
  };

  // Deny only USER
  var isAdmin = function(req, res, next){
    if (!req.isAuthenticated())
      return res.json({code : 401});
    if (!req.user.isAdmin() )
      return res.json({code : 401});
    next();
  };

  require("./controllers/pass")(app,passport);

  //INSERISCI VARI ROUTE

  app.get('/config', isAuthenticated, Config.getConfig);

  app.get('/auth/session', isAuthenticated, Auth.getSession);
  app.post('/auth/login', passport.authenticate('local-login'), Auth.login);
  app.post('/auth/logout', isAuthenticated, Auth.logout);

  app.get('/user',isTopUser,User.getAll);
  app.get('/user/:id',isAuthenticated,User.get);
  app.post('/user/resetPassword/:id',isTopUser,User.resetPassword);
  app.post('/user',isTopUser,User.create);
  app.put('/user/:id',isAuthenticated,User.save);

  app.get('/category',isAuthenticated, Category.getCategories);
  app.get('/category/treeview',isAuthenticated, Category.getTreeViewCategories);

  app.get('/study',isAuthenticated,Study.getProjects);
  app.get('/study/stats',isAuthenticated,Study.countProject);
  app.get('/study/:id',isAuthenticated,Study.getProject);
  app.post('/study',isTopUser,Study.createProject);
  app.put('/study/:id',isTopUser,Study.saveProject);
  app.delete('/study/:id',isTopUser,Study.closeProject);

  app.get('/clinic',isAuthenticated,Clinic.getAll);
  app.get('/clinic/:id',isAdmin,Clinic.get);
  app.post('/clinic',isAdmin,Clinic.create);
  app.put('/clinic/:id',isAdmin,Clinic.save);

}
