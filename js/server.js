var utilities = require('./utilities.js');
var serverHandle = require('./handlingRequest.js');
var udp = require('dgram');

//Set global variables
var port;
var myIp = utilities.getLocalIp();
var ipScheme = utilities.getIpScheme(myIp);
var server;
var exports = module.exports = {};

//Init funtion
exports.init = function(portParam) {
  port = portParam;
  //Create server
  server = udp.createSocket('udp4');

  //handles error
  server.on('error', function(error) {
    console.log('Error : ' + error);
    server.close();
  });

  //handles messages and then pass it to the Handler (aka handlingRequest.js)
  server.on('message', function(msg, info) {
    console.log('Received : ' + msg.toString() + ' from : ' + info.address);
    serverHandle.handle(msg.toString(),info.address);
  });

  //When server is ready
  server.on('listening', function() {
    var address = server.address();
    var port = address.port;
    var ipaddr = address.address;
    console.log('Server ip is ' + myIp + ' and listening port is ' + port);
  });

  //When it receive close event
  server.on('close', function() {
    console.log('Socket is closed !');
  });

  //Last config, bind server to a port and initiate the serverHandle (handlingRequest.js)
  server.bind(port);
  serverHandle.init(server, port);
  this.scanIps();
}

//Sends a packet to the whole network "knocking" on port 2222
exports.scanIps = function() {
  if (ipScheme == undefined) {
    console.log("Ip Scheme undefined");
    return;
  }

  //Test the 255 possibilities of Ip Scheme (Ex: 192.168.0.x)
  for (i = 0; i < 255; i++) {
    var temp = ipScheme + i;
    var objSent = {};
    objSent.backend = "init_knocking";
    var finalMsg = JSON.stringify(objSent);
    server.send(finalMsg, port, temp, function(error) {
      if (error) {
        console.log(error);
        client.close();
      }
    });
  }
}

//Function to send messages to everybody
exports.broadcast = function(msg){
  var obj = {};
  obj.sender = myIp;
  obj.msg = msg;
  var finalMsg = JSON.stringify(obj);
  var ips = serverHandle.getIps();
  for (i = 0; i < ips.length - 1; i++){
    server.send(finalMsg, port, ips[i]);
  }
}
