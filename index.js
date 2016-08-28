var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');

mongoose.Promise = require('bluebird');
//mongoose.connect('mongodb://zenban:zenban@candidate.14.mongolayer.com:11183,candidate.45.mongolayer.com:10871/app55659082');
mongoose.connect('mongodb://localhost/zenban');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.use(express.static('./'));

var router = express.Router();

var taskRoutes = require('./server/controllers/task');
app.use('/api', taskRoutes);

var commentRoutes = require('./server/controllers/comment');
app.use('/api', commentRoutes);

var requestRoutes = require('./server/controllers/request');
app.use('/api', requestRoutes);

var requirementRoutes = require('./server/controllers/requirement');
app.use('/api', requirementRoutes);

var userRoutes = require('./server/controllers/user');
app.use('/api', userRoutes);

app.listen(app.get('port'), function() {
    console.log('ZenBan API is running on port', app.get('port'));
});
