var express = require('express'),
    cors = require('cors'),
    app = express();
app.use(cors());

var mongoose = require('mongoose')

var router = express.Router();

var paginate = require('mongoose-paginate');
var Limiter = require('express-rate-limiter')
var MemoryStore = require('express-rate-limiter/lib/memoryStore')
var limiterGet = new Limiter({
    db: new MemoryStore()
});
var limiterPost = new Limiter({
    db: new MemoryStore()
});
var url = require('url');
var User = require('../models/user')
var Offer = require('../models/offer')
var Product = require('../models/product')
var Review = require('../models/review')

var fs = require('fs')
var fileURL = 'http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/images/'
var ObjectId = require('mongoose').Types.ObjectId;


// router.get("/:id", limiterGet.middleware({
//     innerLimit: 15,
//     outerLimit: 200,
//     headers: false
// }), (req, res) => {
//     const _id = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(_id)) {
//         return res.status(400)
//             .send({
//                 error: "INVALID ID",
//                 code: 1
//             });
//     }
//
//     Review.findById(_id, (err, result) => {
//         if (err) {
//             throw err;
//         } else if (!result) {
//             return res.status(404)
//                 .send({
//                     error: "NO RESOURCE",
//                     code: 3
//                 });
//         } else return res.status(200)
//             .send(result);
//     });
// });

//discussion_id is product or serviceProvider ID
router.get("/:id", limiterGet.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400)
            .send({
                error: "INVALID ID",
                code: 1
            });
    }
    const discussion_id = req.params.id;
    const page = req.query.page
    console.log(page)
    let sortClause = {
        'created': -1
    }
    let limitClause = 20
    let query = {
        discussion_id: discussion_id
    }
    Review.find(query)
        .sort(sortClause)
        .limit(limitClause)
        .skip(page * limitClause)
        .exec((err, result) => {
            if (err) {
                throw (err)
            } else res.status(200).send(result);
        });
});


router.post("/product", (req, res) => {

    if (!req.body.rate || !req.body.text || !req.body.author) {
        return res.status(404)
            .send({
                error: "Review not valid",
                code: 3
            });
    } else if (!(mongoose.Types.ObjectId.isValid(req.body.discussion_id) && mongoose.Types.ObjectId.isValid(req.body.author._id) && (mongoose.Types.ObjectId.isValid(req.body.parent_id) || req.body.parent_id == null))) {
        return res.status(404)
            .send({
                error: "Review not valid",
                code: 3
            });
    }

    const discussion_id = req.body.discussion_id;
    const parent_id = req.body.parent_id;
    const author = req.body.author;
    const title = req.body.title;
    const text = req.body.text;
    const rate = req.body.rate;

    const currentTime = new Date();
    const created = currentTime;
    const updated = currentTime;

    const review = new Review({
        discussion_id: req.body.discussion_id,
        parent_id: req.body.parent_id,
        author: req.body.author,
        title: req.body.title,
        text: req.body.text,
        rate: req.body.rate,
        created: req.body.created,
        updated: req.body.created
    });

    User.findOne({
        id: req.body.author.id,
        password: req.body.author.password
    }, (err, result) => {
        if (err) {
            throw err;
        } else if (result === null) {
            return res.status(500).send("No user found");
        } else {
            review.save(err => {
                if (err) {
                    throw err;
                }

                Product.update({
                    _id: discussion_id
                }, {
                    $inc: {
                        "reviewNumber": 1
                    }
                }, (err, result2) => {
                    if (err) {
                        throw err;
                    } else if (result2 === null) {
                        return res.status(500).send("No Product found");
                    } else {
                        return res.status(200)
                            .json({});
                    }
                })
            })
        }
    })
})

