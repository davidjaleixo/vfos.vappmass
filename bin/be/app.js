/* made by KBZ david.aleixo@knowledgebiz.pt */

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const recursiveReadSync = require('recursive-readdir-sync')
const contains = require("string-contains")
const expressValidator = require('express-validator');
var passport = require('passport');
var jwt = require('express-jwt');
const config = require('./config.json');
var cors = require('cors');

//express app
var app = express();

//cors configuration
if(config.cors.allow){
  console.log("CORS is allowed!");
  app.use(cors());
}


//middleware configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(expressValidator());

//authentication
require('./passport');
app.use(passport.initialize());



//set the need of tokens for authentication unless the following paths
app.use('/api', jwt({
  secret: config.jwt.secret
}).unless(
  {
    path: ['/api/login', '/api/register']
  })
)
//set API routes
app.use('/api',require('./router'));

//set Angular static files
app.use(express.static(path.join(path.normalize(__dirname), '../../views/app24/dist/app24')));

//Serve Angular app - let the Angular decide every what to do with every route by using '*'
app.get('*', function(req,res){
	res.sendFile('index.html', {root: path.join(path.normalize(__dirname), '../../views/app24/dist/app24')});
})




// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;