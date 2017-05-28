var express = require('express'),
    cors = require('cors'),
    app = express();
app.use(cors());

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var user = require('./routes/user');
var charge = require('./routes/charge');
var offer = require('./routes/offer');
var product = require('./routes/product');
var review = require('./routes/review');
var favorite = require('./routes/favorite');

var bodyParser = require('body-parser')
app.use(bodyParser.json({
    limit: '2600kb'
}))

app.use('/images/', express.static(__dirname + '/images/'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', user);
app.use('/charge', charge);
app.use('/offer', offer);
app.use('/product', product);
app.use('/review', review);
app.use('/favorite', favorite);

var User = require('./models/user')
var Offer = require('./models/offer')
var Charge = require('./models/charge')
var Review = require('./models/review')

var get_ip = require('ipware')().get_ip;




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var ip_info = get_ip(req);
    console.log(ip_info);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
