var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var autoInc      = require('mongoose-auto-increment');
var config       = require('./config.json')[process.env.NODE_ENV || 'dev'];
var log4js       = require('log4js');

var logger = log4js.getLogger();
logger.setLevel(config.LOG_LEVEL);

mongoose.Promise = require('bluebird');

var connection = mongoose.connect(config.MONGO_URI);

autoInc.initialize(connection);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.use(express.static('./'));

app.use(function(req, res, next) {
    logger.info("New request " + req.method + " " + req.path);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

var Auth = require('./libs/auth');
var User = require('./models/user');

app.use(function(req, res, next) {
/*
    if (req.header('Test')) {
        logger.info("Skip auth for test");
        req.user = {};
        req.user._id = req.header('Test');
        return next();
    }
*/
    if ((req.path == '/api/auth' && req.method == 'POST') || (req.path == '/api/users' && req.method == 'POST')) {
        logger.info(req.path + " route is not protected");
        return next();
    }
    if (!req.header('Authorization')) {
        logger.info("we dont have auth header for protected route");
        res.sendStatus(401);
    }
    logger.info("We have Authorization header for this request " + req.header('Authorization'));
    Auth.getUserByToken(req.header('Authorization'))
        .then(userId => {
            User.where({ _id: userId, isRemoved: false }).findOne(function (err, user) {
                if (err) {
                    res.sendStatus(401);
                    next();
                } else {
                    if (user == null) {
                        res.sendStatus(401);
                        next();
                    } else {
                        req.user = user;
                        logger.info("auth ok we can continue to route handler");
                        next();
                    }
                }
            });
        })
        .catch(function() {
            logger.info("auth failed => exit ");
            res.sendStatus(401);
        })
});


var router = express.Router();


var tasksRoutes = require('./controllers/tasks');
app.use('/api', tasksRoutes);

var taskcommentsRoutes = require('./controllers/taskcomments');
app.use('/api', taskcommentsRoutes);

var requestsRoutes = require('./controllers/requests');
app.use('/api', requestsRoutes);

var requestcommentsRoutes = require('./controllers/requestcomments');
app.use('/api', requestcommentsRoutes);

var requirementsRoutes = require('./controllers/requirements');
app.use('/api', requirementsRoutes);

var usersRoutes = require('./controllers/users');
app.use('/api', usersRoutes);

var authRoutes = require('./controllers/auth');
app.use('/api', authRoutes);

app.listen(app.get('port'), function() {
    logger.info('ZenBan API is running on port', app.get('port'));
});

module.exports = app;