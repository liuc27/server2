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

var fs = require('fs')
var fileURL = 'http://10.201.219.13:3000/images/'
var ObjectId = require('mongoose').Types.ObjectId;

/* /api/products */

router.get('/', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {

    const category = req.query.category
    const serviceProviderId = req.query.serviceProviderId
    const query = {}
    let skipClause = 0
    let limitClause = 20
    if (req.query.skip) skipClause = parseInt(req.query.skip)
    if (req.query.limit) limitClause = parseInt(req.query.limit)
    if (serviceProviderId) {
        query.serviceProviderId = serviceProviderId
    }
    if (category && category != "all") {
        query.category = category
    }
    console.log(query)
    Product.paginate(query, {
        select: 'productName imageURL likedBy serviceProviderId serviceProviderImageURL time nickname',
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
        name: 'Food',
        icon: 'ios-wine',
        color: 'red',
        category: 'food'
    }, {
        id: 1,
        name: 'Funding',
        icon: 'ios-cafe',
        color: '#5383FF',
        category: 'funding'

    }, {
        id: 2,
        name: 'Beauty',
        icon: 'ios-color-wand',
        color: 'pink',
        category: 'beauty'
    }, {
        id: 3,
        name: 'School',
        icon: 'ios-school',
        color: '#5383FF',
        category: 'school'
    }, {
        id: 4,
        name: 'Lang',
        icon: 'ios-chatboxes',
        color: 'silver',
        category: 'launguage'
    }, {
        id: 5,
        name: 'Operate',
        icon: 'ios-laptop',
        color: 'gold',
        category: 'operating'
    }, {
        id: 6,
        name: 'Skill',
        icon: 'ios-construct',
        color: 'lightgreen',
        category: 'skill'
    }, {
        id: 7,
        name: 'Childcare',
        icon: 'ios-musical-notes',
        color: 'lightgreen',
        category: 'childcare'
    }, {
        id: 8,
        name: 'Trend',
        icon: 'md-add',
        color: 'lightgreen',
        category: 'trend'
    }, {
        id: 9,
        name: 'All',
        icon: 'ios-eye',
        color: 'orange',
        category: 'all'
    }]
    res.json(data)
})

// api/product

router.post("/", (req, res) => {

    if (!req.body.productName || !req.body.password || !req.body.serviceProviderId || !req.body.nickname || !req.body.category || !req.body.serviceProviderImageURL || !req.body.imageURL) {
        return res.status(500)
            .send("No productName or serviceProviderId or password or nickname or category or imageURL ")
    }

    const productName = req.body.productName
    const serviceProviderId = req.body.serviceProviderId
    const nickname = req.body.nickname
    const password = req.body.password
    const serviceProviderImageURL = req.body.serviceProviderImageURL
    const category = req.body.category
    const time = req.body.time
    const retail = req.body.retail
    const list = req.body.list
    const rate = req.body.rate
    const introduction = req.body.introduction
    const link = req.body.link
    const faceImagePoints = req.body.faceImagePoints
    const currentTime = new Date();

    let imageURL = req.body.imageURL;
    let faceImageURL = req.body.faceImageURL;

    const productData = {}

    User.findOne({
        id: req.body.serviceProviderId,
        password: req.body.password
    }, (err, result) => {
        if (err) {
            throw err;
        } else if (result === null) {
            res.status(500).send("serviceProviderId not registered")
        } else {
            if (productName) productData.productName = productName
            if (serviceProviderId) productData.serviceProviderId = serviceProviderId
            if (password) productData.password = password
            if (nickname) productData.nickname = nickname
            if (serviceProviderImageURL) productData.serviceProviderImageURL = serviceProviderImageURL
            if (category) productData.category = category

            if (time) productData.time = time
            if (retail) productData.retail = retail
            if (list) productData.list = list
            if (introduction) productData.introduction = introduction
            if (link) productData.link = link
            if (imageURL) productData.imageURL = imageURL
            if (faceImageURL) productData.faceImageURL = faceImageURL
            if (faceImagePoints) productData.faceImagePoints = faceImagePoints

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
                fs.writeFile("images/" + serviceProviderId + "." + productName + ".productImage.png", binaryData, "binary", function(err) {
                    console.log(err); // writes out file without error, but it's not a valid image
                });
                productData.imageURL = fileURL + serviceProviderId + "." + productName + ".productImage.png";
            }

            if (!faceImageURL) {
                delete productData.faceImageURL
            } else if (faceImageURL.indexOf("http://") < 0) {
                var base64Data, binaryData;
                base64Data = faceImageURL.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                base64Data += base64Data.replace('+', ' ');
                binaryData = new Buffer(base64Data, 'base64').toString('binary');
                fs.writeFile("images/" + serviceProviderId + "." + productName + ".faceImageURL.png", binaryData, "binary", function(err) {
                    console.log(err); // writes out file without error, but it's not a valid image
                });
                productData.faceImageURL = fileURL + serviceProviderId + "." + productName + ".faceImageURL.png";
            }

            console.log(productData)
            const product = new Product(productData)


            Product.findOne({
                serviceProviderId: serviceProviderId,
                productName: productName
            }, (err, result) => {
                if (err) {
                    throw err;
                } else if (result === null) {
                    product.save((err, result) => {
                        if (err) {
                            throw err;
                        } else {
                            console.log(result)
                            User.update({
                                id: req.body.serviceProviderId
                            }, {
                                $addToSet: {
                                    product: {
                                        id: result._id,
                                        productName: req.body.productName
                                    },
                                    category: req.body.category
                                }
                            }, (err, data) => {
                                if (err) {
                                    throw err
                                }
                                return res.status(200)
                                    .json(productData);
                            })
                        }
                    })
                } else {
                    res.status(500).send("Product Name already exists")
                }
            })
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
//                     posted: req.body.posted,
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
//                                         posted: req.body.posted
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

module.exports = router;
