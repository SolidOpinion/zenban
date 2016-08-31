'use strict';
var router = require('express').Router();

router.get('/task', function(req, res) {
    res.json({'foo':'bar'});
});

module.exports = router;
