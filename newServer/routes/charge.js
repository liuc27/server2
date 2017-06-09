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
var url = require('url');
var User = require('../models/user')
var Offer = require('../models/offer')
var Charge = require('../models/charge')
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');

var pingpp = require('pingpp')('sk_live_KyX1uDXTOy9KzH4m9C0aDaL0');
//pingpp.setPrivateKeyPath("./pingpp_pub_key.pem");
pingpp.setPrivateKeyPath("./pingpp_rsa_key.pem");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// /charge , pingpp がwechatPayを実行して完成した次第、/chargeへ送信。
router.post('/', limiterGet.middleware({
    innerLimit: 10,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body.data.object)
    const params = req.body.data.object

    if (!params) {
        return res.status(400)
            .send({
                error: "INVALID data",
                code: 1
            });
    }

    if (params.channel == 'wx') {
        var name = "wechat" + params.extra.open_id;
        Charge.findOne({
            order_no: params.order_no
        }, function(err, data) {
            if (err) {
                console.log("err");
                return next(err)
            } else {
                if (data == null) res.status(500)
                else {
                    console.log("charge succeed and begin update offer");

                    data.paid = true
                    newCharge = new Charge(data)
                    newCharge.save(err => {
                            if (err) {
                                throw err;
                            }

                            console.log("deal with the reservations")
                            var updateOfferFlag = true
                            if (data.chargeType === "service") {
                                async.each(data.reservation, function(element, next) {
                                    Offer.update({
                                        _id: element._id
                                    }, {
                                        $addToSet: {
                                            user: element.user
                                        }
                                        //          ,title: (element.user.length + 1) / element.userNumberLimit
                                    }, function(err, data2) {
                                        if (err) {
                                            console.log("err")
                                            updateOfferFlag = false
                                        } else if (data2.nInserted) {
                                            console.log(data2)
                                            console.log("Offer Inserted!")
                                        }
                                    })
                                })
                            } else if (data.chargeType === "deposit") {
                                Offer.update({
                                    _id: element._id
                                }, {
                                    $addToSet: {
                                        serviceProvider: element.serviceProvider
                                    }
                                    //          ,title: (element.user.length + 1) / element.userNumberLimit
                                }, function(err, data2) {
                                    if (err) {
                                        console.log("err")
                                        updateOfferFlag = false
                                    } else if (data2.nInserted) {
                                        console.log(data2)
                                        console.log("Offer Inserted!")
                                    }
                                })
                            }
                            next()
                        },
                        function(err) {
                            if (err) throw (err)
                            if (updateOfferFlag == true) {
                                console.log("finished")
                                return res.status(200)
                            } else {
                                console.log("updateOffer err")
                                return res.status(200)
                            }
                        })
                }
            }
        })
    }
})

// /api/wechatPay
router.post('/wechatPay', limiterGet.middleware({
    innerLimit: 10,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    const order_no = (new Date()).getTime()
    const reservation = req.body.reservation
    const contact = req.body.contact
    const note = req.body.note
    const chargeType = req.body.chargeType
    let totalPrice = req.body.totalPrice
    totalPrice = 1

    if (!totalPrice || !reservation || !contact || !chargeType) {
        return res.status(400)
            .send({
                error: "INVALID data",
                code: 1
            });
    }

    var prePayReservation = {}
    prePayReservation.order_no = order_no
    prePayReservation.totalPrice = req.body.totalPrice
    prePayReservation.reservation = req.body.reservation
    prePayReservation.contact = req.body.contact
    prePayReservation.chargeType = req.body.chargeType

    if (req.body.note) prePayReservation.note = req.body.note

    console.log(prePayReservation)
    var someoneElseBooked = false;

    async.each(reservation, function(element, next) {
        console.log("0")
        Offer.findOne({
            _id: element._id
        }, function(err, data) {
            if (err) {
                console.log("err")
                return next(err)
            } else if (data == null) {
                console.log("null")
                someoneElseBooked = true
            } else {
                console.log(data)
                console.log(data)
                if (chargeType == 'service') {
                    if (!data.user) data.user = []
                    if (data.user.length <= data.userNumberLimit)
                        someoneElseBooked = true
                } else if (chargeType == 'deposit') {
                    if (!data.serviceProvider) data.serviceProvider = []
                    if (data.serviceProvider.length <= data.serviceProviderNumberLimit)
                        someoneElseBooked = true
                }
            }
        })
        next()
    }, function(err) {
        console.log("step 2")

        //処理2
        if (err) throw err;
        else if (someoneElseBooked === false) {

            pingpp.charges.create({
                order_no: order_no,
                app: {
                    id: "app_jPGSGGC88aP4C4OO"
                },
                channel: "wx",
                amount: totalPrice,
                client_ip: "127.0.0.1",
                currency: "cny",
                subject: chargeType,
                body: chargeType
            }, function(err, charge) {
                console.log("step3")
                // YOUR CODE
                if (err) {
                    res.status(500).send("charge submition fail")
                } else {
                    console.log("charge submition succuss")

                    var thisCharge
                    thisCharge = new Charge(prePayReservation)
                    console.log("charge2")
                    thisCharge.save((err, result) => {
                        if (err) {
                            console.log(err)
                            throw err;
                        } else {
                            console.log("result")
                            console.log(result)
                            var returnData = charge.credential.wx
                            console.log("finished")
                            return res.status(200).json(returnData)
                        }
                    })
                }

            })
        } else {
            res.status(500).send('Sorry, someone else booked before you!');
        }
    })
})

router.post('/refund', limiterGet.middleware({
    innerLimit: 10,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    var amountFee = req.body.totalPrice
    amountFee = 1

    var d = new Date();
    var n = d.getTime();

    var prePayReservation = {}
    prePayReservation.order_no = n
    prePayReservation.totalPrice = req.body.totalPrice
    prePayReservation.reservation = req.body.reservation
    prePayReservation.contact = req.body.contact
    if (req.body.note) prePayReservation.note = req.body.note
    console.log(prePayReservation)
    var someoneElseBooked = false;
    var queryId = prePayReservation.reservation[0]._id


    Charge.find({
            "reservation._id": queryId
        },
        // {_id: 0, reservation: {$elemMatch: {_id: queryId}}},
        function(err, data) {
            if (err) {
                console.log("err");
                return next(err)
            } else {
                console.log(data)
            }
        });
})



// /api/showReservationUserInfo
router.post('/showReservationUserInfo', limiterGet.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body)
    Charge.findOne({
        "reservation._id": req.body.eventId
        // reservation: {
        //     $elemMatch: {
        //         _id: req.body.eventId
        //     }
        // }
    }, function(err, data) {
        if (err) {
            console.log("err");
            return next(err)
        } else {
            console.log(data)
            res.json(data)
        }
    })
})




module.exports = router;
