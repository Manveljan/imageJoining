var fs = require('fs')
var Canvas = require('canvas')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]
var Promise = require('bluebird')

function imageJoin (params) {
  var img = new Canvas.Image
  var canvas = new Canvas(params[0].fileWidth, params[0].fileHeight)
  var ctx = canvas.getContext('2d')

  return Promise.map(params, function (item) {
    img.src = __dirname + '/../' + config.uploadPath + item.path
    ctx.drawImage(img, item.coords[0], item.coords[1], item.width , item.height)
    var stream = canvas.pngStream()
    return writeImageToDisk(stream, item.fileName)
  })
}

function writeImageToDisk (stream, fileName) {
  var out = fs.createWriteStream(__dirname + '/../' + config.uploadPath + fileName)
  return new Promise(function (resolve, reject) {
    stream.on('data', function (add) {
      out.write(add)
    })
    stream.on('end', function () {
      return resolve(true)
    })
    stream.on('error', function () {
      return reject(false)
    })
  })
}

module.exports = {
  imageJoin: imageJoin

}
