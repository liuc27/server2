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
var Product = require('../models/product')
var User = require('../models/user')
var Offer = require('../models/offer')

var fs = require('fs')
var fileURL = 'http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/images/'
var ObjectId = require('mongoose').Types.ObjectId;

/* /api/products */

router.get('/', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const category = req.query.category
    const subCategory = req.query.subCategory
    const serviceProviderId = req.query.serviceProviderId
    let query = {}
    let skipClause = 0
    let limitClause = 20
    let sortClause = {
        'created': -1
    }

    if (req.query.skip) skipClause = parseInt(req.query.skip)
    if (req.query.limit) limitClause = parseInt(req.query.limit)

    if (category && category != "all") {
      if(category&&subCategory&& subCategory != "all"){
        query = {
            'category.name': category,
            'category.sub': subCategory
        }
      }else if(category){
        query = {
            'category.name': category
        }
        }
      }

    console.log(query)
    if (serviceProviderId) {
        Product.paginate({
            'serviceProvider.id': serviceProviderId
        }, {
            sort: sortClause,
            select: 'productName imageURL likedBy time serviceProvider retail userNumber userNumberLimit reviewNumber',
            offset: skipClause,
            limit: limitClause
        }, function(err, data) {
            if (err) return (err);
            res.json(data.docs)
        });
    } else
        Product.paginate(query, {
            sort: sortClause,
            select: 'productName imageURL likedBy time serviceProvider retail  userNumber userNumberLimit reviewNumber',
            offset: skipClause,
            limit: limitClause
        }, function(err, data) {
            if (err) return next(err);
            res.json(data.docs)
        });
})

// router.get('/', limiterGet.middleware({
//     innerLimit: 1000,
//     outerLimit: 6000,
//     headers: false
// }), function(req, res, next) {
//     var url_parts = url.parse(req.url, true);
//     var query = url_parts.query;
//
//     /* category filter exists */
//     if (req.query.category != "null" && req.query.category != "undefined" && req.query.category != "all") {
//         console.log("1rd")
//         Product.paginate({
//             category: req.query.category
//         }, {
//             select: 'productName imageURL likedBy serviceProviderId serviceProviderImageURL time nickname',
//             offset: parseInt(req.query.skip),
//             limit: parseInt(req.query.limit)
//         }, function(err, products) {
//             if (err) return next(err);
//             res.json(products.docs)
//         });
//     } else {
//         /* serviceProviderId filter exists */
//         if (req.query.serviceProviderId != "null" && req.query.serviceProviderId != "undefined") {
//             console.log("2rd")
//             Product.paginate({
//                 serviceProviderId: req.query.serviceProviderId
//             }, {
//                 select: 'productName imageURL likedBy serviceProviderId serviceProviderImageURL time nickname',
//                 offset: parseInt(req.query.skip),
//                 limit: parseInt(req.query.limit)
//             }, function(err, products) {
//                 if (err) return next(err);
//
//                 res.json(products.docs)
//             });
//         } else {
//             /* no filter exists */
//             Product.paginate({}, {
//                 select: 'productName imageURL likedBy serviceProviderId serviceProviderImageURL time nickname',
//                 offset: parseInt(req.query.skip),
//                 limit: parseInt(req.query.limit)
//             }, function(err, products) {
//                 if (err) return next(err);
//                 res.json(products.docs)
//             });
//         }
//     }
//
// })

