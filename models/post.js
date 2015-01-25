var db = require('../db')
var Post = db.model('Post', {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    numbers: {
        type: Number,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productIntroduction: {
        type: String,
        required: true
    },
    productDetail: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

module.exports = Post