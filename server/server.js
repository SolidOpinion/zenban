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

var Auth = require('./models/auth');

app.use(function(req, res, next) {
    if (!req.header('Test')) {
        logger.info("Enter auth middleware");
        if (req.path == '/api/auth' || (req.path == '/api/user' && req.method == 'POST')) {
            logger.info(req.path + " route is not protected");
            next();
        } else {
            if (req.header('Authorization')) {
                logger.info("we have Authorization header for this request " + req.header('Authorization'));
                Auth.getUserByToken(req.header('Authorization'))
                    .then(user => {
                        logger.info("auth ok we can continue to route handler");
                        //res.json(user);
                        // auth ok
                        next();
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

var commentRoutes = require('./controllers/comment');
app.use('/api', commentRoutes);

var requestRoutes = require('./controllers/request');
app.use('/api', requestRoutes);

var requirementRoutes = require('./controllers/requirement');
app.use('/api', requirementRoutes);
*/

var userRoutes = require('./controllers/user');
app.use('/api', userRoutes);

var authRoutes = require('./controllers/auth');
app.use('/api', authRoutes);

var testRoutes = require('./controllers/test');
app.use('/api', testRoutes);


app.listen(app.get('port'), function() {
    logger.info('ZenBan API is running on port', app.get('port'));
});

module.exports = app;