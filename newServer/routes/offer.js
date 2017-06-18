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
var async = require('async');
var fs = require('fs')
var fileURL = 'http://localhost:3000/images/'
var ObjectId = require('mongoose').Types.ObjectId;

var cf = require('aws-cloudfront-sign')

/* GET users listing. */
// router.post('/', limiterPost.middleware({
//     innerLimit: 15,
//     outerLimit: 200,
//     headers: false
// }), (req, res) => {
//     const creator = req.body.creator
//     const password = req.body.password
//     const event = req.body.event
//
//     console.log(creator)
//
//
//     if (!creator || !password || !event) {
//         return res.status(404)
//             .send({
//                 error: "NO creator or password or event",
//                 code: 3
//             });
//     }
//
//     console.log("0")
//
//
//     User.findOne({
//         id: creator.id,
//         password: password
//     }, (err, result) => {
//         if (err) {
//             return next(err)
//         } else if (result == null) {
//             return res.status(500).send("No serviceProvider found")
//         } else {
//             if (event.length < 1) res.status(500).send("No element in req.body.event")
//             else {
//                 console.log("1")
//                 let flag = true
//                 async.each(event, function(element, next) {
//                     console.log(element)
//                     // 処理1
//                     let thisOffer
//                     const _id = element._id
//                     const title = element.title
//                     const serviceType = element.serviceType
//                     const startTime = element.startTime
//                     const endTime = element.endTime
//                     const user = element.user
//                     const serviceProvider = element.serviceProvider
//                     const serviceProviderNumberLimit = element.serviceProviderNumberLimit
//                     const userNumberLimit = element.userNumberLimit
//                     const repeat = element.repeat
//                     //const pricePerHour = element.pricePerHour
//                     const action = element.action
//                     const price = element.price
//
//                     const currency = element.currency || 'yen'
//                     const priceBeforeDiscount = element.priceBeforeDiscount
//                     const currentTime = new Date()
//
//                     console.log("3")
//
//                     if (action === "put") {
//
//                         if (!title || !startTime || !endTime || !action || !price || !serviceProviderNumberLimit || !userNumberLimit) {
//                             flag = false
//                             console.log("parameters")
//                         }
//                         console.log("put")
//                         thisOffer = new Offer({
//                             title: user.length + "/" + userNumberLimit,
//                             serviceType: serviceType,
//                             startTime: startTime,
//                             endTime: endTime,
//                             creator: creator,
//                             serviceProvider: serviceProvider,
//                             user: user,
//                             serviceProviderNumberLimit: serviceProviderNumberLimit,
//                             userNumberLimit: userNumberLimit,
//                             repeat: repeat,
//                             action: action,
//                             price: price,
//                             currency: currency,
//                             priceBeforeDiscount: priceBeforeDiscount,
//                             created: currentTime,
//                             updated: currentTime
//                         })
//                         //thisOffer.creator = creator
//                         thisOffer.save().then(function(result2) {
//                             console.log(result2)
//                         }).catch(function(err) {
//                             flag = false
//                             throw err
//                         })
//                     } else if (action === "delete") {
//
//                         if (!_id) {
//                             flag = false
//                             console.log("parameters")
//                         } else {
//
//                             console.log("delete")
//                             console.log(element)
//                             Offer.find({
//                                 _id: element._id
//                             }).then(function(data) {
//                                 console.log(data)
//                                 if (!data.user) {
//                                     Offer.remove({
//                                         _id: element._id
//                                     }).then(function(result3) {
//                                         console.log(result3)
//                                     }).catch(function(err) {
//                                         flag = false
//                                         throw err
//                                     })
//                                 }
//                             }).catch(function(err) {
//                                 flag = false
//                                 throw err
//                             })
//                         }
//                     }
//                     next()
//                 }, function(err) {
//                     //処理2
//                     if (err) throw err;
//                     else if (flag === false) res.status(500).send("something wrong")
//                     else res.status(200).json({})
//                 });
//
//             }
//         }
//     })
// })

