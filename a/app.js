//app.js
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var logger = require('morgan');
var port = process.env.PORT || 3000;
var app = express();
var mongoose = require('mongoose');
var fs = require('fs');
var mongoStore = require('connect-mongo')(session);
var _ = require('underscore');
var Movie = require('./app/models/movie');
var User = require('./app/models/user');
var dbUrl = 'mongodb://localhost/my';
mongoose.connect(dbUrl);

//models loading
var models_path = __dirname + '/app/models';
var walk = function(path) {
	fs
		.readdirSync(path)
		.forEach(function(file) {
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath);

			if(stat.isFile()){
				if(/(.*)\.(js|coffee)/.test(file)){
					require(newPath)
				}
			}
			else if(stat.isDirectory()){
				walk(newPath)
			}
		})
};
walk(models_path);


var routes = require('./app/routes/index');
var list = require('./app/routes/list');
var detail = require('./app/routes/detail');
var admin = require('./app/routes/admin');
var add = require('./app/routes/add');
var user = require('./app/routes/user');
var comment = require('./app/routes/comment');
var category = require('./app/routes/category');


app.set('views', './app/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '_public')));
app.use(cookieParser());
app.use(multipart());
app.use(session({
    secret: 'my',
    store: new mongoStore({      //session的持久化
    	url: dbUrl,
    	collection: 'sessions' 
    })
}));
if( 'development' === app.get('env')){
	app.set('showStackError' ,true);
	app.use(logger(':method :url :status'));
	mongoose.set('debug', true);
};

app.locals.moment = require('moment');
app.listen(port);

console.log('Movie is running at ' + port);

app.use(function(req, res, next){

	var _user = req.session.user;
	app.locals.user = _user;
	next()
});
app.use('/',routes);
app.use('/movie',detail);
app.use('/user',user);
app.use('/admin', admin.signinRequired, admin.adminRequired, admin);
app.use('/admin/new', admin.signinRequired, admin.adminRequired, add.savePoster, add);
app.use('/admin/list', admin.signinRequired, admin.adminRequired, list);
app.use('/admin/comment', admin.signinRequired, comment);
app.use('/admin/category', admin.signinRequired, admin.adminRequired, category);
