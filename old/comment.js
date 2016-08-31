'use strict';
var router = require('express').Router();

router.get('/comment', function(req, res) {
    res.json({'foo':'bar'});
});

module.exports = router;
