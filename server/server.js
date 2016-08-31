var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var autoInc      = require('mongoose-auto-increment');
var config       = require('./config.json')[process.env.NODE_ENV || 'dev'];

mongoose.Promise = require('bluebird');

var connection = mongoose.connect(config.MONGO_URI);

autoInc.initialize(connection);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.use(express.static('./'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

var Auth = require('./models/auth');

app.use(function(req, res, next) {
    if (req.path == '/api/auth' || (req.path == '/api/user' && req.method == 'POST')) {
        next();
    } else {
        if (req.header('Authorization')) {
            Auth.getUserByToken(req.header('Authorization'))
                .then(user => {
                    res.json(user);
                    next();
                })
                .catch(error => {
                    res.sendStatus(401);
                    next();
                })
        } else {
            res.sendStatus(401);
            next();
        }
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

app.listen(app.get('port'), function() {
    console.log('ZenBan API is running on port', app.get('port'));
});

module.exports = app;