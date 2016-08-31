'use strict';
var User = require('../models/user');
var Auth = require('../models/auth');
var router = require('express').Router();

router.post('/auth', function(req, res, next) {
    User.findOne({ email: req.body.email, password: req.body.password })
        .exec(function (err, user) {
            if (err) {
                res.status(401).json({ message: "Login failed" });
                return next();
            } else {
                if (user) {
                    res.status(200).json({ token: Auth.getTokenByUserId(user._id) });
                } else {
                    res.status(401).json({ message: "Login failed" });
                    return next();
                }
            }
        })

});



module.exports = router;



