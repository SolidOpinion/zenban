'use strict';
var router = require('express').Router();
var Task = require('../models/task');
var Request = require('../models/request');
var User = require('../models/user');
var config = require('../config.json')[process.env.NODE_ENV || 'dev'];
var log4js = require('log4js');
var Auth = require('../libs/auth');


var logger = log4js.getLogger();
logger.setLevel(config.LOG_LEVEL);


// create
router.post('/tasks', function(req, res, next) {

    var task = new Task(req.body);
    task.status = 'Backlog';
    task.author = req.user._id;
    task.estimation = 0;
    task.isProblem = false;

    logger.info(task);

    task.save(function (err) {
        if (err) {
            logger.error(err);
            res.status(406).json({ message: "Model validation error" });
            next();
        } else {
            res.json(task);
        }
    });
});

// modify
router.put('/tasks/:id', function(req, res, next) {
    Task.findByIdAndUpdate(req.params.id, { $set: req.body}, function (err, task) {
        if (err) {
            res.status(406).json({ message: "Model validation error" });
            return next();
        } else {
            if (task == null) {
                res.sendStatus(404);
                return next();
            }
            Task.where({ _id:req.params.id }).findOne(function (err, taskResult) {
                if (err) {
                    res.sendStatus(500);
                    return next();
                } else {
                    if (taskResult == null) {
                        res.sendStatus(500);
                        return next();
                    } else {
                        logger.info(taskResult);
                        res.json(taskResult);
                    }
                }
            });
        }
    });
});

// delete
router.delete('/tasks/:id', function(req, res, next) {
    Task.findByIdAndUpdate(req.params.id, { $set: { isRemoved: true }}, function (err, task) {
        if (err) {
            res.status(406).json({ message: "Can't remove" });
            return next();
        } else {
            res.json({_id: task._id});
        }
    });
});

// get
router.get('/tasks/:id', function(req, res, next) {
    Task.findOne({ _id:req.params.id, isRemoved: false })
        .populate('author', 'name _id')
        .populate('developer', 'name _id')
        .populate('request', 'createdAt title author _id')
        .exec(function (err, task) {
            if (err) {
                res.sendStatus(500);
                return next();
            } else {
                if (task == null) {
                    res.sendStatus(404);
                    return next();
                } else {
                    Request.populate(task, {
                        path: 'request.author',
                        select: 'name _id',
                        model: User
                    }, function (err, task) {
                        res.json(task);
                    });
                }
            }
        });
});


// list
router.get('/tasks', function(req, res, next) {

    let search = {};

    search.isRemoved = false;

    if (req.query && req.query.title && req.query.title.length > 0) {
        search.title = {};
        search.title.$regex = req.query.title;
        search.title.$options = 'i';
    }


    if (req.query && req.query.tag && req.query.tag.length > 0) {
        search.tags = {};
        search.tags = req.query.tag;
    }

    if (req.query && req.query.developer && !isNaN(parseFloat(req.query.developer)) && isFinite(req.query.developer)) {
        search.developer = req.query.developer;
    }

    if (req.query && req.query.request && !isNaN(parseFloat(req.query.request)) && isFinite(req.query.request)) {
        search.request = req.query.request;
    }

    if (req.query && req.query.type) {
        search.type = req.query.type;
    }

    if (req.query && req.query.isProblem) {
        search.isProblem = req.query.isProblem;
    }

    if (req.query && req.query.dependend) {
        search.dependsOn = {};
        search.dependsOn.$exists = true;
        search.dependsOn.$ne = null;
    }

    console.log(search);

    Task
        .find(search)
        .populate('author', 'name _id')
        .populate('developer', 'name _id')
        .populate('request', 'createdAt title author _id')
        .exec(function (err, results) {
            if (err) {
                res.sendStatus(500);
                return next();
            }
            let promiseArray = [];
            if (results.length < 1) {
                res.json([]);
                return next();
            }
            results.forEach(function (value, key) {
                promiseArray.push(Request.populate(value, {
                    path: 'request.author',
                    select: 'name _id',
                    model: User
                }).then(function (task) {
                    results[key] = task;
                }));
            });

            Promise.all(promiseArray)
                .then(function() {
                    res.json(results);
                });
        });
});

/*
// post comment
router.post('/requests/:id/comments', function(req, res, next) {
    Request.findByIdAndUpdate(req.params.id, {
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
            Request.where({ _id:req.params.id }).findOne(function (err, requestResult) {
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
router.delete('/requests/:id/comments/:cid', function(req, res, next) {
    Request.findByIdAndUpdate(req.params.id, {
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
            Request.where({ _id:req.params.id }).findOne(function (err, requestResult) {
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
*/
module.exports = router;





