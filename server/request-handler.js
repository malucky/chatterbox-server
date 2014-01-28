var url = require("url");
var qs = require("querystring");
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var messages = [];

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
    response.end( JSON.stringify({results: messages}) );
  };

  var postMessage = function() {
    response.writeHead(createCode, headers);
      request.on("data", function(data) {  
      var message = JSON.parse(decoder.write(data));
      message.createdAt = new Date;
      console.log('posting ', message);
      messages.push(message);
    });
    response.end( JSON.stringify(messages) );
  };

  route();
};

module.exports = handleRequest;