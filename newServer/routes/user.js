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
var Product = require('../models/product')
var Offer = require('../models/offer')

/* GET users listing. */
var fs = require('fs')

var fileURL = 'http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/images/'

// api/user
router.get('/', function(req, res, next) {
    User.find(function(err, data) {
        if (err) {
            return next(err)
        }
        console.log(data)
        res.json(data)
    })
})

router.post('/wechatLogin', limiterGet.middleware({
    innerLimit: 10,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body)
    var https = require('https');

    var returnData;
    var options1 = {
        host: 'api.weixin.qq.com',
        port: 443,
        path: '/sns/oauth2/access_token?appid=wxf3055e7413a25932&secret=b7da5fcffd98448a2249ee5aecab90e7&code=' + req.body.code + '&grant_type=authorization_code'
    };

    console.log("start")
    var req1 = https.get(options1, function(res1) {
        console.log('STATUS: ' + res1.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res1.headers));

        // Buffer the body entirely for processing as a whole.
        var bodyChunks1 = [];
        res1.on('data', function(chunk) {
            // You can process streamed parts here...
            bodyChunks1.push(chunk);
        }).on('end', function() {
            var body1 = Buffer.concat(bodyChunks1);
            console.log('BODY: ' + body1);
            console.log(body1.toString('utf8'))
            console.log(JSON.parse(body1.toString('utf8')).refresh_token)
            // ...and/or process the entire body here.
            var options2 = {
                host: 'api.weixin.qq.com',
                port: 443,
                path: '/sns/oauth2/refresh_token?appid=wxf3055e7413a25932&grant_type=refresh_token&refresh_token=' + (JSON.parse(body1.toString('utf8'))).refresh_token
            };
            var req2 = https.get(options2, function(res2) {
                console.log('STATUS: ' + res2.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res2.headers));

                // Buffer the body entirely for processing as a whole.
                var bodyChunks2 = [];
                res2.on('data', function(chunk) {
                    // You can process streamed parts here...
                    bodyChunks2.push(chunk);
                }).on('end', function() {
                    var body2 = Buffer.concat(bodyChunks2);

                    var options3 = {
                        host: 'api.weixin.qq.com',
                        port: 443,
                        path: '/sns/userinfo?access_token=' + (JSON.parse(body2.toString('utf8'))).access_token + '&openid=' + (JSON.parse(body2.toString('utf8'))).openid + '&lang=zh_CN'
                    };
                    var req3 = https.get(options3, function(res3) {
                        console.log('STATUS: ' + res3.statusCode);
                        console.log('HEADERS: ' + JSON.stringify(res3.headers));

                        // Buffer the body entirely for processing as a whole.
                        var bodyChunks3 = [];
                        res3.on('data', function(chunk) {
                            // You can process streamed parts here...
                            bodyChunks3.push(chunk);
                        }).on('end', function() {
                            var body3 = Buffer.concat(bodyChunks3);
                            console.log('BODY3: ' + body3);
                            returnData = JSON.parse(body3.toString('utf8'));
                            console.log("send back response")
                            console.log(returnData)

                            var newUser = {};
                            if (returnData.openid) newUser.username = "wechat" + returnData.openid
                            if (returnData.nickname) newUser.nickname = returnData.nickname
                            if (returnData.sex) newUser.sex = returnData.sex
                            if (returnData.launguage) newUser.launguage = returnData.launguage
                            if (returnData.city) newUser.city = returnData.city
                            if (returnData.province) newUser.province = returnData.province
                            if (returnData.country) newUser.country = returnData.country
                            if (returnData.headimgurl) newUser.imageURL = returnData.headimgurl
                            newUser.password = "wechat" + Math.random().toString(36).slice(-8)
                            console.log(newUser)

                            User.update({
                                username: newUser.username
                            }, newUser, {
                                upsert: true
                            }, function(err, data2) {
                                if (err) {
                                    return next(err)
                                } else if (data2) {
                                    console.log("inserted")
                                    User.findOne({
                                        username: newUser.username
                                    }, function(err, data3) {
                                        if (err) {
                                            console.log("err")
                                            return next(err)
                                        } else {
                                            console.log(data3)
                                            res.json(data3);

                                        }
                                    })
                                }
                            })

                        })
                    }).on('error', function(e) {
                        console.log('problem with request: ' + e.message);
                    })

                })
            }).on('error', function(e) {
                console.log('problem with request: ' + e.message);
            })
        })
    }).on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

})



