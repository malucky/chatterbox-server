var url = require("url");
var fs = require("fs");
var StringDecoder = require('string_decoder').StringDecoder;

var decoder = new StringDecoder('utf8');

var handleRequest = function(request, response) {
  var successCode = 200;
  var createCode = 201;
  var defaultCorsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept, x-parse-application-id, x-parse-rest-api-key",
    "access-control-max-age": 10, // Seconds.
    "Content-Type": "application/json"
  };
  var headers = defaultCorsHeaders;
  var path = url.parse(request.url).pathname;
  console.log(path);
  
  var route = function() {
    //GET requests
    if (request.method === "POST" || path === "/post") {
      postMessage();
    } else if (request.method === "GET" || path === "/get") {
      getMessages();
    }
  };

  var getMessages = function() {
    console.log('in getMessages');
    response.writeHead(successCode, headers); 
    fs.readFile(__dirname + "/data.txt", function(err, data){
      if (err) throw err;
      if (decoder.write(data)) {
        var messages = JSON.parse(decoder.write(data));
      }
      response.end(JSON.stringify(messages));
    });
  };

  var postMessage = function() {
    response.writeHead(createCode, headers);
    fs.readFile(__dirname + "/data.txt", function(err, data){
      if (err) throw err;
      if (decoder.write(data)) { 
        var messages = JSON.parse(decoder.write(data));
      } else {
        var messages = {results: []};
      }      
      request.on("data", function(data) {
        var message = JSON.parse(decoder.write(data));
        message.createdAt = new Date;
        messages.results.push(message);
        console.log(messages);
        fs.writeFile(__dirname + "/data.txt", JSON.stringify(messages), function(err) {
          if (err) throw err;
          console.log('finished writing')
        });
      });
      //console.log(messages);
      response.end(JSON.stringify(messages));
      // request.on("data", function(data) {  
      //   var message = JSON.parse(decoder.write(data));
      //   message.createdAt = new Date;
      //   messages.push(message);
      //   message = JSON.stringify(message);
      //   console.log('posting ', message);
      //   fs.writeFile(__dirname + '/data.txt', JSON.stringify(messages), function(err) {
      //     if (err) throw err;
      //     console.log('wrote');
      //   });
      // });
    });
  };

  route();
};

module.exports = handleRequest;