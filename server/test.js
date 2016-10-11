var mongoose        = require('mongoose');
var autoInc         = require('mongoose-auto-increment');
mongoose.Promise = require('bluebird');
var Schema          = mongoose.Schema;


var connection = mongoose.connect("mongodb://localhost/zenban");
autoInc.initialize(connection);


var Request = require('./models/request');
var User = require('./models/user');


/*
var Test1Schema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200
    }
});

Test1Schema.plugin(autoInc.plugin, 'Test1');
var Test1 = mongoose.model('Test1', Test1Schema);



var Test2Schema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200
    },
    test1: {
        type: Number,
        ref: 'Test1'
    }
});

Test2Schema.plugin(autoInc.plugin, 'Test2');
var Test2 = mongoose.model('Test2', Test2Schema);
*/

/*
var user = new User({
    email: 'nick@solidopinion.com',
    name: 'nick',
    password: '123456'
});

user.save(function (err, user) {
    console.log(user._id);
    var request = new Request({
        title: 'Login problems',
        description: 'My login doesnt work as expected',
        author: user._id,
        position: 1,
        status: 'New requests'
    });
    request.save(function (err) {
        console.log(err);
        console.log('ok');
    });

});
*/

/*
 var test1 = new Test1({
 title: 'test1'
 });

test1.save(function (err, test) {
    var test2 = new Test2({
        title: 'test2',
        test1: test._id
    });
    test2.save(function (err) {
        console.log('ok');
    });

});
*/



Request.findOne({ _id: 16, isRemoved: false})
    .populate('author')
    .exec(function (err, request) {
        console.log(request);
    });
