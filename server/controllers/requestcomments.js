'use strict';
var router = require('express').Router();
var Request = require('../models/request');
var config = require('../config.json')[process.env.NODE_ENV || 'dev'];
var log4js = require('log4js');
var Auth = require('../libs/auth');

var logger = log4js.getLogger();
logger.setLevel(config.LOG_LEVEL);

// post comment
router.post('/requestcomments/:rid', function(req, res, next) {
    Request.findByIdAndUpdate(req.params.rid, {
        $push: {
            comments: {
                body: req.body.body,
                author: req.user._id
            }
        }
    }, function (err, request) {
        if (err) {
            res.status(406).json({ message: "Model validation error" });
            return next();
        } else {
            if (request == null) {
                res.sendStatus(404);
                return next();
            }
            Request.where({ _id:req.params.rid }).findOne(function (err, requestResult) {
                if (err) {
                    res.sendStatus(500);
                    return next();
                } else {
                    if (requestResult == null) {
                        res.sendStatus(500);
                        return next();
                    } else {
                        res.json(requestResult);
                    }
                }
            });
        }
    });
});

// delete comment
router.delete('/requestcomments/:rid/:cid', function(req, res, next) {
    Request.findByIdAndUpdate(req.params.rid, {
        $pull: {
            comments: {
                _id: req.params.cid
            }
        }
    }, function (err, request) {
        if (err) {
            res.status(406).json({ message: "Model validation error" });
            return next();
        } else {
            if (request == null) {
                res.sendStatus(404);
                return next();
            }
            Request.where({ _id:req.params.rid }).findOne(function (err, requestResult) {
                if (err) {
                    res.sendStatus(500);
                    return next();
                } else {
                    if (requestResult == null) {
                        res.sendStatus(500);
                        return next();
                    } else {
                        res.json(requestResult);
                    }
                }
            });
        }
    });
});

module.exports = router;





