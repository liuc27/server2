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
var ServiceProvider = require('../models/serviceProvider')
var User = require('../models/user')

var fs = require('fs')
var fileURL = 'http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/images/'

/* /api/products */
router.get('/', limiterGet.middleware({
    innerLimit: 1000,
    outerLimit: 6000,
    headers: false
}), function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    /* category filter exists */
    if (req.query.category != "null" && req.query.category != "undefined" && req.query.category != "all") {
        console.log("1rd")
        Product.paginate({
            category: req.query.category
        }, {
            select: 'productName imageURL likedBy serviceProviderName serviceProviderImageURL time serviceProviderId',
            offset: parseInt(req.query.skip),
            limit: parseInt(req.query.limit)
        }, function(err, products) {
            if (err) return next(err);
            res.json(products.docs)
        });
    } else {
        /* serviceProviderName filter exists */
        if (req.query.serviceProviderName != "null" && req.query.serviceProviderName != "undefined") {
            console.log("2rd")
            Product.paginate({
                serviceProviderName: req.query.serviceProviderName
            }, {
                select: 'productName imageURL likedBy serviceProviderName serviceProviderImageURL time serviceProviderId',
                offset: parseInt(req.query.skip),
                limit: parseInt(req.query.limit)
            }, function(err, products) {
                if (err) return next(err);
                res.json(products.docs)
            });
        } else {
            /* no filter exists */
            Product.paginate({}, {
                select: 'productName imageURL likedBy serviceProviderName serviceProviderImageURL time serviceProviderId',
                offset: parseInt(req.query.skip),
                limit: parseInt(req.query.limit)
            }, function(err, products) {
                if (err) return next(err);
                res.json(products.docs)
            });
        }
    }

})

// api/productDetails
router.get('/productDetails', limiterGet.middleware({
    innerLimit: 1000,
    outerLimit: 6000,
    headers: false
}), function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var objectData
    var returnData
    var signedCookiesData

    if (req.query._id) {
        Product.findOne({
            _id: req.query._id
        }, function(err, data) {
            if (err) {
                return next(err)
            } else {
                // var options = {
                //     keypairId: 'APKAJRBOBPGRJI3TZONQ',
                //     privateKeyPath: './pk-APKAJRBOBPGRJI3TZONQ.pem',
                //     expireTime: Date.now() + 6000000
                // }
                // var signedURL = cf.getSignedUrl('http://d247r75rbkpi3y.cloudfront.net/trump.mp4', options);
                // if (signedURL) data.videoURL = signedURL
                console.log(data)
                res.json(data)
            }
        })
    }
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
router.post('/', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body.name)

    if (req.body.productName && req.body.password && req.body.serviceProviderName && req.body.serviceProviderNickname) {
        if (!fs.existsSync('./images/')) {
            fs.mkdirSync('./images/');
        }
        ServiceProvider.findOne({
            serviceProviderName: req.body.serviceProviderName,
            password: req.body.password
        }, function(err, data) {
            console.log(data)
            if (err) {
                return next(err)
            } else {
                if (!data) {
                    res.send("找不到serviceProvider")
                } else {
                    console.log("found serviceProvider")
                    req.body.serviceProviderId = data._id.toString()
                    console.log(req.body)
                    if (req.body.productLevel == "pre") {
                        if (data.preProduct != null) {
                            if (data.preProduct.indexOf(req.body.productName) < 0)
                                ServiceProvider.update({
                                    serviceProviderName: req.body.serviceProviderName
                                }, {
                                    $addToSet: {
                                        preProcut: req.body.productName,
                                        category: req.body.category
                                    }
                                }, function(err, data) {})
                        } else {
                            ServiceProvider.update({
                                serviceProviderName: req.body.serviceProviderName
                            }, {
                                $addToSet: {
                                    preProduct: req.body.productName,
                                    category: req.body.category
                                }
                            }, function(err, data) {})
                        }
                    } else {
                        if (data.product != null) {
                            if (data.product.indexOf(req.body.productName) < 0) {
                                ServiceProvider.update({
                                    serviceProviderName: req.body.serviceProviderName
                                }, {
                                    $addToSet: {
                                        product: req.body.productName,
                                        category: req.body.category
                                    }
                                }, function(err, data) {})
                            }
                        } else {
                            ServiceProvider.update({
                                serviceProviderName: req.body.serviceProviderName
                            }, {
                                $addToSet: {
                                    product: req.body.productName,
                                    category: req.body.category
                                }
                            }, function(err, data) {})
                        }
                    }


                    var imageURL;
                    var faceImageURL;
                    var serviceProviderImageURL;
                    if (!req.body.imageURL) {
                        delete req.body.imageURL
                    } else if (req.body.imageURL.indexOf("http") < 0) {

                        imageURL = fileURL + req.body.productName + ".productImage.png";
                        data = req.body.imageURL;
                        req.body.imageURL = imageURL;

                        var base64Data, binaryData;
                        base64Data = data.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                        base64Data += base64Data.replace('+', ' ');
                        binaryData = new Buffer(base64Data, 'base64').toString('binary');


                        fs.writeFile("images/" + req.body.productName + ".productImage.png", binaryData, "binary", function(err) {

                            console.log(err); // writes out file without error, but it's not a valid image
                        });
                    }

                    if (!req.body.faceImageURL) {
                        delete req.body.faceImageURL
                    } else if (req.body.faceImageURL.indexOf("http") < 0) {
                        faceImageURL = fileURL + req.body.productName + ".faceProductImage.png";
                        data = req.body.faceImageURL;
                        req.body.faceImageURL = faceImageURL;

                        var base64Data, binaryData;
                        base64Data = data.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                        base64Data += base64Data.replace('+', ' ');
                        binaryData = new Buffer(base64Data, 'base64').toString('binary');


                        fs.writeFile("images/" + req.body.productName + ".faceProductImage.png", binaryData, "binary", function(err) {

                            console.log(err); // writes out file without error, but it's not a valid image
                        });
                    }

                    serviceProviderImageURL = fileURL + req.body.serviceProviderName + ".serviceProviderImage.png";
                    req.body.serviceProviderImageURL = serviceProviderImageURL;


                    delete req.body.password;
                    var duplicateObject = JSON.parse(JSON.stringify(req.body));
                    console.log("duplicate")
                    console.log(duplicateObject)

                    Product.update({
                        "productName": req.body.productName
                    }, duplicateObject, {
                        upsert: true
                    }, function(err, data) {
                        if (err) {
                            return next(err)
                        } else {
                            res.json({
                                "data": "uploaded"
                            })
                        }
                    })
                }
            }
        });
    } else {
        res.send("NO");
    }
})

