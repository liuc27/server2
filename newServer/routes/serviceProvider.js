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
var ServiceProvider = require('../models/serviceProvider')
var User = require('../models/user')
var Offer = require('../models/offer')
var Product = require('../models/product')

var fs = require('fs')
var fileURL = 'http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/images/'

// /api/serviceProviders
router.get('/', limiterGet.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    if (req.query.serviceProviderName != "null" && req.query.serviceProviderName != "undefined") {
        console.log("req.query.serviceProviderName")
        console.log(req.query.serviceProviderName)
        ServiceProvider.findOne({
            serviceProviderName: req.query.serviceProviderName
        }, function(err, data) {
            if (err) return next(err);
            res.json(data)
        });
    } else if (req.query.category == "undefined" || req.query.category == "all" || req.query.category == "null") {
        /* no filter exists */
        ServiceProvider.paginate({}, {
            offset: parseInt(req.query.skip),
            limit: parseInt(req.query.limit)
        }, function(err, serviceProviders) {
            if (err) return next(err);
            res.json(serviceProviders.docs)
        });

    } else {
        ServiceProvider.paginate({
            category: req.query.category
        }, {
            offset: parseInt(req.query.skip),
            limit: parseInt(req.query.limit)
        }, function(err, serviceProviders) {
            if (err) return next(err);
            res.json(serviceProviders.docs)
        });
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


router.post('/likeServiceProvider', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body.username)
    if (req.body.username && req.body.serviceProviderName && req.body.password) {
        User.findOne({
            "username": req.body.username,
            "password": req.body.password
        }, function(err, data) {
            if (err) {
                console.log("err");
                return next(err)
            } else {
                console.log("username exists");
                if (data.likedServiceProvider.indexOf(req.body.serviceProviderName) >= 0) {
                    console.log(data)
                    console.log(data.length)

                    User.update({
                        username: req.body.username
                    }, {
                        $pull: {
                            likedServiceProvider: req.body.serviceProviderName
                        }
                    }, function(err, data) {
                        if (err) {
                            console.log("err");
                            return next(err)
                        } else {
                            console.log(data)
                            ServiceProvider.update({
                                serviceProviderName: req.body.serviceProviderName
                            }, {
                                $pull: {
                                    likedBy: req.body.username
                                }
                            }, function(err, data) {
                                console.log("pull out likedServiceProvider")
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
                    console.log(data.likedServiceProvider.indexOf(req.body.serviceProviderName))
                    User.update({
                        username: req.body.username
                    }, {
                        $addToSet: {
                            likedServiceProvider: req.body.serviceProviderName
                        }
                    }, function(err, data) {
                        if (err) {
                            console.log("err");
                            return next(err)
                        } else {
                            console.log(data)
                            console.log("inserted likedServiceProvider")
                            ServiceProvider.update({
                                serviceProviderName: req.body.serviceProviderName
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


router.post('/addServiceProviderComment', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body.username)
    if (req.body.username && req.body.password) {

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
                    data: "NO"
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
                    ServiceProvider.update({
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
                                        data: "OK"
                                    })
                                }
                            })
                        }
                    })
                }

            }
        })
    } else {
        res.json({
            data: "NO"
        })
    }
})

router.get('/getServiceProviderCalendar', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    /* category filter exists */
    if (req.query.serviceProviderName) {
        ServiceProvider.findOne({
            serviceProviderName: req.query.serviceProviderName
        }, function(err, data) {
            if (err) {
                return next(err)
            } else {
                if (data == null) {
                    res.send("did not find serviceProvider")
                } else {

                    Offer.find({
                        serviceProviderName: {
                            $all: [req.query.serviceProviderName]
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


router.post('/serviceProviderRegister', limiterGet.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    if (req.body.serviceProviderName && req.body.serviceProviderNickname) {
        ServiceProvider.findOne({
            "serviceProviderName": req.body.serviceProviderName
        }, function(err, data) {
            if (err) {
                console.log("err");
                return next(err)
            } else {
                var flag = false;
                if (data) {
                    if (req.body.password && data.password) {
                        if (data.password == req.body.password) {
                            flag = true;
                        }
                    }
                } else {
                    flag = true;
                }
                if (flag == true) {
                    if (!req.body.imageURL) {
                        delete req.body.imageURL
                    } else if (req.body.imageURL.indexOf("http://") < 0) {
                        console.log("is not valid url")
                        var imageURL = fileURL + req.body.serviceProviderName + ".serviceProviderImage.png";
                        var theData = req.body.imageURL;
                        req.body.serviceProviderImageURL = imageURL;

                        var base64Data, binaryData;
                        base64Data = theData.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                        base64Data += base64Data.replace('+', ' ');
                        binaryData = new Buffer(base64Data, 'base64').toString('binary');


                        fs.writeFile("images/" + req.body.serviceProviderName + ".serviceProviderImage.png", binaryData, "binary", function(err) {

                            console.log(err); // writes out file without error, but it's not a valid image
                        });
                    }
                    console.log("req.body is")
                    console.log(req.body)

                    ServiceProvider.update({
                        serviceProviderName: req.body.serviceProviderName
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
            }
        })
    }
})


router.post('/serviceProviderLogin', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), function(req, res, next) {
    console.log(req.body.serviceProviderName)
    console.log(req.body.password)

    if (req.body.serviceProviderName && req.body.password) {

        ServiceProvider.findOne({
            "serviceProviderName": req.body.serviceProviderName,
            "password": req.body.password
        }, function(err, data) {
            if (err) {
                console.log("err");
                return next(err)
            } else if (data == null) {

                console.log("user name not exist, you can use it: " + req.body.username)

                res.json({
                    data: "notExist"
                })
            } else {
                var returnData = JSON.parse(JSON.stringify(data))
                returnData["data"] = "OK"
                res.json(returnData)
            }
        })
    }
})


router.post('/serviceProviderWechatLogin', limiterGet.middleware({
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
                            if (returnData.openid) newUser.serviceProviderName = "wechat" + returnData.openid
                            if (returnData.nickname) newUser.serviceProviderNickname = returnData.nickname
                            if (returnData.sex) newUser.sex = returnData.sex
                            if (returnData.launguage) newUser.launguage = returnData.launguage
                            if (returnData.city) newUser.city = returnData.city
                            if (returnData.province) newUser.province = returnData.province
                            if (returnData.country) newUser.country = returnData.country
                            if (returnData.headimgurl) {
                                newUser.serviceProviderImageURL = returnData.headimgurl
                            }
                            newUser.password = "wechat" + Math.random().toString(36).slice(-8)
                            console.log(newUser)

                            ServiceProvider.update({
                                serviceProviderName: newUser.serviceProviderName
                            }, newUser, {
                                upsert: true
                            }, function(err, data2) {
                                if (err) {
                                    return next(err)
                                } else if (data2) {
                                    console.log("inserted")
                                    res.json(newUser);
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


module.exports = router;
