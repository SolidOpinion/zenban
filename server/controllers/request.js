'use strict';
var router = require('express').Router();
var Request = require('../models/request');


router.post('/request', function(req, res, next) {

    var request = new Request();
/*
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
*/
});




module.exports = router;





