'use strict';
var router = require('express').Router();
var User = require('../models/user');
var Auth = require('../libs/auth');


router.post('/users', function(req, res, next) {

    var user = new User();

    var emailParts = req.body.email.split('@');
    if (emailParts.length != 2) {
        res.status(406).json({ message: "Email format is incorrect" });
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


// list
router.get('/users', function(req, res, next) {
    let search;

    if (req.query && req.query.name && req.query.name.length > 0) {
        search = { "name": {"$regex": req.query.name, "$options": "i"}, "isRemoved": false };
    } else {
        search = { "isRemoved": false };
    }

    User
        .find(search)
        .select('name _id')
        .exec(function (err, results) {
            if (err) {
                res.sendStatus(500);
                return next();
            }
            res.json(results);
        });
});



module.exports = router;





