'use strict';
var router = require('express').Router();
var config = require('../config.json')[process.env.NODE_ENV || 'dev'];
var log4js = require('log4js');
var arrayToTree = require('array-to-tree');

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

    if (req.body.parent) {
        let child = null;
        let newParent = null;
        // looks like parent can be changed
        if (req.body.parent < 1 || req.body.parent == params.id) {
            req.body.parent = null;
        } else {
            Requirement.findOne({ _id:req.params.id }).exec()
                .then(function (r) {
                    child = r;
                    return Requirement.findOne({ _id:req.body.parent }).exec();
                })
                .then(function (r) {
                    newParent = r;
                    if (child == null || newParent == null) {
                        throw new Error();
                    }
                    if (newParent.parent == child._id) {
                        throw new Error();
                    }
                })
                .catch(function (e) {
                    res.sendStatus(500);
                    next();
                });
        }
    }
    /*
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
    });*/

});

// delete
router.delete('/requirements/:id', function(req, res, next) {
    Requirement
        .find({ parent: req.params.id, isRemoved: false })
        .then(function(result) {
            if (result && result.length > 0) {
                throw new Error('Cant remove parent with active children');
            }
            return Requirement.findByIdAndUpdate(req.params.id, {$set: {isRemoved: true}}).exec();
        })
        .then(function(requirement) {
            res.json({_id: requirement._id});
        })
        .catch(function (err) {
            res.status(406).json({ message: "Can't remove" });
            return next();
        })
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
    let search;
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
            var tree = [];
            for (var i=0; i<results.length; i++) {
                var requirement = results[i].toObject();
                tree.push(requirement);
            }
            logger.info(tree);
            logger.info(arrayToTree(tree, {
                parentProperty: 'parent',
                customID: '_id'
            }));
            res.json(arrayToTree(tree, {
                parentProperty: 'parent',
                customID: '_id'
            }));
        });
});

module.exports = router;