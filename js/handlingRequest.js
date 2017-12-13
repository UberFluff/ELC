//Set global variables
var exports = module.exports = {};
var events = require('events');
var server;
var port;
var ips = [];
var climber = new events.EventEmitter();

//Set server var to be the udp4 server from server.js and get the port
exports.init = function(serverParam, portParam) {
  try {
    server = serverParam;
    port = portParam;
  } catch (err) {
    console.log(err);
  }
}

//export the EventEmitter so handlingRequest.js can communicate with main.js
exports.climber = climber;

//handles the messages
exports.handle = function(msg, addr) {
  if(server == undefined){
    console.log("Server is undefined");
    return;
  }

  //Parse the string msg into an object
  var obj = JSON.parse(msg);

  if(obj.msg !== undefined){
    //sends the message to main.js so it can be sent to the BrowserWindow using ipc
    climber.emit('incoming_msg', obj);
  }
  if(obj.backend !== undefined){
    switch(obj.backend){
      case "init_knocking":
          //When a computer "knocks" on the server port
          console.log(addr + " Knocked");
          ips[ips.length] = addr;
          var objSent = {};
          objSent.backend = "knocking_accepted";
          var finalMsg = JSON.stringify(objSent);
          server.send(finalMsg,2222,addr);
          break;
      case "knocking_accepted":
          //Add a knocking computer to the ip list
          ips[ips.length] = addr;
          console.log("added " + addr + " to the ip list");
          break;
      case "test":
          //Just for me
          console.log(this.getIps());
          break;
    }
  }
}

exports.getIps = function(){
  return ips;
}
