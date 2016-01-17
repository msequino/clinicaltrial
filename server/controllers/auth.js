module.exports.getSession = function(req, res) {
	res.send(req.user.read_info());
};

module.exports.login = function(req, res) {
    res.json({code : 200, data : req.user});
//  res.send(req.user);
};

module.exports.signup = function(req, res) {
  res.json({code : 200 , data : req.user});
};

module.exports.logout = function(req, res){
  req.logOut();
  res.json({code : 200});
};
