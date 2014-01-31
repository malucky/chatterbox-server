var successCode = 200;
var url = require("url");
var fs = require("fs");
var createCode = 201;
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, x-parse-application-id, x-parse-rest-api-key",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
};
var StringDecoder = require('string_decoder').StringDecoder;

var decoder = new StringDecoder('utf8');

var handleRequest = function(request, response) {
  var path = url.parse(request.url).pathname;
  
  var respond = function(response, statusCode, data) {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  };

  var route = function() {
    //GET requests
    if (request.method === "OPTIONS") {
      respond(response, successCode, null);
    } else if (request.method === "POST") {
      postMessage();
    } else if (request.method === "GET") {
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

  var collectData = function(request, cb, messages) {
    var collected = "";
    request.on("data", function(data) {
      collected += data;
    });
    request.on("end", function(){
      var message = JSON.parse(collected);
      message['createdAt'] = Date.now();
      messages.results.unshift(message);
      //console.log(JSON.stringify(messages));
      cb(JSON.stringify(messages));
    });
  };
  var writeToFile = function(messages) {
    fs.writeFile(__dirname + "/data.txt", messages, function(err){
      if (err) throw err;
    });
  };

  var postMessage = function() {
    fs.readFile(__dirname + "/data.txt", function(err, data){
      if (err) throw err;
      if (decoder.write(data)) {
        var messages = JSON.parse(decoder.write(data));
      } else {
        var messages = {results: []};
      }
      collectData(request, writeToFile, messages);
      respond(response, 201,"posted");
    });
  };

  route();
};

module.exports = handleRequest;