var os = require('os');
var ifaces = os.networkInterfaces();

//Set global variables
var exports = module.exports = {};

//Get the first internet interface local IP
exports.getLocalIp = function(){
    var name = Object.keys(ifaces)[0];
    return ifaces[name][1].address;
}

//As the name says get the Ip scheme (ex: 192.168.0.x)
exports.getIpScheme = function(ip){
  var arr = ip.split(".");
  return arr[0] + "." + arr[1] + "." + arr[2] + ".";
}