router.post('/likeProduct', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body)

    if (req.body.username && req.body.password && req.body._id) {
        console.log("start")
        User.findOne({
            "username": req.body.username,
            "password": req.body.password
        }, function(err, data) {
            console.log(data)
            if (err) {
                console.log("err");
                return next(err)
            } else {
                console.log("username exists");
                if (data.likedProduct.indexOf(req.body._id) >= 0) {
                    console.log(data)
                    console.log(data.length)

                    User.update({
                        username: req.body.username
                    }, {
                        $pull: {
                            likedProduct: req.body._id
                        }
                    }, function(err, data) {
                        if (err) {
                            console.log("err");
                            return next(err)
                        } else {
                            Product.update({
                                _id: req.body._id
                            }, {
                                $pull: {
                                    likedBy: req.body.username
                                }
                            }, function(err, data) {
                                console.log("pull out likedProduct")
                                if (err) {
                                    console.log("err")
                                    return next(err)
                                } else {
                                    console.log(data)
                                    res.json({
                                        data: "pull"
                                    });

                                }
                            })
                        }
                    })

                } else {
                    console.log(data.likedProduct.indexOf(req.body._id))
                    User.update({
                        username: req.body.username
                    }, {
                        $addToSet: {
                            likedProduct: req.body._id
                        }
                    }, function(err, data) {
                        if (err) {
                            console.log("err");
                            return next(err)
                        } else {
                            console.log("inserted likedProduct")
                            Product.update({
                                _id: req.body._id
                            }, {
                                $addToSet: {
                                    likedBy: req.body.username
                                }
                            }, function(err, data) {
                                if (err) {
                                    console.log("err")
                                    return next(err)
                                } else {
                                    console.log(data)
                                    res.json({
                                        data: "push"
                                    });

                                }
                            })
                        }
                    })
                }
            }
        })
    }
})

router.post('/addProductComment', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body.username)
    if (req.body.username != undefined && req.body.username != null && req.body.password != null) {

        User.findOne({
            "username": req.body.username,
            "password": req.body.password
        }, function(err, data) {
            if (err) {
                console.log("err");
                return next(err)
            } else if (data == null) {

                console.log("user name not exist, you can use it: " + req.body.username)
                res.json({
                    "data": "NO"
                })
            } else {

                insertCommentData = {
                    discussion_id: req.body.discussion_id,
                    parent_id: req.body.parent_id,
                    posted: req.body.posted,
                    username: req.body.username,
                    text: req.body.text,
                    notice: false,
                    rate: req.body.rate
                }

                console.log("username exists");
                if (err) {
                    console.log("err");
                    return next(err)
                } else {
                    console.log(data)
                    Product.update({
                        _id: req.body.discussion_id
                    }, {
                        $push: {
                            comment: {
                                $each: [insertCommentData],
                                $position: 0
                            }
                        }
                    }, function(err, data) {
                        if (err) {
                            console.log("err")
                            return next(err)
                        } else {
                            console.log(data)
                            User.update({
                                username: req.body.username
                            }, {
                                $push: {
                                    comment: {
                                        discussion_id: req.body.discussion_id,
                                        posted: req.body.posted
                                    }
                                }
                            }, function(err, data) {
                                if (err) {
                                    console.log("err")
                                    return next(err)
                                } else {
                                    console.log(data)
                                    res.json({
                                        "data": "OK"
                                    })
                                }
                            })
                        }
                    })
                }

            }
        })
    }
})

module.exports = router;
