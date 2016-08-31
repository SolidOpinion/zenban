'use strict';
var router = require('express').Router();
var User = require('../models/user');
var Auth = require('../models/auth');


router.post('/user', function(req, res, next) {

    var user = new User();

    var emailParts = req.body.email.split('@');
    if (emailParts.length != 2) {
        res.status(406).json({ message: "Email format incorrect" });
        return next();
    }

    user.email = req.body.email;
    user.name  = req.body.name;
    user.password = req.body.password;

    if (emailParts[1] == 'solidopinion.com') {
        user.type = 'internal';
    } else {
        user.type = 'external';
    }

    user.save(function(err) {
        if (err) {
            res.status(406).json({ message: "Email should be unique and valid. Name should be unique with length between 3 and 100 chars. Password should be between 3 and 20 chars." });
            return next();
        } else {
            res.json(user);
        }
    });
});



router.get('/user', function(req, res, next) {
    Auth.getUserByToken(req.header('Authorization'))
        .then(user => {
            res.json(user);
            next();
        })
        .catch(error => {
            res.sendStatus(401);
            next();
        })
});


module.exports = router;





