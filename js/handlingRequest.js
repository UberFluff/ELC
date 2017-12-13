//Set global variables
var exports = module.exports = {};
var server;
var ips = [];
//Set server var to be the udp4 server from server.js
exports.init = function(serverParam) {
  try {
    server = serverParam;
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

  switch(msg){
      case "init_knocking":
          //When a computer "knocks" on the server port
          console.log("knocking initiated");
          ips[ips.length] = addr;
          server.send("knocking_accepted",2222,addr);
          break;
      case "knocking_accepted":
          ips[ips.length] = addr;
          console.log("added " + addr + " to the ip list");
          break;
      case "test":
          console.log(this.getIps());
          break;
  }
}

exports.getIps = function(){
  return ips;
}
