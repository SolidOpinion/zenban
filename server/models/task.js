'use strict';
var mongoose        = require('mongoose');
var autoInc         = require('mongoose-auto-increment');
var uniqueValidator = require('mongoose-unique-validator');
var Schema          = mongoose.Schema;

var TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200
    },
    description: {
        type: String,
        minlength: 0,
        maxlength: 3000
    },
    type: {
        type: String,
        required: true,
        enum: ['task', 'bug', 'tech']
    },
    status: {
        type: String,
        required: true,
        enum: ['Backlog', 'In progress', 'Done']
    },
    estimation: {
        type: Number,
        enum: [0, 1, 2, 3, 5, 8, 13]
    },
    isProblem: {
        type: Boolean,
        default: false
    },
    request: {
        type: Number,
        required: true,
        ref: 'Request'
    },
    author: {
        type: Number,
        required: true,
        ref: 'User'
    },
    developer: {
        type: Number,
        ref: 'User'
    },
    dependsOn: {
        type: Number,
        ref: 'Task'
    },
    tags: [{
        type: String,
        minlength: 3,
        maxlength: 100
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

TaskSchema.plugin(autoInc.plugin, { model: 'Task', field: '_id', startAt: 1 });
TaskSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Task', TaskSchema);
