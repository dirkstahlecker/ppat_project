// ======================================================================
// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

// ======================================================================
// configuration
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'userinterface')));

//app.use(methodOverride({limit: '50mb'}));

// ======================================================================
// routes
app.use('/', require('./routes/index'));
app.use('/flags', require('./routes/flags'));
app.use('/buildings', require('./routes/buildings'));
app.use('/templates', require('./routes/templates'));
app.use('/image/', require('./routes/image'));
app.use('/test', require('./routes/test'));

// ======================================================================
// error handling

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// ======================================================================
// launch 
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.listen(port, process.env.OPENSHIFT_NODEJS_IP);
console.log('The magic happens on port ' + port);

module.exports = app;
