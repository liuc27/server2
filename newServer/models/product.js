var db = require('../db')

var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

var mongoosePaginate = require('mongoose-paginate');

var productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: false
    },
    retail: {
        type: Number,
        required: false
    },
    list: {
        type: Number,
        required: false
    },
    introduction: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    imageURL: {
        type: String,
        required: true
    },
    faceImageURL: {
        type: String,
        required: false
    },
    faceImagePoints: [],
    serviceProviderId: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    serviceProviderImageURL: {
        type: String,
        required: true
    },
    certificateURL: {
        type: String,
        required: false
    },
    videoURL: {
        type: String,
        required: false
    },
    review: [],
    likedBy: [String],
    purchasedBy: [String],
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

productSchema.plugin(mongoosePaginate);

var Product = db.model('Product', productSchema)

module.exports = Product
