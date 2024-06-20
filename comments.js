// Create web server
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var qs = require('querystring');
var comments = [];

http.createServer(function (req, res) {
  // Parse the request containing file name
  var pathname = url.parse(req.url).pathname;
  // Print the name of the file for which request is made.
  console.log('Request for ' + pathname + ' received.');
  // Read the requested file content from file system
  if (pathname === '/index.html') {
    fs.readFile(path.join(__dirname, pathname), function (err, data) {
      if (err) {
        console.error(err);
        res.writeHead(404, { 'Content-Type': 'text/html' });
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data.toString());
      }
      res.end();
    });
  } else if (pathname === '/comments') {
    if (req.method === 'POST') {
      var postData = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) {
        postData += chunk;
      });
      req.on('end', function () {
        var comment = qs.parse(postData);
        comments.push(comment);
        res.end('Success');
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(comments));
      res.end();
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end();
  }
}).listen(8081);
// Console will print the message
console.log('Server running at http://')