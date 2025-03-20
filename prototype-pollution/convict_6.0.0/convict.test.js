//https://snyk.io/vuln/SNYK-JS-CONVICT-1062508
 
  const convict = require("convict");
  let obj = {};
  // TODO check if this should be propagated??
  const config = convict(obj);


  config.set("__proto__.polluted", "yes");
// End of file
