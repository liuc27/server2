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
var ServiceProvider = require('../models/serviceProvider')
var Offer = require('../models/offer')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    ServiceProvider.findOne({
        serviceProviderName: req.body.serviceProviderName
    }, function(err, data) {
        console.log(data)
        if (err) {
            return next(err)
        } else {
            if (data == null) {
                res.send("找不到serviceProvider")
            } else {
                console.log("pushed 1 serviceProvider")
                if (req.body.password === data.password) {
                    console.log("password right")
                    console.log(req.body)
                    if (req.body.event) {

                        req.body.event.forEach((element, index) => {
                            var thisOffer
                            //make sure the creatorName is the sendername
                            if (element.action === "put") {
                                console.log("put")
                                thisOffer = new Offer(element)
                                thisOffer.creatorName = req.body.serviceProviderName
                                thisOffer.save().then(function(result) {
                                    res.json({
                                        data: "OK"
                                    })
                                }).catch(function(err) {
                                    console.error("something went wrong");
                                })
                            } else if (element.action === "delete") {
                                console.log("delete")
                                console.log(element)
                                Offer.remove({
                                    _id: element._id
                                }).then(function(result) {
                                    res.json({
                                        data: "OK"
                                    })
                                }).catch(function(err) {
                                    consoole.error("something went wrong");
                                })
                            }
                        })
                    }
                }
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
    if (req.body.serviceProviderName) {
        ServiceProvider.findOne({
            serviceProviderName: req.body.serviceProviderName,
            password: req.body.password
        }, function(err, data) {
            if (err) {
                return next(err)
            } else {
                if (data == null) {
                    res.json({
                        data: 'NO'
                    })
                } else {
                    console.log("found serviceProvider and return data")
                    Offer.find({
                        serviceProviderName: {
                            $all: [req.body.serviceProviderName]
                        }
                    }, function(err, data) {
                        console.log(data)
                        data['data'] = 'OK'
                        res.json(data)
                    })
                }
            }
        })
    }
})

module.exports = router;
