var http = require('http')
var zlib = require('zlib')
http.createServer(function(request, response) {
  var i = 1024
  var data = ''

  while (i--) {
    data += '.'
  }

  if ((request.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
    zlib.gzip(data, function(err, data) {
      response.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Encoding': 'gzip'
      })
      response.end(data)
    })
  } else {
    response.writeHead(200, {
      'Content-Type': 'text/plain'
    })
    response.end(data)
  }
}).listen(80)

var options = {
  hostname: 'http://localhost/',
  port: 80,
  path: '/',
  method: 'GET',
  headers: {
    'Accept-Encoding': 'gzip, deflate'
  }
}

http.request(options, function(response) {
  var body = []

  response.on('data', function(chunk) {
    body.push(chunk)
  })

  response.on('end', function() {
    body = Buffer.concat(body)

    if (response.headers['content-encoding'] === 'gzip') {
      zlib.gunzip(body, function(err, data) {
        console.log(data.toString())
      })
    } else {
      console.log(data.toString())
    }
  })
}).end()
