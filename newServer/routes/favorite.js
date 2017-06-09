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

/* GET users listing. */
var fs = require('fs')

var fileURL = 'http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/images/'
var ObjectId = require('mongoose').Types.ObjectId;




router.post("/favoriteService", limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const id = req.body.id
    const password = req.body.password
    const _id = req.body._id

    if (!id || !password || !_id) {
        return res.status(404)
            .send({
                error: "NO id or _id or password",
                code: 3
            });
    }

    User.findOne({
        id: id,
        password: password
    }).exec((err, result) => {
        if (err) {
            res.status(500).send("err")
        } else if (result === null) {
            res.status(500).send("No user found")
        } else if (result.likedService.indexOf(_id) >= 0) {
            // unFavorite
            User.update({
                id: id
            }, {
                $pull: {
                    likedService: _id
                }
            }).exec((err, result) => {
                if (err) {
                    res.status(500).send("update Product err")
                } else {
                    Offer.update({
                        _id: _id
                    }, {
                        $pull: {
                            likedBy: id
                        }
                    }).exec((err, result) => {
                        if (err) {
                            res.status(500).send("update likedBy err")
                        } else {
                            console.log(result)
                            res.json({
                                data: "pull"
                            });
                        }
                    })
                }
            })
        } else {
            //favorite
            User.update({
                id: id
            }, {
                $addToSet: {
                    likedService: _id
                }
            }).exec((err, result) => {
                if (err) {
                    res.status(500).send("update Product err")
                } else {
                    Offer.update({
                        _id: _id
                    }, {
                        $addToSet: {
                            likedBy: id
                        }
                    }).exec((err, result) => {
                        if (err) {
                            res.status(500).send("update likedBy err")
                        } else {
                            console.log(result)
                            res.json({
                                data: "push"
                            });
                        }
                    })
                }
            })

        }
    })
})


router.post("/favoriteServiceProvider", limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const id = req.body.id
    const password = req.body.password
    const serviceProviderId = req.body.serviceProviderId

    if (!id || !password || !serviceProviderId) {
        return res.status(404)
            .send({
                error: "NO serviceProviderId or id or password",
                code: 3
            });
    }
    User.findOne({
        id: id,
        password: password
    }).exec((err, result) => {
        if (err) {
            res.status(500).send("err")
        } else if (result === null) {
            res.status(500).send("No user found")
        } else if (result.likedServiceProvider.indexOf(serviceProviderId) >= 0) {
            // unFavorite
            User.update({
                id: id
            }, {
                $pull: {
                    likedServiceProvider: serviceProviderId
                }
            }).exec((err, result) => {
                if (err) {
                    res.status(500).send("update likedServiceProvider err")
                } else {
                    User.update({
                        id: serviceProviderId
                    }, {
                        $pull: {
                            likedBy: id
                        }
                    }).exec((err, result) => {
                        if (err) {
                            res.status(500).send("update likedBy err")
                        } else {
                            console.log(result)
                            res.json({
                                data: "pull"
                            });
                        }
                    })
                }
            })
        } else {
            //favorite
            User.update({
                id: id
            }, {
                $addToSet: {
                    likedServiceProvider: serviceProviderId
                }
            }).exec((err, result) => {
                if (err) {
                    res.status(500).send("update likedServiceProvider err")
                } else {
                    User.update({
                        id: serviceProviderId
                    }, {
                        $addToSet: {
                            likedBy: id
                        }
                    }).exec((err, result) => {
                        if (err) {
                            res.status(500).send("update likedBy err")
                        } else {
                            console.log(result)
                            res.json({
                                data: "push"
                            });
                        }
                    })
                }
            })

        }
    })
})



router.get("/favoriteServices", limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const id = req.query.id;
    if (id) {
        User.findOne({
            id: id,
        }).exec((err, result) => {
            if (err) {
                res.status(500).send("err")
            } else if (result === null) {
                res.status(500).send("No user found")
            } else {
                Offer.find({
                    likedBy: {
                        $all: [id]
                    }
                }).exec((err, result) => {
                    if (err) {
                        res.status(500).send("err")
                    } else res.status(200).json(result)
                })
            }
        })
    }
})

router.get("/favoriteServiceProviders", limiterPost.middleware({
    innerLimit: 15,
    outerLimit: 200,
    headers: false
}), (req, res) => {
    const id = req.query.id;
    if (id) {
        User.findOne({
            id: id,
        }).exec((err, result) => {
            if (err) {
                res.status(500).send("err")
            } else if (result === null) {
                res.status(500).send("No user found")
            } else {
                User.find({
                    likedBy: {
                        $all: [id]
                    }
                }).exec((err, result) => {
                    if (err) {
                        res.status(500).send("err")
                    } else res.status(200).json(result)
                })
            }
        })
    }
})

module.exports = router;
