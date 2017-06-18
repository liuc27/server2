var db = require('../db')
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

var mongoosePaginate = require('mongoose-paginate');

var offerSchema = new mongoose.Schema({
    creator: {
        id: String,
        nickname: String,
        imageURL: String
    },
    service: {
        serviceName: String,
        category: {
            main: String,
            sub: String
        },
        introduction: {
            type: String,
            required: false
        },
        link: {
            type: String,
            required: false
        },
        imageURL: String,
        faceImageURL: {
            type: String,
            required: false
        },
        faceImagePoints: [],
        videoURL: {
            type: String,
            required: false
        }
    },

    reservationDetails: [{
        startTime: String,
        endTime: String,
        user: [{
            _id: mongoose.Schema.Types.ObjectId,
            id: String,
            nickname: String
        }],
        serviceProvider: [{
            _id: mongoose.Schema.Types.ObjectId,
            id: String,
            nickname: String,
            imageURL: String
        }],
        userNumberLimit: Number,
        serviceProviderNumberLimit: Number
    }],

    serviceType: {
        type: String,
        required: false
    },
    title: String,
    text: {
        type: String,
        required: false
    },
    allDay: {
        type: Boolean,
        required: false
    },

    repeat: {
        type: Number,
        required: false
    },
    priceBeforeDiscount: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    reward: Number,
    currency: String,
    review: [],
    likedBy: [String],
    reviewNumber: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
})

offerSchema.plugin(mongoosePaginate);

var offer = db.model('offer', offerSchema)

module.exports = offer
