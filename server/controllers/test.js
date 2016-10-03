'use strict';
var router = require('express').Router();
var config = require('../config.json')[process.env.NODE_ENV || 'dev'];
var log4js = require('log4js');

var logger = log4js.getLogger();
logger.setLevel(config.LOG_LEVEL);

var Test = require('../models/test');

// create
router.post('/test', function(req, res, next) {
    logger.info("entering post /test handler");
    var test = new Test(req.body);
    test.save(function (err) {
        if (err) {
            logger.error(err);
            res.status(406).json({ message: "Model validation error" });
            next();
        } else {
            res.json(test);
        }
    });
});

// modify
router.put('/test/:id', function(req, res, next) {
    logger.info("entering put /test/:id handler");
    Test.findByIdAndUpdate(req.params.id, { $set: req.body}, function (err, test) {
        if (err) {
            res.status(406).json({ message: "Model validation error" });
            return next();
        } else {
            if (test == null) {
                res.sendStatus(404);
                return next();
            }
            Test.where({ _id:req.params.id }).findOne(function (err, testResult) {
                if (err) {
                    res.sendStatus(500);
                    return next();
                } else {
                    if (testResult == null) {
                        res.sendStatus(500);
                        return next();
                    } else {
                        res.json(testResult);
                    }
                }
            });
        }
    });
});

// delete
router.delete('/test/:id', function(req, res, next) {
    Test.findByIdAndUpdate(req.params.id, { $set: { isRemoved: true }}, function (err, test) {
        if (err) {
            res.status(406).json({ message: "Can't remove" });
            return next();
        } else {
            res.json({_id: test._id});
        }
    });
});

// get
router.get('/test/:id', function(req, res, next) {
    logger.info("entering get /test/:id handler");
    Test.where({ _id:req.params.id, isRemoved: false }).findOne(function (err, test) {
        if (err) {
            res.sendStatus(500);
            return next();
        } else {
            if (test == null) {
                res.sendStatus(404);
                return next();
            } else {
                res.json(test);
            }

        }
    });
});

// list
router.get('/test-list', function(req, res, next) {
    req.body.isRemoved = false;
    Test.find(req.query, function (err, results) {
        if (err) {
            res.sendStatus(500);
            return next();
        }
        res.json(results);
    });
});

module.exports = router;