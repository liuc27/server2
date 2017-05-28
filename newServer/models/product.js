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
        name: String,
        sub: String
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
    serviceProvider: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        id: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            required: true
        },
        imageURL: {
            type: String,
            required: true
        }
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
    },
    userNumber: {
        type: Number,
        default: 0
    },
    userNumberLimit: {
        type: Number,
        required: true
    },
    reviewNumber: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
});

productSchema.plugin(mongoosePaginate);

var Product = db.model('Product', productSchema)

module.exports = Product
