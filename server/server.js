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
    if (!req.header('Test')) {
        logger.info("Enter auth middleware");
        if ((req.path == '/api/auth' && req.method == 'POST') || (req.path == '/api/users' && req.method == 'POST')) {
            logger.info(req.path + " route is not protected");
            next();
        } else {
            if (req.header('Authorization')) {
                logger.info("we have Authorization header for this request " + req.header('Authorization'));
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
                                    logger.info("auth ok we can continue to route handler");
                                    next();
                                }
                            }
                        });
                    })
                    .catch(error => {
                        logger.info("auth failed => exit ");
                        res.sendStatus(401);
                    })
            } else {
                logger.info("we dont have auth header for protected route");
                res.sendStatus(401);
            }
        }
    } else {
        next();
    }
});


var router = express.Router();

/*
var taskRoutes = require('./controllers/task');
app.use('/api', taskRoutes);

*/

var requestsRoutes = require('./controllers/requests');
app.use('/api', requestsRoutes);

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