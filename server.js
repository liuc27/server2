var express = require('express'),
    cors = require('cors'),
    app = express();
app.use(cors());
var bodyParser = require('body-parser')
var Post = require('./models/post')
var Type = require('./models/Types')
var User = require('./models/user')
var jwt = require('jwt-simple')
var _ = require('lodash')
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');



var fs = require('fs')

var secretKey = 'supersecretkey'

var logger = require('morgan')
app.use(bodyParser.json({
    limit: '50mb'
}))
app.use(logger('dev'))
app.use(express.static(__dirname))
app.get('/api/posts', function (req, res, next) {
    Post.find({}, function (err, posts) {
        if (err) {
            return next(err)
        }
        res.json(posts)
    })

})

app.post('/api/posts', function (req, res, next) {
    var idNumber;
    Post.find({}, function (err, posts) {
        if (err) {
            return next(err)
        }
      if(posts.length <= 0) {
        idNumber = 0
        localStorage.setItem("idNumber",idNumber)
      }else{
        idNumber = localStorage.getItem("idNumber")
        console.log(idNumber++)
        localStorage.setItem("idNumber",idNumber)
      }
        callback(idNumber, req, res)
    })
})

var callback = function (idNumber, req, res) {
    var post = new Post({
        id: idNumber,
        name: req.body.name,
        category: req.body.category,
        productName: req.body.productName,
        productIntroduction: req.body.productIntroduction,
        productDetail: req.body.productDetail,
        image: req.body.image
    })

    post.save(function (err, post) {
        if (err) {
            return next(err)
        }
        res.status(201).json(post)
    })
}

app.post('/api/postAll', function (req, res, next) {
  var idNumber;
  Post.find({}, function (err, posts) {
    if (err) {
      return next(err)
    }else{
    for(var i = 0; i< req.count; i++){
  
      if(posts.length <= 0) {
        idNumber = 0
        localStorage.setItem("idNumber",idNumber)
      }else{
        idNumber = localStorage.getItem("idNumber")
        console.log(idNumber++)
        localStorage.setItem("idNumber",idNumber)
      }
      callback(idNumber, req[i], res)
      }
    }
  })
})

app.get('/api/types', function (req, res, next) {
    Type.find(function (err, Type) {
        if (err) {
            return next(err)
        }
        res.json(Type)
    })
})

app.post('/api/types', function (req, res, next) {
    var type = new Type({
        id: req.body.id,
        name: req.body.name,
        category: req.body.category
    })
    type.save(function (err, type) {
        if (err) {
            return next(err)
        }
        res.status(201).json(type)
    })
})



app.post('/api/user', function (req, res, next) {
    var name = req.body.username
    var password = req.body.password
    User.find({}, function (err, data) {
        if (err) {
            return next(err)
        }
        var userdata = findUsername(data, name)
        if (!userdata) {
            console.log("couldnt find user name")
            var token = jwt.encode({
                username: name
            }, secretKey)

            var user = new User({
                username: req.body.username,
                password: req.body.password,
                phonenumber: req.body.phonenumber
            })
            user.save(function (err, data) {
                if (err) {
                    return next(err)
                }
                console.log(data)
                res.status(201).json(token)
            })
        } else res.send("already registered")
    })

})


function findUsername(users, user) {
    return _.find(users, {
        "username": user
    })
}

function validUser(user, password) {
    return user.password === password
}

app.get('/api/user', function (req, res, next) {
    var token = req.headers['x-auth']
    var user = jwt.decode(token, secretKey)

    res.json(user)

})




app.listen(3000, function () {
    console.log('server listening on', 3000)
})
