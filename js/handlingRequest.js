//Set global variables
var exports = module.exports = {};
var events = require('events');
var server;
var port;
var ips = [];
var alias;
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
    obj.addr = addr;
    obj.name = this.getAliasFromIp(addr);
    climber.emit('incoming_msg', obj);
  }
  if(obj.backend !== undefined){
    switch(obj.backend){
      case "init_knocking":
          //When a computer "knocks" on the server port
          console.log(addr + " Knocked");
          var tempIp = {};
          tempIp.addr = addr;
          tempIp.name = obj.alias;
          ips[ips.length] = tempIp;
          var objSent = {};
          objSent.backend = "knocking_accepted";
          objSent.alias = alias;
          var finalMsg = JSON.stringify(objSent);
          server.send(finalMsg,2222,addr);
          break;
      case "knocking_accepted":
          //Add a knocking computer to the ip list
          var tempIp = {};
          tempIp.addr = addr;
          tempIp.name = obj.alias;
          ips[ips.length] = tempIp;
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

exports.getAlias = function(){
  return alias;
}

exports.setAlias = function(name){
    alias = name;
}

exports.getAliasFromIp = function(ip){
  for(i = 0; i < ips.length; i++){
    if(ips[i].addr == ip){
      return ips[i].name;
    }
  }
}
