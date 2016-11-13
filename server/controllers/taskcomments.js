'use strict';
var router = require('express').Router();
var Task = require('../models/task');
var config = require('../config.json')[process.env.NODE_ENV || 'dev'];
var log4js = require('log4js');
var Auth = require('../libs/auth');

var logger = log4js.getLogger();
logger.setLevel(config.LOG_LEVEL);

// post comment
router.post('/taskcomments/:tid', function(req, res, next) {
    Task.findByIdAndUpdate(req.params.tid, {
        $push: {
            comments: {
                body: req.body.body,
                author: req.user._id
            }
        }
    }, function (err, task) {
        if (err) {
            res.status(406).json({ message: "Model validation error" });
            return next();
        } else {
            if (task == null) {
                res.sendStatus(404);
                return next();
            }
            Task.where({ _id:req.params.tid }).findOne(function (err, taskResult) {
                if (err) {
                    res.sendStatus(500);
                    return next();
                } else {
                    if (taskResult == null) {
                        res.sendStatus(500);
                        return next();
                    } else {
                        res.json(taskResult);
                    }
                }
            });
        }
    });
});

// delete comment
router.delete('/taskcomments/:tid/:cid', function(req, res, next) {
    Task.findByIdAndUpdate(req.params.tid, {
        $pull: {
            comments: {
                _id: req.params.cid
            }
        }
    }, function (err, task) {
        if (err) {
            res.status(406).json({ message: "Model validation error" });
            return next();
        } else {
            if (task == null) {
                res.sendStatus(404);
                return next();
            }
            Task.where({ _id:req.params.tid }).findOne(function (err, taskResult) {
                if (err) {
                    res.sendStatus(500);
                    return next();
                } else {
                    if (taskResult == null) {
                        res.sendStatus(500);
                        return next();
                    } else {
                        res.json(taskResult);
                    }
                }
            });
        }
    });
});

module.exports = router;