router.post('/register', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body.username)
    if (req.body.username && req.body.password) {

        User.findOne({
            "username": req.body.username
        }, function(err, data) {
            if (err) {
                console.log("err");
                return next(err)
            } else if (data == null) {

                console.log("user name not exist, you can use it: " + req.body.username)
                // var token = jwt.encode({
                //     username: req.body.username
                // }, secretKey)
                // console.log(token)


                if (!req.body.imageURL) {
                    delete req.body.imageURL
                } else if (req.body.imageURL.indexOf("http://") < 0) {


                    var imageURL = fileURL + req.body.username + ".userImage.png";
                    var theData = req.body.imageURL;
                    req.body.imageURL = imageURL;

                    var base64Data, binaryData;
                    base64Data = theData.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                    base64Data += base64Data.replace('+', ' ');
                    binaryData = new Buffer(base64Data, 'base64').toString('binary');


                    fs.writeFile("images/" + req.body.username + ".userImage.png", binaryData, "binary", function(err) {

                        console.log(err); // writes out file without error, but it's not a valid image
                    });
                }

                User.update({
                    username: req.body.username
                }, req.body, {
                    upsert: true
                }, function(err, data2) {
                    if (err) {
                        return next(err)
                    } else if (data2) {
                        res.json({
                            data: 'OK'
                        })
                    }
                })
            } else if (data.password == req.body.password) {
                console.log("password right, your username is " + req.body.username)
                // var token = jwt.encode({
                //     username: req.body.username
                // }, secretKey)
                // console.log(token)


                if (!req.body.imageURL) {
                    delete req.body.imageURL
                } else if (req.body.imageURL.indexOf("http://") < 0) {

                    var imageURL = fileURL + req.body.username + ".userImage.png";
                    var theData = req.body.imageURL;
                    req.body.imageURL = imageURL;

                    var base64Data, binaryData;
                    base64Data = theData.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                    base64Data += base64Data.replace('+', ' ');
                    binaryData = new Buffer(base64Data, 'base64').toString('binary');


                    fs.writeFile("images/" + req.body.username + ".userImage.png", binaryData, "binary", function(err) {

                        console.log(err); // writes out file without error, but it's not a valid image
                    });
                }

                User.update({
                    username: req.body.username
                }, req.body, {
                    upsert: true
                }, function(err, data2) {
                    if (err) {
                        return next(err)
                    } else if (data2) {
                        console.log("inserted")
                        res.json({
                            data: 'OK'
                        })
                    }
                })

            } else {
                res.json({
                    data: "alreadyExist"
                })
            }
        })
    }
})


router.post('/login', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body.username)
    if (req.body.username && req.body.password) {

        User.findOne({
            "username": req.body.username
        }, function(err, data) {
            if (err) {
                console.log("err");
                return next(err)
            } else if (data == null) {
                res.json({
                    data: "NO2"
                })
            } else {
                if (req.body.password == data.password) {
                    var returnData = JSON.parse(JSON.stringify(data))
                    returnData["data"] = "OK"
                    res.json(returnData)
                } else {
                    res.json({
                        data: "NO"
                    })
                }
            }
        })
    }
})



router.post('/likedProduct', limiterGet.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body)
    if (req.body.username && req.body.password) {
        User.findOne({
            "username": req.body.username
        }, function(err, data) {
            if (err) {
                console.log("err");
                return next(err)
            } else if (req.body.password == data.password) {
                Product.paginate({
                    _id: {
                        $in: req.body.likedProduct
                    }
                }, {
                    select: 'productName imageURL likedBy serviceProviderName serviceProviderImageURL time',
                    offset: parseInt(req.body.skip),
                    limit: parseInt(req.body.limit)
                }, function(err, products) {
                    if (err) return next(err);
                    console.log(products.docs)
                    res.json(products.docs)
                });

            }
        })
    }
})


router.get('/getMyReservation', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    /* category filter exists */
    if (req.query.username) {
        User.findOne({
            username: req.query.username,
            password: req.query.password
        }, function(err, data) {
            if (err) {
                return next(err)
            } else {
                if (data == null) {
                    res.send("did not find serviceProvider")
                } else {
                    console.log("found serviceProvider and return data")
                    Offer.find({
                        username: {
                            $all: [req.query.username]
                        }
                    }, function(err, data) {
                        res.json(data)
                    })
                }
            }
        })
    }
})

router.get('/getMyFavorites', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    /* category filter exists */
    if (req.query.username) {
        User.findOne({
            username: req.query.username,
            password: req.query.password
        }, function(err, data) {
            if (err) {
                return next(err)
            } else {
                if (data == null) {
                    res.send("did not find user")
                } else {
                    console.log("found user and return data")
                    Product.find({
                        likedBy: {
                            $all: [req.query.username]
                        }
                    }, function(err, data) {
                        console.log(data)
                        res.json(data)
                    })
                }
            }
        })
    }
})

router.get('/getMyFavoriteArtists', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    /* category filter exists */
    if (req.query.username) {
        User.findOne({
            username: req.query.username,
            password: req.query.password
        }, function(err, data) {
            if (err) {
                return next(err)
            } else {
                if (data == null) {
                    res.send("did not find user")
                } else {
                    console.log("found user and return data")
                    ServiceProvider.find({
                        likedBy: {
                            $all: [req.query.username]
                        }
                    }, function(err, data) {
                        if (err) {
                            res.json({
                                data: "NO"
                            })
                        }
                        console.log(data)
                        data["data"] = "OK"
                        res.json(data)
                    })
                }
            }
        })
    }
})

module.exports = router;
