'use strict';
var router = require('express').Router();
var config = require('../config.json')[process.env.NODE_ENV || 'dev'];
var log4js = require('log4js');

var logger = log4js.getLogger();
logger.setLevel(config.LOG_LEVEL);

var Requirement = require('../models/requirement');

// create
router.post('/requirements', function(req, res, next) {
    var requirement = new Requirement(req.body);
    requirement.save(function (err) {
        if (err) {
            logger.error(err);
            res.status(406).json({ message: "Model validation error" });
            next();
        } else {
            res.json(requirement);
        }
    });
});

// modify
router.put('/requirements/:id', function(req, res, next) {
    Requirement.findByIdAndUpdate(req.params.id, { $set: req.body}, function (err, requirement) {
        if (err) {
            res.status(406).json({ message: "Model validation error" });
            return next();
        } else {
            if (requirement == null) {
                res.sendStatus(404);
                return next();
            }
            Requirement.where({ _id:req.params.id }).findOne(function (err, requirementResult) {
                if (err) {
                    res.sendStatus(500);
                    return next();
                } else {
                    if (requirementResult == null) {
                        res.sendStatus(500);
                        return next();
                    } else {
                        res.json(requirementResult);
                    }
                }
            });
        }
    });
});

// delete
router.delete('/requirements/:id', function(req, res, next) {
    Requirement.findByIdAndUpdate(req.params.id, { $set: { isRemoved: true }}, function (err, requirement) {
        if (err) {
            res.status(406).json({ message: "Can't remove" });
            return next();
        } else {
            res.json({_id: requirement._id});
        }
    });
});

// get
router.get('/requirements/:id', function(req, res, next) {
    Requirement.where({ _id:req.params.id, isRemoved: false }).findOne(function (err, requirement) {
        if (err) {
            res.sendStatus(500);
            return next();
        } else {
            if (requirement == null) {
                res.sendStatus(404);
                return next();
            } else {
                res.json(requirement);
            }

        }
    });
});

// list
router.get('/requirements', function(req, res, next) {
    let search = {};

    if (req.query && req.query.title && req.query.title.length > 0) {
        search = { "title": {"$regex": req.query.title, "$options": "i"}, "isRemoved": false };
    } else {
        search = { "isRemoved": false };
    }

    Requirement
        .find(search)
        .exec(function (err, results) {
            if (err) {
                res.sendStatus(500);
                return next();
            }
            res.json(results);
        });
});

module.exports = router;