router.post("/user/", (req, res) => {

    if (!req.body.rate || !req.body.text || !req.body.author) {
        return res.status(404)
            .send({
                error: "Review not valid",
                code: 3
            });
    } else if (!(mongoose.Types.ObjectId.isValid(req.body.discussion_id) && mongoose.Types.ObjectId.isValid(req.body.author._id) && (mongoose.Types.ObjectId.isValid(req.body.parent_id) || req.body.parent_id == null))) {
        return res.status(404)
            .send({
                error: "Review not valid",
                code: 3
            });
    }

    const discussion_id = req.body.discussion_id;
    const parent_id = req.body.parent_id;
    const author = req.body.author;
    const title = req.body.title;
    const text = req.body.text;
    const rate = req.body.rate;

    const currentTime = new Date();
    const created = currentTime;
    const updated = currentTime;

    const review = new Review({
        discussion_id: req.body.discussion_id,
        parent_id: req.body.parent_id,
        author: req.body.author,
        title: req.body.title,
        text: req.body.text,
        rate: req.body.rate,
        created: req.body.created,
        updated: req.body.created
    });

    User.findOne({
        id: req.body.author.id,
        password: req.body.author.password
    }, (err, result) => {
        if (err) {
            throw err;
        } else if (result === null) {
            return res.status(500).send("No user found");
        } else {
            review.save(err => {
                if (err) {
                    throw err;
                }

                User.update({
                    _id: discussion_id
                }, {
                    $inc: {
                        "reviewNumber": 1
                    }
                }, (err, result2) => {
                    if (err) {
                        throw err;
                    } else if (result2 === null) {
                        return res.status(500).send("No User found");
                    } else {
                        return res.status(200)
                            .json({});
                    }
                })
            })
        }
    })
})

router.put("/:id", (req, res) => {

    if (!req.body.rate || !req.body.text || !req.body.title || !req.body.author) {
        return res.status(404)
            .send({
                error: "Review not valid",
                code: 3
            });
    } else if (!(mongoose.Types.ObjectId.isValid(req.body.discussion_id) && mongoose.Types.ObjectId.isValid(req.params.id) && mongoose.Types.ObjectId.isValid(req.body.author._id) && (mongoose.Types.ObjectId.isValid(req.body.parent_id) || req.body.parent_id == null))) {
        return res.status(404)
            .send({
                error: "Review not valid",
                code: 3
            });
    }

    const discussion_id = req.body.discussion_id;
    const parent_id = req.body.parent_id;
    const author = req.body.author;
    const title = req.body.title;
    const text = req.body.text;
    const rate = req.body.rate;

    const currentTime = new Date();
    const created = currentTime;
    const updated = currentTime;
    const reviewId = req.params.id

    const review = new Review({
        discussion_id: req.body.discussion_id,
        parent_id: req.body.parent_id,
        //  author: req.body.author,
        title: req.body.title,
        text: req.body.text,
        rate: req.body.rate,
        //    created: req.body.created,
        updated: currentTime
    });

    User.findOne({
        id: req.body.author.id,
        password: req.body.author.password
    }, (err, result) => {
        if (err) {
            throw err;
        } else if (result === null) {
            return res.status(500).send("No user found");
        } else {
            Review.update({
                _id: reviewId
            }, review, {
                upsert: true
            }, (err, result) => {
                if (err) {
                    throw err;
                }
                return res.status(200)
                    .json(result);
            })
        }
    })
})

// router.post('/', limiterPost.middleware({
//     innerLimit: 15,
//     outerLimit: 200,
//     headers: false
// }), function(req, res, next) {
//     console.log(req.body.id)
//     if (req.body.author._id && req.body.author.password) {
//
//         User.findOne({
//             "_id": req.body.author._id,
//             "password": req.body.author.password
//         }, function(err, data) {
//             if (err) {
//                 console.log("err");
//                 return next(err)
//             } else if (data == null) {
//
//                 console.log("user name not exist, you can use it: " + req.body.id)
//                 res.json({
//                     data: "NO"
//                 })
//             } else {
//
//                 //_id type
//                 if (mongoose.Types.ObjectId.isValid(req.body.discussion_id) && mongoose.Types.ObjectId.isValid(req.body.author._id) && (mongoose.Types.ObjectId.isValid(req.body.parent_id) || req.body.parent_id == null)) {
//                     const review = new Review({
//                         parent_id: req.body.parent_id,
//                         created: req.body.created,
//                         updated: req.body.created,
//                         author: req.body.author,
//                         discussion_id: req.body.discussion_id,
//                         title: req.body.title,
//                         text: req.body.text,
//                         rate: req.body.rate
//                     })
//
//                     review.save(err => {
//                         if (err) {
//                             throw err;
//                         }
//                         res.json({
//                             data: "OK"
//                         })
//                     });
//                 }
//             }
//         })
//     } else {
//         res.json({
//             data: "NO"
//         })
//     }
// })



module.exports = router;
