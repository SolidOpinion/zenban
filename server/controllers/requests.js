'use strict';
var router = require('express').Router();
var Request = require('../models/request');
var config = require('../config.json')[process.env.NODE_ENV || 'dev'];
var log4js = require('log4js');
var Auth = require('../libs/auth');


var logger = log4js.getLogger();
logger.setLevel(config.LOG_LEVEL);


// create
router.post('/requests', function(req, res, next) {
    var request = new Request(req.body);
    request.status = 'New requests';
    request.position = 1000; // move request to the end
    request.author = req.user._id;

    //logger.info(request);

    request.save(function (err) {
        if (err) {
            logger.error(err);
            res.status(406).json({ message: "Model validation error" });
            next();
        } else {
            res.json(request);
        }
    });
});

// modify
router.put('/requests/:id', function(req, res, next) {
    Request.findByIdAndUpdate(req.params.id, { $set: req.body}, function (err, request) {
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

// delete
router.delete('/requests/:id', function(req, res, next) {
    Request.findByIdAndUpdate(req.params.id, { $set: { isRemoved: true }}, function (err, request) {
        if (err) {
            res.status(406).json({ message: "Can't remove" });
            return next();
        } else {
            res.json({_id: request._id});
        }
    });
});

// get
router.get('/requests/:id', function(req, res, next) {
    Request.findOne({ _id:req.params.id, isRemoved: false })
        .populate('author', 'name _id')
        .populate('comments.author', 'name _id')
        .exec(function (err, request) {
            if (err) {
                res.sendStatus(500);
                return next();
            } else {
                if (request == null) {
                    res.sendStatus(404);
                    return next();
                } else {
                    res.json(request);
                }
            }
        });
});

// list
router.get('/requests', function(req, res, next) {
    let search = {};

    search.isRemoved = false;

    if (req.query && req.query.title && req.query.title.length > 0) {
        search.title = {};
        search.title.$regex = req.query.title;
        search.title.$options = 'i';
    }

    if (req.query &&
        req.query.author &&
        !isNaN(parseFloat(req.query.author)) &&
        isFinite(req.query.author)
    ) {
        search.author = req.query.author;
    }

    if (req.query && !req.query.showArchive
    ) {
        search.status = {};
        search.status.$ne = 'Closed';
    }


    Request
        .find(search)
        .populate('author', 'name _id')
        .populate('comments.author', 'name _id')
        .exec(function (err, results) {
            if (err) {
                res.sendStatus(500);
                return next();
            }
            res.json(results);
        });
});


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

module.exports = router;





