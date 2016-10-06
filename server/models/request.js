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
    authorUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    poUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    architectUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    qaUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    opsUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    requirements: [{
        type: Schema.Types.ObjectId,
        ref: 'Requirement'
    }],
    comments: [{
        body: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 3000
        },
        authorUserId: {
            type: Schema.Types.ObjectId,
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
        authorUserId: {
            type: Schema.Types.ObjectId,
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