// api/productDetails
router.get('/productDetails', limiterPost.middleware({
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

    Product.findOne({
        _id: _id
    }, (err, result) => {
        if (err) {
            throw err;
        } else if (result == null) {
            res.status(500).send("product not found")
        } else {
            // var options = {
            //     keypairId: 'APKAJRBOBPGRJI3TZONQ',
            //     privateKeyPath: './pk-APKAJRBOBPGRJI3TZONQ.pem',
            //     expireTime: Date.now() + 6000000
            // }
            // var signedURL = cf.getSignedUrl('http://d247r75rbkpi3y.cloudfront.net/trump.mp4', options);
            // if (signedURL) result.videoURL = signedURL
            res.status(200)
                .json(result);
        }
    })
})

router.get('/getMenu', function(req, res, next) {

    //     var data =  [{
    //       id: 0,
    //       name: '东京',
    //       icon: 'ios-wine',
    //       color: 'red',
    //       category: 'food'
    //     }, {
    //       id: 1,
    //       name: '京都',
    //       icon: 'ios-basket',
    //       color: '#5383FF',
    //       category: 'shopping'

    //     }, {
    //       id: 2,
    //       name: '大阪',
    //       icon: 'ios-color-wand',
    //       color: 'pink',
    //       category: 'beauty'
    //     }, {
    //       id: 3,
    //       name: '北海道',
    //       icon: 'ios-moon',
    //       color: '#5383FF',
    //       category: 'hotel'
    //     }, {
    //       id: 4,
    //       name: '冲绳',
    //       icon: 'ios-film',
    //       color: 'silver',
    //       category: 'movie'
    //     }, {
    //       id: 5,
    //       name: '箱根',
    //       icon: 'ios-car',
    //       color: 'gold',
    //       category: 'car'
    //     }, {
    //       id: 6,
    //       name: '福冈',
    //       icon: 'ios-cafe',
    //       color: 'lightgreen',
    //       category: 'job'
    //     }, {
    //       id: 7,
    //       name: '奈良',
    //       icon: 'ios-musical-notes',
    //       color: 'lightgreen',
    //       category: 'job'
    //     }, {
    //       id: 8,
    //       name: '名古屋',
    //       icon: 'md-add',
    //       color: 'lightgreen',
    //       category: 'job'
    //     }, {
    //       id: 9,
    //       name: '横滨',
    //       icon: 'ios-eye',
    //       color: 'orange',
    //       category: 'all'
    //     }]
    //     res.json(data)
    // })

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
        name: 'Job Hunt',
        zh: '职位介绍',
        ja: 'リクルーター',
        icon: 'ios-trash',
        color: 'gold',
        category: 'jobHunt',
        sub: []
    }, {
        id: 3,
        name: 'School Find',
        zh: '学校介绍',
        ja: '学校紹介',
        icon: 'ios-construct',
        color: 'lightgreen',
        category: 'schoolFind',
        sub: []
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
        name: 'Fix',
        zh: '修理',
        ja: '修理',
        icon: 'ios-school',
        color: '#5383FF',
        category: 'fix',
        sub: []
    }, {
        id: 6,
        name: 'Beauty',
        zh: '美丽健康',
        ja: '美・健康',
        icon: 'ios-chatboxes',
        color: 'silver',
        category: 'beauty',
        sub: [{
                id: 61,
                name: 'Skin Care',
                category: 'skinCare',
                color: 'lightgreen'
            },
            {
                id: 62,
                name: 'Makeup',
                category: 'makeup',
                color: '#5383FF'
            },
            {
                id: 63,
                name: 'Diet',
                category: 'diet',
                color: 'silver'
            },
            {
                id: 64,
                name: 'Surgery',
                category: 'surgery',
                color: 'pink'
            },
            {
                id: 65,
                name: 'Others',
                category: 'others',
                color: 'yellow'
            }
        ]
    }, {
        id: 7,
        name: 'Biz Advise',
        zh: '商业介绍',
        ja: 'ビジネス',
        icon: 'md-add',
        color: 'lightgreen',
        category: 'bizAdvise',
        sub: []
    }, {
        id: 8,
        name: 'Law',
        zh: '法律咨询',
        ja: '法律',
        icon: 'ios-eye',
        color: 'orange',
        category: 'law',
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

// api/product

router.post('/', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    if (!req.body.serviceProvider) {
        return res.status(500)
            .send("No productName or serviceProviderId or password or serviceProvider_id or category or imageURL ")
    } else if (!req.body.productName || !req.body.event || !req.body.serviceProvider.password || !req.body.serviceProvider.id || !req.body.serviceProvider._id || !req.body.category || !req.body.startTime || !req.body.endTime || !req.body.serviceProvider.imageURL || !req.body.imageURL) {
        console.log(req.body)
        return res.status(500)
            .send("No productName or event or serviceProviderId or password or serviceProvider_id or category or imageURL ")
    }
    const _id = req.body._id
    const event = req.body.event
    const productName = req.body.productName
    const serviceProvider = req.body.serviceProvider
    const category = req.body.category
    const time = req.body.time
    const videoURL = req.body.videoURL
    const retail = req.body.retail
    const list = req.body.list
    const rate = req.body.rate
    const introduction = req.body.introduction
    const link = req.body.link
    const faceImagePoints = req.body.faceImagePoints
    const currentTime = new Date();
    const startTime = req.body.startTime
    const endTime = req.body.endTime
    const userNumberLimit = req.body.userNumberLimit


    let imageURL = req.body.imageURL;
    let faceImageURL = req.body.faceImageURL;

    const productData = {}

    User.findOne({
        id: serviceProvider.id,
        password: serviceProvider.password
    }, (err, result) => {
        if (err) {
            throw err;
        } else if (result === null) {
            res.status(500).send("serviceProvider.id not registered")
        } else {
            if (productName) productData.productName = productName
            if (serviceProvider) productData.serviceProvider = serviceProvider
            if (category) productData.category = category
            if (time) productData.time = time
            if (videoURL) productData.videoURL = videoURL
            if (retail) productData.retail = retail
            if (list) productData.list = list
            if (introduction) productData.introduction = introduction
            if (link) productData.link = link
            if (imageURL) productData.imageURL = imageURL
            if (faceImageURL) productData.faceImageURL = faceImageURL
            if (faceImagePoints) productData.faceImagePoints = faceImagePoints
            if (startTime) productData.startTime = startTime
            if (endTime) productData.endTime = endTime

            if (userNumberLimit) {
                productData.userNumberLimit = userNumberLimit
            } else {
                productData.userNumberLimit = 1
            }

            if (currentTime) productData.created = currentTime
            if (currentTime) productData.updated = currentTime

            //console.log(productData)
            if (!imageURL) {
                delete productData.imageURL
            } else if (imageURL.indexOf("http://") < 0) {
                var base64Data, binaryData;
                base64Data = imageURL.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                base64Data += base64Data.replace('+', ' ');
                binaryData = new Buffer(base64Data, 'base64').toString('binary');
                fs.writeFile("images/" + serviceProvider.id + "." + productName + ".productImage.png", binaryData, "binary", function(err) {
                    console.log(err); // writes out file without error, but it's not a valid image
                });
                productData.imageURL = fileURL + serviceProvider.id + "." + productName + ".productImage.png";
            }

            if (!faceImageURL) {
                delete productData.faceImageURL
            } else if (faceImageURL.indexOf("http://") < 0) {
                var base64Data, binaryData;
                base64Data = faceImageURL.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                base64Data += base64Data.replace('+', ' ');
                binaryData = new Buffer(base64Data, 'base64').toString('binary');
                fs.writeFile("images/" + serviceProvider.id + "." + productName + ".faceImageURL.png", binaryData, "binary", function(err) {
                    console.log(err); // writes out file without error, but it's not a valid image
                });
                productData.faceImageURL = fileURL + serviceProvider.id + "." + productName + ".faceImageURL.png";
            }

            const product = new Product(productData)

            if (!_id) {
                product.save((err, result2) => {
                    if (err) {
                        console.log(err)
                        throw err;
                    } else {
                        let eventDetails = event
                        eventDetails.productId = result2._id
                        console.log(eventDetails)
                        thisOffer = new Offer(eventDetails)
                        thisOffer.save().then(function(offerResult) {

                            console.log(offerResult)
                            // User.update({
                            //     id: serviceProvider.id
                            // }, {
                            //     $addToSet: {
                            //         product: {
                            //             _id: _id,
                            //             productName: productName
                            //         },
                            //         category: category
                            //     }
                            // }, (err, data) => {
                            //     if (err) {
                            //         throw err
                            //     }
                            //     return res.status(200)
                            //         .json(productData);
                            // })
                            return res.status(200)
                                .json(productData);

                        })
                    }
                })
            } else {
                Product.update({
                    _id: _id
                }, productData, {
                    upsert: true
                }, (err, result2) => {
                    if (err) {
                        console.log(err)
                        throw err;
                    } else {
                        console.log(result2)
                        // User.update({
                        //     id: serviceProvider.id
                        // }, {
                        //     $addToSet: {
                        //         product: {
                        //             _id: _id,
                        //             productName: productName
                        //         },
                        //         category: category
                        //     }
                        // }, (err, data) => {
                        //     if (err) {
                        //         throw err
                        //     }
                        //     return res.status(200)
                        //         .json(productData);
                        // })
                        return res.status(200)
                            .json(productData);
                    }
                })

            }
        }
    })
})
//
// router.post('/', limiterPost.middleware({
//     innerLimit: 15,
//     outerLimit: 200,
//     headers: false
// }), function(req, res, next) {
//     console.log(req.body.name)
//
//     if (req.body.productName && req.body.password && req.body.serviceProviderId && req.body.nickname) {
//         if (!fs.existsSync('./images/')) {
//             fs.mkdirSync('./images/');
//         }
//         User.findOne({
//             id: req.body.serviceProviderId,
//             password: req.body.password
//         }, function(err, data) {
//             console.log(data)
//             if (err) {
//                 return next(err)
//             } else {
//                 if (!data) {
//                     res.json({
//                         data: "NO"
//                     })
//                 } else {
//                     console.log("found serviceProvider")
//                     //req.body.serviceProviderId = data._id.toString()
//                     console.log(req.body)
//                     if (req.body.productLevel == "pre") {
//                         if (data.preProduct != null) {
//                             if (data.preProduct.indexOf(req.body.productName) < 0)
//                                 User.update({
//                                     id: req.body.serviceProviderId
//                                 }, {
//                                     $addToSet: {
//                                         preProcut: req.body.productName,
//                                         category: req.body.category
//                                     }
//                                 }, function(err, data) {})
//                         } else {
//                             User.update({
//                                 id: req.body.serviceProviderId
//                             }, {
//                                 $addToSet: {
//                                     preProduct: req.body.productName,
//                                     category: req.body.category
//                                 }
//                             }, function(err, data) {})
//                         }
//                     } else {
//                         if (data.product != null) {
//                             if (data.product.indexOf(req.body.productName) < 0) {
//                                 User.update({
//                                     id: req.body.serviceProviderId
//                                 }, {
//                                     $addToSet: {
//                                         product: req.body.productName,
//                                         category: req.body.category
//                                     }
//                                 }, function(err, data) {})
//                             }
//                         } else {
//                             User.update({
//                                 id: req.body.serviceProviderId
//                             }, {
//                                 $addToSet: {
//                                     product: req.body.productName,
//                                     category: req.body.category
//                                 }
//                             }, function(err, data) {})
//                         }
//                     }
//
//
//                     var imageURL;
//                     var faceImageURL;
//                     var serviceProviderImageURL;
//                     if (!req.body.imageURL) {
//                         delete req.body.imageURL
//                     } else if (req.body.imageURL.indexOf("http") < 0) {
//
//                         imageURL = fileURL + req.body.productName + "." + req.body.serviceProviderId + ".productImage.png";
//                         data = req.body.imageURL;
//                         req.body.imageURL = imageURL;
//
//                         var base64Data, binaryData;
//                         base64Data = data.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
//                         base64Data += base64Data.replace('+', ' ');
//                         binaryData = new Buffer(base64Data, 'base64').toString('binary');
//
//
//                         fs.writeFile("images/" + req.body.productName + "." + req.body.serviceProviderId + ".productImage.png", binaryData, "binary", function(err) {
//
//                             console.log(err); // writes out file without error, but it's not a valid image
//                         });
//                     }
//
//                     if (!req.body.faceImageURL) {
//                         delete req.body.faceImageURL
//                     } else if (req.body.faceImageURL.indexOf("http") < 0) {
//                         faceImageURL = fileURL + req.body.productName + req.body.serviceProviderId + ".faceProductImage.png";
//                         data = req.body.faceImageURL;
//                         req.body.faceImageURL = faceImageURL;
//
//                         var base64Data, binaryData;
//                         base64Data = data.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
//                         base64Data += base64Data.replace('+', ' ');
//                         binaryData = new Buffer(base64Data, 'base64').toString('binary');
//
//
//                         fs.writeFile("images/" + req.body.productName + req.body.serviceProviderId + ".faceProductImage.png", binaryData, "binary", function(err) {
//
//                             console.log(err); // writes out file without error, but it's not a valid image
//                         });
//                     }
//
//                     serviceProviderImageURL = fileURL + req.body.serviceProviderId + ".userImage.png";
//                     req.body.serviceProviderImageURL = serviceProviderImageURL;
//
//
//                     delete req.body.password;
//                     var duplicateObject = JSON.parse(JSON.stringify(req.body));
//                     console.log("duplicate")
//                     console.log(duplicateObject)
//
//                     Product.update({
//                         "productName": req.body.productName
//                     }, duplicateObject, {
//                         upsert: true
//                     }, function(err, data) {
//                         if (err) {
//                             return next(err)
//                         } else {
//                             res.json({
//                                 "data": "uploaded"
//                             })
//                         }
//                     })
//                 }
//             }
//         });
//     } else {
//         res.send("NO");
//     }
// })


// router.post('/addProductComment', limiterPost.middleware({
//     innerLimit: 15,
//     outerLimit: 200,
//     headers: false
// }), function(req, res, next) {
//     console.log(req.body.id)
//     if (req.body.id != undefined && req.body.id != null && req.body.password != null) {
//
//         User.findOne({
//             "id": req.body.id,
//             "password": req.body.password
//         }, function(err, data) {
//             if (err) {
//                 console.log("err");
//                 return next(err)
//             } else if (data == null) {
//
//                 console.log("user name not exist, you can use it: " + req.body.id)
//                 res.json({
//                     "data": "NO"
//                 })
//             } else {
//
//                 insertCommentData = {
//                     discussion_id: req.body.discussion_id,
//                     parent_id: req.body.parent_id,
//                     created: req.body.created,
//                     id: req.body.id,
//                     text: req.body.text,
//                     notice: false,
//                     rate: req.body.rate
//                 }
//
//                 console.log("id exists");
//                 if (err) {
//                     console.log("err");
//                     return next(err)
//                 } else {
//                     console.log(data)
//                     Product.update({
//                         _id: req.body.discussion_id
//                     }, {
//                         $push: {
//                             comment: {
//                                 $each: [insertCommentData],
//                                 $position: 0
//                             }
//                         }
//                     }, function(err, data) {
//                         if (err) {
//                             console.log("err")
//                             return next(err)
//                         } else {
//                             console.log(data)
//                             User.update({
//                                 id: req.body.id
//                             }, {
//                                 $push: {
//                                     comment: {
//                                         discussion_id: req.body.discussion_id,
//                                         created: req.body.created
//                                     }
//                                 }
//                             }, function(err, data) {
//                                 if (err) {
//                                     console.log("err")
//                                     return next(err)
//                                 } else {
//                                     console.log(data)
//                                     res.json({
//                                         "data": "OK"
//                                     })
//                                 }
//                             })
//                         }
//                     })
//                 }
//
//             }
//         })
//     }
// })

module.exports = router;;
