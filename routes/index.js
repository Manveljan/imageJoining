var express = require('express')
var router = express.Router()
var url = require('url')
var Promise = require('bluebird')
var lib = require('../lib/functions.js')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]

var params = [
  {path: 'img1.jpg', coords: [0, 0], width: 640, height: 360,  fileName: 'out.png', fileWidth: 640, fileHeight: 600},
  {path: 'img2.jpg', coords: [0, 360], width: 320,  height: 240, fileName: 'out.png', fileWidth: 640, fileHeight: 600},
  {path: 'img3.jpg', coords: [320, 360], width: 320, height: 240, fileName: 'out.png', fileWidth: 640, fileHeight: 600}
]

router.get('/', function (req, res) {
  return lib.imageJoin(params).then(function (result) {
    return res.json({status: result ? 'ok' : 'error'})
  })
})

module.exports = router
