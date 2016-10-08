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
        required: true,
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
    position: {
        type: Number,
        required: true,
        min: 0
    },
    estimation: {
        type: Number,
        enum: [0, 1, 2, 3, 5, 8, 13]
    },
    isProblem: {
        type: Boolean,
        default: false
    },
    requestId: {
        type: Schema.Types.ObjectId,
        ref: 'Request'
    },
    authorUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    responsiveUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dependsOn: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    tags: [{
        type: String,
        required: true,
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

TaskSchema.plugin(autoInc.plugin, 'Task');
TaskSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Task', TaskSchema);
