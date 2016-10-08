'use strict';
var router = require('express').Router();
var Request = require('../models/request');


// create
router.post('/request', function(req, res, next) {
    var request = new Request(req.body);
    request.save(function (err) {
        if (err) {
            res.status(406).json({ message: "Model validation error" });
            next();
        } else {
            res.json(request);
        }
    });
});


module.exports = router;





