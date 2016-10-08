'use strict';
var User = require('../models/user');
var Auth = require('../libs/auth');
var router = require('express').Router();
var config = require('../config.json')[process.env.NODE_ENV || 'dev'];
var log4js = require('log4js');

var logger = log4js.getLogger();
logger.setLevel(config.LOG_LEVEL);

router.post('/auth', function(req, res, next) {
    logger.info("entering /auth handler");
    User.findOne({ email: req.body.email, password: req.body.password })
        .exec(function (err, user) {
            if (err) {
                logger.info("user with email " + req.body.email + " and password " + req.body.password + " is not found");
                res.status(401).json({ message: "Login failed" });
                return next();
            } else {
                if (user) {
                    logger.info("user was found");
                    res.status(200).json({ token: Auth.getTokenByUserId(user._id) });
                } else {
                    logger.info("password is incorrect");
                    res.status(401).json({ message: "Login failed" });
                    return next();
                }
            }
        })

});

router.get('/auth', function(req, res, next) {
    Auth.getUserByToken(req.header('Authorization'))
        .then(userId => {
            User.where({ _id: userId, isRemoved: false }).findOne(function (err, user) {
                if (err) {
                    res.sendStatus(401);
                    next();
                } else {
                    if (user == null) {
                        res.sendStatus(401);
                        next();
                    } else {
                        user.password = undefined;
                        res.json(user);
                        next();
                    }
                }
            });
        })
        .catch(error => {
            logger.error(error);
            res.sendStatus(401);
            next();
        })
});

module.exports = router;



