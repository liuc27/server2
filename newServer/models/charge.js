var db = require('../db')
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

var mongoosePaginate = require('mongoose-paginate');

var chargeSchema = new mongoose.Schema({
    order_no: {
        type: Number,
        required: true
    },
    chargeType: {
        type: String,
        required: true
    },
    reservation: [],
    totalPrice: {
        type: Number,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    paid: {
        type: Boolean,
        required: false
    }

})

chargeSchema.plugin(mongoosePaginate);

var charge = db.model('charge', chargeSchema)

module.exports = charge
