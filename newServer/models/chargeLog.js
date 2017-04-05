var db = require('../db')
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

var mongoosePaginate = require('mongoose-paginate');

var chargeLogSchema = new mongoose.Schema({
    order_no: {
        type: Number,
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
        required: true
    }

})

chargeLogSchema.plugin(mongoosePaginate);

var chargeLog = db.model('chargeLog', chargeLogSchema)

module.exports = chargeLog
