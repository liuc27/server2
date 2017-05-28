var express = require('express'),
    cors = require('cors'),
    app = express();
app.use(cors());
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
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');

/* GET users listing. */
router.post('/', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const creatorId = req.body.creatorId
    const password = req.body.password
    const event = req.body.event

    if (!creatorId || !password || !event) {
        return res.status(404)
            .send({
                error: "NO creatorId or password or event",
                code: 3
            });
    }

    console.log("0")


    User.findOne({
        id: creatorId,
        password: password
    }, (err, result) => {
        if (err) {
            return next(err)
        } else if (result == null) {
            return res.status(500).send("No serviceProvider found")
        } else {
            if (event.length < 1) res.status(500).send("No element in req.body.event")
            else {
                console.log("1")
                let flag = true
                async.each(event, function(element, next) {
                    console.log(element)
                    // 処理1
                    let thisOffer
                    const _id = element._id
                    const title = element.title
                    const serviceType = element.serviceType
                    const startTime = element.startTime
                    const endTime = element.endTime
                    const user = element.user
                    const serviceProvider = element.serviceProvider
                    const serviceProviderNumberLimit = element.serviceProviderNumberLimit
                    const userNumberLimit = element.userNumberLimit
                    const repeat = element.repeat
                    //const pricePerHour = element.pricePerHour
                    const action = element.action
                    const price = element.price
                    console.log("3")

                    if (action === "put") {

                        if (!title || !startTime || !endTime || !action || !price || !serviceProviderNumberLimit || !userNumberLimit) {
                            flag = false
                            console.log("parameters")
                        }
                        console.log("put")
                        thisOffer = new Offer({
                            title: user.length + "/" + userNumberLimit,
                            serviceType: serviceType,
                            startTime: startTime,
                            endTime: endTime,
                            creatorId: creatorId,
                            serviceProvider: serviceProvider,
                            user: user,
                            serviceProviderNumberLimit: serviceProviderNumberLimit,
                            userNumberLimit: userNumberLimit,
                            repeat: repeat,
                            action: action,
                            price: price
                        })
                        thisOffer.creatorId = creatorId
                        thisOffer.save().then(function(result2) {
                            console.log(result2)
                        }).catch(function(err) {
                            flag = false
                            throw err
                        })
                    } else if (action === "delete") {

                        if (!_id) {
                            flag = false
                            console.log("parameters")
                        } else {

                            console.log("delete")
                            console.log(element)
                            Offer.find({
                                _id: element._id
                            }).then(function(data) {
                                console.log(data)
                                if (!data.user) {
                                    Offer.remove({
                                        _id: element._id
                                    }).then(function(result3) {
                                        console.log(result3)
                                    }).catch(function(err) {
                                        flag = false
                                        throw err
                                    })
                                }
                            }).catch(function(err) {
                                flag = false
                                throw err
                            })
                        }
                    }
                    next()
                }, function(err) {
                    //処理2
                    if (err) throw err;
                    else if (flag === false) res.status(500).send("something wrong")
                    else res.status(200).json({})
                });

            }
        }
    })
})

router.post('/getMyCalendar', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body)

    /* category filter exists */
    const id = req.body.id
    const password = req.body.password
    if (!id) {
        return res.status(404)
            .send({
                error: "NO ID",
                code: 3
            });
    }
    User.findOne({
        id: id,
        password: password
    }, function(err, result) {
        if (err) {
            return next(err)
        } else {
            if (result == null) {
                res.status(500).send("No user found")
            } else {
                Offer.find({
                    serviceProvider: {
                        $elemMatch: {
                            id: id
                        }
                    }
                }, function(err, result2) {
                    res.status(200).json(result2)
                })
            }
        }
    })

})

router.get("/getMyReservations", limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const id = req.query.id
    if (!id) {
        return res.status(404)
            .send({
                error: "NO ID",
                code: 3
            });
    }
    User.findOne({
        id: id
    }).exec((err, result) => {
        if (err) {
            res.status(500).send("err")
        } else if (result === null) {
            res.status(500).send("No user found")
        } else {
            Offer.find({
                user: {
                    $elemMatch: {
                        id: id
                    }
                }
            }).exec((err, result2) => {
                if (err) {
                    res.status(500).send("err")
                } else res.status(200).json(result2)
            })
        }
    })

})


router.get("/", limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const serviceProviderId = req.query.serviceProviderId
    if (!serviceProviderId) {
        return res.status(404)
            .send({
                error: "NO ID",
                code: 3
            });
    }
    User.findOne({
        id: serviceProviderId
    }).exec((err, result) => {
        if (err) {
            res.status(500).send("err")
        } else if (result === null) {
            res.status(500).send("No user found")
        } else {
            Offer.find({
                serviceProvider: {
                    $elemMatch: {
                        id: serviceProviderId
                    }
                }
            }, (err, result2) => {
                console.log(result2)
                if (err) {
                    return res.status(500).send("err")
                } else {
                    return res.status(200).json(result2)
                }
            })


            // ).exec((err, result2) => {
            //       if (err) {
            //           res.status(500).send("err")
            //       } else res.status(200).json(result2)
            //   })
        }
    })

})

router.get("/productId", limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const productId = req.query.productId
    if (!productId) {
        return res.status(404)
            .send({
                error: "NO ID",
                code: 3
            });
    }
    Offer.find({
        productId: productId
    }, (err, result2) => {
        console.log(result2)
        if (err) {
            return res.status(500).send("err")
        } else {
            return res.status(200).json(result2)
        }
    })

})

module.exports = router;
