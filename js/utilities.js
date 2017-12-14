var os = require('os');
var ifaces = os.networkInterfaces();

//Set global variables
var exports = module.exports = {};

//Get the first internet interface local IP
exports.getLocalIp = function(callback){
    let ip;
    Object.keys(ifaces).forEach(function(key){
      for(i = 0; i < ifaces[key].length; i++){
        if(ifaces[key][i].address.substr(0,8) == "192.168."){
          ip = ifaces[key][i].address;
        }
      }
    });
    callback(ip);
}

//As the name says get the Ip scheme (ex: 192.168.0.x)
exports.getIpScheme = function(ip){
  var arr = ip.split(".");
  return arr[0] + "." + arr[1] + "." + arr[2] + ".";
}
