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

/* GET users listing. */
var fs = require('fs')

var fileURL = 'http://10.201.219.13:3000/images/'
var ObjectId = require('mongoose').Types.ObjectId;

// api/user

// var imageProcess = function (req, res, next) {
//   req.requestTime = Date.now();
//   next();
// };
//
// app.use(imageProcess);

router.get('/', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {

    const category = req.query.category
    const query = {}
    let skipClause = 0
    let limitClause = 20
    if (req.query.skip) skipClause = parseInt(req.query.skip)
    if (req.query.limit) limitClause = parseInt(req.query.limit)

    if (category && category != "all") {
        query = {
            category: category
        }
    }
    User.paginate(query, {
        select: 'id nickname imageURL time introduction',
        offset: skipClause,
        limit: limitClause
    }, function(err, data) {
        if (err) return next(err);
        res.json(data.docs)
    });
})

router.get('/:id', limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(500)
            .send("Id not exist");
    }

    User.findOne({
        id: id
    }, '-password').exec((err, result) => {
        if (err) {
            throw err;
        } else if (result == null) {
            res.status(500).send("use not found")
        } else {
            console.log("result")
            console.log(result)
            res.status(200)
                .json(result);
        }
    })
})

router.put("/:id", (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400)
            .send({
                error: "INVALID ID",
                code: 1
            });
    }
    if (!req.body.id || !req.body.password) {
        return res.status(500)
            .send("No id or password")
    }
    const _id = req.params.id;
    const userType = "user"
    const id = req.body.id;
    const password = req.body.password;
    const nickname = req.body.nickname;
    const country = req.body.country;
    const city = req.body.city;
    const province = req.body.province;
    const language = req.body.language;
    const sex = req.body.sex;
    const age = req.body.age;
    const introduction = req.body.introduction;
    const contact = req.body.contact;
    const currentTime = new Date();
    let imageURL = req.body.imageURL


    User.findById(_id, (err, userData) => {
        if (err) {
            console.log(err)
            throw err;
        }
        if (!userData) {
            return res.status(404)
                .send({
                    error: "NO RESOURCE",
                    code: 3
                });
        } else if (password === userData.password) {
            if (userType) userData.userType = userType
            if (id) userData.id = id
            if (password) userData.password = password
            if (nickname) userData.nickname = nickname
            if (country) userData.country = country
            if (city) userData.city = city
            if (province) userData.province = province
            if (language) userData.language = language
            if (sex) userData.sex = sex
            if (age) userData.age = age
            if (introduction) userData.introduction = introduction
            if (imageURL) userData.imageURL = imageURL
            if (currentTime) userData.updated = currentTime

            if (!imageURL) {
                delete userData.imageURL
            } else if (imageURL.indexOf("http://") < 0) {
                var base64Data, binaryData;
                base64Data = imageURL.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                base64Data += base64Data.replace('+', ' ');
                binaryData = new Buffer(base64Data, 'base64').toString('binary');
                fs.writeFile("images/" + id + ".userImage.png", binaryData, "binary", function(err) {
                    console.log(err); // writes out file without error, but it's not a valid image
                });
                userData.imageURL = fileURL + id + ".userImage.png";
            }

            user = new User(userData)
            console.log(userData)
            user.save(err => {
                if (err) {
                    throw err;
                }
                return res.status(200)
                    .json(user);
            });
        } else {
            res.status(500).send("Wrong password")
        }
    })
})

router.post("/", (req, res) => {

    if (!req.body.id || !req.body.password || !req.body.imageURL || !req.body.nickname) {
        return res.status(500)
            .send("No id or password or image or nickname")
    }

    const userType = "user"
    const id = req.body.id;
    const password = req.body.password;
    const nickname = req.body.nickname;
    const country = req.body.country;
    const city = req.body.city;
    const province = req.body.province;
    const language = req.body.language;
    const sex = req.body.sex;
    const age = req.body.age;
    const introduction = req.body.introduction;
    const contact = req.body.contact;
    const currentTime = new Date();
    let imageURL = req.body.imageURL;
    const userData = {}

    User.findOne({
        "id": req.body.id
    }, (err, result) => {
        if (err) {
            throw err;
        } else if (result === null) {
            if (userType) userData.userType = userType
            if (id) userData.id = id
            if (password) userData.password = password
            if (nickname) userData.nickname = nickname
            if (country) userData.country = country
            if (city) userData.city = city
            if (province) userData.province = province
            if (language) userData.language = language
            if (sex) userData.sex = sex
            if (age) userData.age = age
            if (introduction) userData.introduction = introduction
            if (imageURL) userData.imageURL = imageURL
            if (currentTime) userData.created = currentTime
            if (currentTime) userData.updated = currentTime

            if (!imageURL) {
                delete userData.imageURL
            } else if (imageURL.indexOf("http://") < 0) {
                var base64Data, binaryData;
                base64Data = imageURL.replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/png;base64,/, "");
                base64Data += base64Data.replace('+', ' ');
                binaryData = new Buffer(base64Data, 'base64').toString('binary');
                fs.writeFile("images/" + id + ".userImage.png", binaryData, "binary", function(err) {
                    console.log(err); // writes out file without error, but it's not a valid image
                });
                userData.imageURL = fileURL + id + ".userImage.png";
            }
            const user = new User(userData)
            user.save((err, result) => {
                if (err) {
                    throw err;
                } else {
                    return res.status(200)
                        .json(userData);
                }
            })
        } else res.status(500).send("Username already registered")
    })
})

router.post("/login", limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    if (!req.body.id && !req.body.password) {
        return res.status(500)
            .send("No id or password")
    }

    const id = req.body.id
    const password = req.body.password

    User.findOne({
        id: id,
        password: password
    }, (err, result) => {
        if (err) {
            throw err
        } else if (result == null) {
            res.status(500).send("use not found")
        } else res.status(200).json(result)

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
                            if (returnData.openid) newUser.id = "wechat" + returnData.openid
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
                                id: newUser.id
                            }, newUser, {
                                upsert: true
                            }, function(err, data2) {
                                if (err) {
                                    return next(err)
                                } else if (data2) {
                                    console.log("inserted")
                                    User.findOne({
                                        id: newUser.id
                                    }, (err, result) => {
                                        if (err) {
                                            throw err
                                        } else if (result == null) {
                                            res.status(500).send("use not found")
                                        } else res.status(200).json(result)
                                    })
                                    // function(err, data3) {
                                    //     if (err) {
                                    //         console.log("err")
                                    //         return next(err)
                                    //     } else {
                                    //         console.log(data3)
                                    //         res.json(data3);
                                    //
                                    //     }
                                    // })
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
