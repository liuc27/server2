var db = require('../db')
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

var mongoosePaginate = require('mongoose-paginate');

var Review = new mongoose.Schema({
    parent_id: mongoose.Schema.Types.ObjectId,
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    author: {
        _id: mongoose.Schema.Types.ObjectId,
        id: String,
        nickname: String
    },
    discussion_id: mongoose.Schema.Types.ObjectId,
    title: String,
    text: String,
    rate: Number
});

Review.plugin(mongoosePaginate);

var review = db.model('review', Review)

module.exports = review
