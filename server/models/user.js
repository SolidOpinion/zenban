'use strict';
var mongoose     = require('mongoose');
var autoInc      = require('mongoose-auto-increment');
var Schema       = mongoose.Schema;

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 500,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    type: {
        type: String,
        enum: ['internal', 'external']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.plugin(autoInc.plugin, 'User');

module.exports = mongoose.model('User', UserSchema);
