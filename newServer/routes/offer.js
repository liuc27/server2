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
    console.log()
    const serviceProviderId = req.body.serviceProviderId
    const password = req.body.password
    const event = req.body.event
    if (!serviceProviderId || !password || !req.body.event) {
        return res.status(404)
            .send({
                error: "NO serviceProviderId or password",
                code: 3
            });
    }

    User.findOne({
        id: serviceProviderId,
        password: password
    }, (err, data) => {
        if (err) {
            return next(err)
        } else if (data == null) {
            return res.status(500).send("No serviceProvider found")
        } else {
            if (event.length < 1) res.status(500).send("No element in req.body.event")
            else {
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
                    const creatorName = serviceProviderId
                    const id = element.id
                    const serviceProviderNumberLimit = element.serviceProviderNumberLimit
                    const userNumberLimit = element.userNumberLimit
                    const repeat = element.repeat
                    //const pricePerHour = element.pricePerHour
                    const action = element.action
                    const price = element.price

                    if (action === "put") {

                        if (!title || !startTime || !endTime || !action || !price || !serviceProviderNumberLimit || !userNumberLimit || !id) {
                            flag = false
                            console.log("parameters")
                        }
                        console.log("put")
                        thisOffer = new Offer({
                            title: id.length + "/" + userNumberLimit,
                            serviceType: serviceType,
                            startTime: startTime,
                            endTime: endTime,
                            creatorName: creatorName,
                            serviceProviderId: serviceProviderId,
                            id: id,
                            serviceProviderNumberLimit: serviceProviderNumberLimit,
                            userNumberLimit: userNumberLimit,
                            repeat: repeat,
                            action: action,
                            price: price
                        })
                        thisOffer.creatorName = serviceProviderId
                        thisOffer.save().then(function(result) {
                            console.log(result)
                        }).catch(function(err) {
                            flag = false
                            throw err
                        })
                    } else if (action === "delete") {

                        if (!_id) {
                            flag = false
                            console.log("parameters")
                        }

                        console.log("delete")
                        console.log(element)
                        Offer.remove({
                            _id: element._id
                        }).then(function(result) {
                            console.log(result)
                        }).catch(function(err) {
                            flag = false
                            throw err
                        })
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
    }, function(err, data) {
        if (err) {
            return next(err)
        } else {
            if (data == null) {
                res.status(500).send("No user found")
            } else {
                Offer.find({
                    serviceProviderId: {
                        $all: [id]
                    }
                }, function(err, data) {
                    res.status(200).json(data)
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
                id: {
                    $all: [id]
                }
            }).exec((err, result) => {
                if (err) {
                    res.status(500).send("err")
                } else res.status(200).json(result)
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
                serviceProviderId: {
                    $all: [serviceProviderId]
                }
            }).exec((err, result) => {
                if (err) {
                    res.status(500).send("err")
                } else res.status(200).json(result)
            })
        }
    })

})

module.exports = router;
