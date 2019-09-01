var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require("swig");
var session = require('express-session');
var rewrite = require('express-urlrewrite');
const request = require('request');

var apiCall = require('./routes/apiCall');
var login = require('./routes/login');

var app = express();

app.set('views', path.join(__dirname, 'applications'));
app.set('view engine', 'html');
app.engine("html",swig.renderFile);
swig.setDefaults({ varControls: ['<%=', '%>'] });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
															 
app.use(session({
  secret: 'certificationshrey',
  resave: false,
  saveUninitialized: true
}));

app.use('/', login);
app.use('/login', login);
app.use('/apiCall', apiCall);

app.use(express.static('applications/production/authentication/'));
app.use('/assets', express.static(path.join(__dirname, 'applications/production/authentication/')));



app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  console.log(err);
  res.render("production/error");
});
module.exports = app;