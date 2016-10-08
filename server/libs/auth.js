'use strict';
var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('../config.json')[process.env.NODE_ENV || 'dev'];
var User = require('../models/user');

module.exports = {

    getTokenByUserId: function(userId) {
        return jwt.encode({
            sub: userId,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        }, config.SECRET);
    },

    getUserByToken: function(token) {
        return new Promise(function(resolve, reject) {
            var payload = null;
            try {
                payload = jwt.decode(token, config.SECRET);
            } catch (err) {
                reject();
            }

            if (payload.exp <= moment().unix()) {
                reject();
            }

            var userId = payload.sub;
            if (userId == null) {
                reject();
            }
            resolve(userId);
        });
    }
};





