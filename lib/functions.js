var fs = require('fs')
var Canvas = require('canvas')
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../config/config.json')[env]
var Promise = require('bluebird')

/*
 * draw  and save images into a png stream
*/

function drawedImagesStream (params) {
  var img = new Canvas.Image
  var canvas = new Canvas(params[0].fileWidth, params[0].fileHeight)
  var ctx = canvas.getContext('2d')

  return Promise.map(params, function (item) {
    img.src = __dirname + '/../' + config.uploadPath + item.path
    ctx.drawImage(img, item.coords[0], item.coords[1], item.width , item.height)
    var stream = canvas.pngStream()
    return {stream, fileName: item.fileName}
  })
}

/*
 *  write an joined images into a file
*/

function writeImageToDisk (data) {
  var out = fs.createWriteStream(__dirname + '/../' + config.uploadPath + data.fileName)
  return new Promise(function (resolve, reject) {
    data.stream.on('data', function (add) {
      out.write(add)
    })
    data.stream.on('end', function () {
      return resolve(true)
    })
    data.stream.on('error', function () {
      return reject(false)
    })
  })
}

module.exports = {
  drawedImagesStream: drawedImagesStream,
  writeImageToDisk: writeImageToDisk

}
