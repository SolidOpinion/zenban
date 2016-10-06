'use strict';
var mongoose        = require('mongoose');
var autoInc         = require('mongoose-auto-increment');
var uniqueValidator = require('mongoose-unique-validator');
var Schema          = mongoose.Schema;

var RequirementSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Requirement'
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

RequirementSchema.plugin(autoInc.plugin, 'Requirement');
RequirementSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Requirement', RequirementSchema);
