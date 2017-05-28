var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/callPro', function() {
    console.log('mongodb connected')
})
module.exports = mongoose
