//Set global variables
var exports = module.exports = {};
var server;
var port;
var ips = [];

//Set server var to be the udp4 server from server.js and get the port
exports.init = function(serverParam, portParam) {
  try {
    server = serverParam;
    port = portParam;
  } catch (err) {
    console.log(err);
  }
}

//handles the messages
exports.handle = function(msg, addr) {
  if(server == undefined){
    console.log("Server is undefined");
    return;
  }

  var obj = JSON.parse(msg);

  if(obj.msg !== undefined){
    console.log(obj.msg);
  }
  if(obj.backend !== undefined){
    switch(obj.backend){
      case "init_knocking":
          //When a computer "knocks" on the server port
          console.log("knocking initiated");
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
