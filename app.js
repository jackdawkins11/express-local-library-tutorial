var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog'); 
var authRouter = require('./routes/auth'); 

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://dbUser:password123456789@cluster0.5eajo.mongodb.net/testing_db?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Use the following middleware on each request
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
app.use(session({ 
	secret: 'Your_Secret_Key', 
	resave: true, 
	saveUninitialized: true
}));

//Set up routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log( "404 error handle function");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log( "Final error handle function");
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
