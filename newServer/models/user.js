var db = require('../db')
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

var mongoosePaginate = require('mongoose-paginate');

var userSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    province: {
        type: String,
        required: false
    },
    launguage: {
        type: String,
        required: false
    },
    introduction: {
        type: String,
        required: false
    },
    contact: {
        type: String,
        required: false
    },
    sex: {
        type: String,
        required: false
    },
    age: {
        type: String,
        required: false
    },
    imageURL: {
        type: String,
        required: false
    },
    likedServiceProvider: [String],
    likedProduct: [String],
    purchasedProduct: [String],
    certificate: {
        type: String,
        required: false
    },
    product: [],
    preProduct: [String],
    likedBy: [String],
    category: [],
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    suspend: {
        type: Date,
        default: Date.now
    },
    review: [],
    pricePerHour: {
        type: Number,
        required: false
    }
})
userSchema.plugin(mongoosePaginate);

var user = db.model('user', userSchema)

module.exports = user
