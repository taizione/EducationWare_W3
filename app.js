/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var settings = require('./settings');
var MongoStore = require('connect-mongo')(express);
var http = require('http');
var flash = require('connect-flash');
var partials = require('express-partials');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: settings.cookieSecret,
    store: new MongoStore({
      db: settings.db
    })
  }));

  app.use(flash());

  //view helper
  app.use(function(req, res, next){
    res.locals.user = req.session.user;
    res.locals.partials=app.set('partials');
    var err = req.flash('error');
    if(err.length)
    res.locals.error = err;
    else
    res.locals.error = null;
    var succ = req.flash('success');
    if(succ.length)
    res.locals.success = succ;
    else
    res.locals.success = null;

    next();
  });

  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

});



app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});