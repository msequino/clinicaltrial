var express =	 	require('express')
  , path = 		require('path')
  , favicon =	 	require('serve-favicon')
  , logger = 		require('morgan')
  , fs = 		require('fs')
  , cookieParser =	require('cookie-parser')
  , bodyParser =	require('body-parser')
  , passport =	require('passport')
  , session = 		require('express-session')
  , flash = 		require('connect-flash')
  , log = 		require('./server/config/winston')
  , db = 		require('./server/config/db')
  , passport = 		require('passport');

var app = express();

//app.use(favicon(__dirname + '/app/favicon.unipr.ico'));
app.use(logger('dev'));

//app.engine('html', require('consolidate').handlebars);
//app.set('view engine', 'html');

app.use('/css', express.static(__dirname + '/app/assets/css'));
app.use('/js', express.static(__dirname + '/app/assets/js'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(session({secret:'azjIOH182us1xi11aScakwqsnda1',resave:false,saveUninitialized:false,duration : 30 * 60 * 1000, activeDuration : 30 * 60 * 1000}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, './app/')));

require("./server/routes")(app);

//PAGINA INIZIALE
app.all('/*',function(req,res,next){
  res.header("Access-control-Allow-Origin","*");
	res.header("Access-control-Allow-Headers","X-Requested-With");
  if(req.user) {
      res.cookie('user', JSON.stringify(req.user));
    }
  res.sendFile(__dirname + '/app/index.html');
});

module.exports = app;
