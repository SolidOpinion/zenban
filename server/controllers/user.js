'use strict';
var router = require('express').Router();
var User = require('./server/models/user');

router.get('/user', function(req, res) {


    var user = new User();
    user.name = 'Nick';
    user.email = 'nick@urmach.net';
    user.password = 'test';
    user.type = 'internal';

    user.save(function(err) {
        if (err) console.log(err);
    });


    res.json({'foo':'bar'});
});

module.exports = router;





