'use strict';
var mongoose        = require('mongoose');
var autoInc         = require('mongoose-auto-increment');
var uniqueValidator = require('mongoose-unique-validator');
var Schema          = mongoose.Schema;

var RequestSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 3000
    },
    status: {
        type: String,
        required: true,
        enum: ['New requests', 'Waiting for architect', 'In queue', 'In progress', 'Done', 'Release', 'Ready for QA', 'Ready for deploy', 'Closed']
    },
    position: {
        type: Number,
        required: true,
        min: 0
    },
    isProblem: {
        type: Boolean,
        default: false
    },
    author: {
        type: Number,
        ref: 'User'
    },
    po: {
        type: Number,
        ref: 'User'
    },
    architect: {
        type: Number,
        ref: 'User'
    },
    qa: {
        type: Number,
        ref: 'User'
    },
    ops: {
        type: Number,
        ref: 'User'
    },
    requirements: [{
        type: Number,
        ref: 'Requirement'
    }],
    comments: [{
        body: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 3000
        },
        author: {
            type: Number,
            ref: 'User'
        },
        isRemoved: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    history: [{
        event: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 3000
        },
        author: {
            type: Number,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isRemoved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

RequestSchema.plugin(autoInc.plugin, 'Request');
RequestSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Request', RequestSchema);

