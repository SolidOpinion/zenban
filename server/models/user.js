'use strict';
var mongoose        = require('mongoose');
var autoInc         = require('mongoose-auto-increment');
var uniqueValidator = require('mongoose-unique-validator');
var Schema          = mongoose.Schema;

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
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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
    isRemoved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.plugin(autoInc.plugin, 'User');
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
