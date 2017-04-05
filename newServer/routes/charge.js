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
var ServiceProvider = require('../models/serviceProvider')
var Offer = require('../models/offer')
var Charge = require('../models/charge')
var ChargeLog = require('../models/chargeLog')

var pingpp = require('pingpp')('sk_live_KyX1uDXTOy9KzH4m9C0aDaL0');
//pingpp.setPrivateKeyPath("./pingpp_pub_key.pem");
pingpp.setPrivateKeyPath("./pingpp_rsa_key.pem");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// /charge
router.post('/', limiterGet.middleware({
    innerLimit: 10,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body.data.object)
    var params = req.body.data.object
    if (params.channel == 'wx') {
        var name = "wechat" + params.extra.open_id;
        Charge.findOne({
            order_no: params.order_no
        }, function(err, data) {
            if (err) {
                console.log("err");
                return next(err)
            } else {
                var thisChargeLog = new ChargeLog(prePayReservation)
                thisChargeLog.save().then(function(result) {
                    res.sendStatus(200);
                })
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
    prePayReservation.reservation.forEach((element, index) => {
        //make sure the creatorName is the sendername
        //if (element.action === "put") {
        Offer.findOne({
            _id: element._id
        }, function(err, data) {
            if (err) {
                console.log("err")
                return next(err)
            } else {
                if (data != null) {
                    if (data.userNumberLimit <= data.username.length)
                        someoneElseBooked = true
                }
            }
        })
        //}
    })

    if (someoneElseBooked === false) {
        pingpp.charges.create({
            order_no: n,
            app: {
                id: "app_jPGSGGC88aP4C4OO"
            },
            channel: "wx",
            amount: amountFee,
            client_ip: "127.0.0.1",
            currency: "cny",
            subject: "Your Subject",
            body: "Your Body"
        }, function(err, charge) {
            // YOUR CODE
            if (err) {
                res.json({
                    "data": "NO"
                })
            } else {
                console.log(charge)

                var thisCharge
                thisCharge = new Charge(prePayReservation)
                thisCharge.save().then(function(result) {
                    console.log("result")
                    console.log(result)

                    console.log("deal with the reservations")
                    result.reservation.forEach((element, index) => {
                        //make sure the creatorName is the sendername
                        //  if (element.action === "put") {
                        Offer.update({
                            _id: element._id
                        }, {
                            $addToSet: {
                                username: element.username
                            }
                        }, function(err, data2) {
                            if (err) {
                                console.log("err")
                                return next(err)
                            } else {
                                var returnData = JSON.parse(JSON.stringify(charge.credential.wx))
                                returnData["data"] = "OK"
                                res.json(returnData)
                            }
                        })

                    })


                }).catch(function(err) {
                    console.error(err);
                    res.send(err)
                })

            }
        })
    } else {
        res.status(500).send('Sorry, someone else booked before you!');
    }
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