router.post('/getMyCalendarAsServiceProvider', limiterPost.middleware({
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
                    'reservationDetails.serviceProvider': {
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

router.get("/getMyCalendarAsUser", limiterPost.middleware({
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
                'reservationDetails.user': {
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


router.get("/serviceProviderOffer", limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const serviceProviderId = req.query.serviceProviderId
    const serviceType = req.query.serviceType
    if (req.query.serviceType)
        var serviceTypeArr = req.query.serviceType.split(',');

    console.log(serviceTypeArr)
    if (!serviceProviderId) {
        return res.status(404)
            .send({
                error: "NO ID",
                code: 3
            });
    }

    let query = {
        'reservationDetails.serviceProvider': {
            $elemMatch: {
                id: serviceProviderId
            }
        }
    }

    if (serviceType) query.serviceType = {
        $in: serviceTypeArr
    }

    User.findOne({
        id: serviceProviderId
    }).exec((err, result) => {
        if (err) {
            res.status(500).send("err")
        } else if (result === null) {
            res.status(500).send("No user found")
        } else {
            Offer.find(query, (err, result2) => {
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


router.get("/userOffer", limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const userId = req.query.userId
    const serviceType = req.query.serviceType
    if (req.query.serviceType)
        var serviceTypeArr = req.query.serviceType.split(',');

    console.log(serviceTypeArr)
    if (!userId) {
        return res.status(404)
            .send({
                error: "NO ID",
                code: 3
            });
    }

    let query = {
        'reservationDetails.user': {
            $elemMatch: {
                id: userId
            }
        }
    }

    if (serviceType) query.serviceType = {
        $in: serviceTypeArr
    }

    User.findOne({
        id: userId
    }, ((err, result) => {
        if (err) {
            res.status(500).send("err")
        } else if (result === null) {
            res.status(500).send("No user found")
        } else {
            Offer.find(query, (err, result2) => {
                console.log(result2)
                if (err) {
                    return res.status(500).send("err")
                } else {
                    return res.status(200).json(result2)
                }
            })
        }
    }))
})


// router.get("/productId", limiterPost.middleware({
//     innerLimit: 15,
//     outerLimit: 200,
//     headers: false
// }), (req, res) => {
//     const productId = req.query.productId
//     if (!productId) {
//         return res.status(404)
//             .send({
//                 error: "NO ID",
//                 code: 3
//             });
//     }
//     Offer.find({
//         productId: productId
//     }, (err, result2) => {
//         console.log(result2)
//         if (err) {
//             return res.status(500).send("err")
//         } else {
//             return res.status(200).json(result2)
//         }
//     })
//
// })

router.get('/getMenu', function(req, res, next) {
    var data = [{
        id: 0,
        name: 'Guide',
        zh: '向导',
        ja: 'ガイド',
        icon: 'ios-cafe',
        color: '#5383FF',
        category: 'guide',
        sub: []
    }, {
        id: 1,
        name: 'Teach',
        zh: '教学',
        ja: '教育',
        icon: 'ios-wine',
        color: 'red',
        category: 'teach',
        sub: []
    }, {
        id: 2,
        name: 'Agent',
        zh: '中介',
        ja: 'エイジェント',
        icon: 'ios-trash',
        color: 'gold',
        category: 'agent',
        sub: [{
                id: 21,
                name: 'Job',
                category: 'job',
                color: 'lightgreen'
            },
            {
                id: 22,
                name: 'School',
                category: 'school',
                color: '#5383FF'
            },
            {
                id: 23,
                name: 'Marriage',
                category: 'marriage',
                color: 'silver'
            },
            {
                id: 24,
                name: 'Insurance',
                category: 'insurance',
                color: 'pink'
            },
            {
                id: 25,
                name: 'Others',
                category: 'others',
                color: 'yellow'
            }
        ]
    }, {
        id: 3,
        name: 'Employe',
        zh: '职员',
        ja: '会社員',
        icon: 'ios-construct',
        color: 'lightgreen',
        category: 'employe',
        sub: [{
                id: 31,
                name: 'Engineer',
                category: 'engineer',
                color: 'pink'
            },
            {
                id: 32,
                name: 'Salesman',
                category: 'salesman',
                color: 'yellow'
            },
            {
                id: 33,
                name: 'Others',
                category: 'others',
                color: 'yellow'
            }
        ]
    }, {
        id: 4,
        name: 'Housework',
        zh: '家政',
        ja: '家政',
        icon: 'ios-color-wand',
        color: 'pink',
        category: 'housework',
        sub: []
    }, {
        id: 5,
        name: 'Beauty',
        zh: '美丽健康',
        ja: '美・健康',
        icon: 'ios-chatboxes',
        color: 'silver',
        category: 'beauty',
        sub: [{
                id: 51,
                name: 'Skin care',
                category: 'skinCare',
                color: 'lightgreen'
            },
            {
                id: 52,
                name: 'Makeup',
                category: 'makeup',
                color: '#5383FF'
            },
            {
                id: 53,
                name: 'Diet',
                category: 'diet',
                color: 'silver'
            },
            {
                id: 54,
                name: 'Surgery',
                category: 'surgery',
                color: 'pink'
            },
            {
                id: 55,
                name: 'Others',
                category: 'others',
                color: 'yellow'
            }
        ]
    }, {
        id: 6,
        name: 'Biz Advise',
        zh: '商业介绍',
        ja: 'ビジネス',
        icon: 'md-add',
        color: 'lightgreen',
        category: 'bizAdvise',
        sub: []
    }, {
        id: 7,
        name: 'Law',
        zh: '法律咨询',
        ja: '法律',
        icon: 'ios-eye',
        color: 'orange',
        category: 'law',
        sub: []
    }, {
        id: 8,
        name: 'Art',
        zh: '艺术',
        ja: '芸術',
        icon: 'ios-school',
        color: '#5383FF',
        category: 'art',
        sub: []
    }, {
        id: 9,
        name: 'Others',
        zh: '其他',
        ja: 'その他',
        icon: 'ios-musical-notes',
        color: 'lightgreen',
        category: 'others',
        sub: []
    }]
    res.json(data)
})

router.get('/service', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const serviceType = req.query.serviceType
    const category = req.query.category
    const subCategory = req.query.subCategory
    const creatorId = req.query.creatorId
    let query = {}
    let skipClause = 0
    let limitClause = 20
    let sortClause = {
        'created': -1
    }

    if (req.query.skip) skipClause = parseInt(req.query.skip)
    if (req.query.limit) limitClause = parseInt(req.query.limit)

    if (serviceType) query.serviceType = serviceType
    if (creatorId) {
        query = {
            'serviceType': serviceType,
            'creator.id': creatorId
        }
    } else if (category && subCategory) {
        query = {
            'serviceType': serviceType,
            'service.category.main': category,
            'service.category.sub': subCategory
        }
    } else if (category) {
        query = {
            'serviceType': serviceType,
            'service.category.main': category
        }
    }

    console.log(query)


    Offer.paginate(query, {
        sort: sortClause,
        select: 'service creator reservationDetails price reward priceBeforeDiscount reviewNumber currency',
        offset: skipClause,
        limit: limitClause
    }, function(err, data) {
        if (err) return (err);
        res.json(data.docs)
    });
})

// api/serviceDetails
router.get('/serviceDetails', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    if (!ObjectId.isValid(req.query._id)) {
        return res.status(400)
            .send({
                error: "INVALID ID",
                code: 1
            });
    }
    const _id = req.query._id

    Offer.findOne({
        _id: _id
    }, (err, result) => {
        if (err) {
            throw err;
        } else if (result == null) {
            res.status(500).send("service not found")
        } else {
            var options = {
                keypairId: 'APKAJRBOBPGRJI3TZONQ',
                privateKeyPath: './pk-APKAJRBOBPGRJI3TZONQ.pem',
                expireTime: Date.now() + 6000000
            }
            var signedURL = cf.getSignedUrl('http://d247r75rbkpi3y.cloudfront.net/trump.mp4', options);
            if (signedURL) result.service.videoURL = signedURL
            console.log(signedURL)
            console.log(result.service.videoURL)
            res.status(200)
                .json(result);
        }
    })
})


router.post('/service', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    console.log(req.body)
    if (!req.body.creator || !req.body.service) {
        return res.status(500)
            .send("No creator or service or reservationDetails ")
    } else if (!req.body.service.serviceName || !req.body.creator.password ||
        !req.body.creator.id || !req.body.creator._id || !req.body.service.category ||
        !req.body.service.imageURL) {
        console.log(req.body)
        return res.status(500)
            .send("No serviceName or creatorId or password or category or imageURL ")
    }

    const _id = req.body._id
    console.log(_id)
    const creator = req.body.creator

    const serviceName = req.body.service.serviceName
    const category = req.body.service.category
    const introduction = req.body.service.introduction
    const link = req.body.service.link
    let imageURL = req.body.service.imageURL;
    let faceImageURL = req.body.service.faceImageURL;
    const faceImagePoints = req.body.service.faceImagePoints
    const videoURL = req.body.service.videoURL

    // const user = req.body.reservationDetails.user
    // const serviceProvider = req.body.reservationDetails.serviceProvider
    // const startTime = req.body.reservationDetails.startTime
    // const endTime = req.body.reservationDetails.endTime
    // const serviceProviderNumberLimit = req.body.reservationDetails.serviceProviderNumberLimit || 1
    // const userNumberLimit = req.body.reservationDetails.userNumberLimit
    const reservationDetails = req.body.reservationDetails || []
    const serviceType = req.body.serviceType
    const title = req.body.title
    const allDay = req.body.allDay
    const repeat = req.body.repeat
    const action = req.body.action
    const currency = req.body.currency || 'yen'
    const price = req.body.price
    const reward = req.body.reward
    const priceBeforeDiscount = req.body.priceBeforeDiscount
    const currentTime = new Date();



    let serviceData = {
        service: {}
    }

    User.findOne({
        id: creator.id,
        password: creator.password
    }, (err, result) => {
        if (err) {
            throw err;
        } else if (result === null) {
            res.status(500).send("creator.id not registered")
        } else {
            // if((userInfo.userType == 'candidatePro' && serviceType == 'service')||(userInfo.userType == 'user' && serviceType == 'job')){
            //   console.log('qualified')
            // }else{
            //   return res.status(500)
            //       .send("Not qualified")
            // }
            console.log("user exists")
            if (_id) serviceData._id = _id
            if (creator) serviceData.creator = creator

            if (serviceName) serviceData.service.serviceName = serviceName
            if (category) serviceData.service.category = category
            if (introduction) serviceData.service.introduction = introduction
            if (link) serviceData.service.link = link
            if (imageURL) serviceData.service.imageURL = imageURL
            if (faceImageURL) serviceData.service.faceImageURL = faceImageURL
            if (faceImagePoints) serviceData.service.faceImagePoints = faceImagePoints
            if (videoURL) serviceData.service.videoURL = videoURL


            // if (user) serviceData.reservationDetails.user = user || []
            // if (serviceProvider) serviceData.reservationDetails.serviceProvider = serviceProvider
            // if (startTime) serviceData.reservationDetails.startTime = startTime
            // if (endTime) serviceData.reservationDetails.endTime = endTime
            // if (serviceProviderNumberLimit) serviceData.reservationDetails.serviceProviderNumberLimit = serviceProviderNumberLimit || 1
            // if (userNumberLimit) serviceData.reservationDetails.userNumberLimit = userNumberLimit || 1

            if (reservationDetails) serviceData.reservationDetails = reservationDetails
            if (serviceType) serviceData.serviceType = serviceType
            if (title) serviceData.title = title
            if (allDay) serviceData.allDay = allDay


            if (repeat) serviceData.repeat = repeat
            if (currency) serviceData.currency = currency
            if (price) serviceData.price = price
            if (reward) serviceData.reward = reward
            if (priceBeforeDiscount) serviceData.priceBeforeDiscount = priceBeforeDiscount

            if (currentTime) serviceData.created = currentTime
            if (currentTime) serviceData.updated = currentTime




            //console.log(serviceData)
            if (!imageURL) {
                delete serviceData.service.imageURL
            } else if (imageURL.indexOf("http://") < 0) {
                var base64Data, binaryData;
                base64Data = imageURL.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                base64Data += base64Data.replace('+', ' ');
                binaryData = new Buffer(base64Data, 'base64').toString('binary');
                fs.writeFile("images/" + creator.id + "." + serviceName + ".serviceImage.png", binaryData, "binary", function(err) {
                    if (err) console.log(err); // writes out file without error, but it's not a valid image
                });
                serviceData.service.imageURL = fileURL + creator.id + "." + serviceName + ".serviceImage.png";
            }

            if (!faceImageURL) {
                delete serviceData.service.faceImageURL
            } else if (faceImageURL.indexOf("http://") < 0) {
                var base64Data, binaryData;
                base64Data = faceImageURL.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                base64Data += base64Data.replace('+', ' ');
                binaryData = new Buffer(base64Data, 'base64').toString('binary');
                fs.writeFile("images/" + creator.id + "." + serviceName + ".faceImageURL.png", binaryData, "binary", function(err) {
                    if (err) console.log(err); // writes out file without error, but it's not a valid image
                });
                serviceData.service.faceImageURL = fileURL + creator.id + "." + serviceName + ".faceImageURL.png";
            }


            if (_id) {
                Offer.findOne({
                    _id: _id
                }, (err, originalData) => {
                    if (err) {
                        console.log(err)
                        throw err;
                    } else {
                        console.log("reservationDetails exist")

                        const originalReservationDetails = JSON.parse(JSON.stringify(originalData.reservationDetails));
                        const serviceReservationDetails = JSON.parse(JSON.stringify(serviceData.reservationDetails));

                        // originalData = serviceData
                        // originalData.reservationDetails = originalReservationDetails
                        console.log(originalData.reservationDetails)
                        console.log(serviceData.reservationDetails)
                        serviceReservationDetails.forEach((serviceDataElement, serviceDataIndex) => {
                            if (serviceDataElement.action === "add") {

                                originalData.reservationDetails.push(serviceDataElement)

                            } else if (serviceDataElement.action === "delete") {
                                originalData.reservationDetails.forEach((element, i) => {
                                    if (element._id == serviceDataElement._id) {
                                        originalData.reservationDetails.splice(i, 1)
                                    }
                                })
                            }
                            console.log(serviceDataIndex)
                            console.log(serviceReservationDetails.length - 1)
                            console.log(serviceReservationDetails)
                            console.log(originalData)



                            if (serviceDataIndex == serviceReservationDetails.length - 1) {
                                console.log("originalData")

                                Offer.findOneAndUpdate({
                                    _id: _id
                                }, {
                                    $set: originalData
                                }, {
                                    new: true
                                }, function(err, data2) {
                                    if (err) {
                                        console.log(err)
                                        return (err)
                                    } else if (data2) {
                                        return res.status(200)
                                            .json(data2);
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                console.log(serviceData)
                const thisOffer = new Offer(serviceData)
                thisOffer.save().then(function(offerResult) {
                    console.log("new offer")
                    return res.status(200)
                        .json(serviceData);
                })

            }
        }
    })
})


module.exports = router;
