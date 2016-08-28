'use strict';
var router = require('express').Router();
var User = require('../models/user');


router.post('/user', function(req, res) {

    var user = new User();

    var emailParts = req.body.email.split('@');
    if (emailParts.length != 2) {
        res.status(500).send('Error');
    }

    user.email = req.body.email;
    user.name  = req.body.name;
    user.password = req.body.password;

    if (emailParts[1] == 'solidopinion.com') {
        user.type = 'internal';
    } else {
        user.type = 'external';
    }

    user.save(function(err, o) {
        if (err) {
            res.status(500).send('Error');
        } else {
            res.json(user);
        }
    });

});

module.exports = router;





