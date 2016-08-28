'use strict';
var router = require('express').Router();

router.get('/requirement', function(req, res) {
    res.json({'foo':'bar'});
});

module.exports = router;
