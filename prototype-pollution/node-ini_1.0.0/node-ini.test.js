//https://security.snyk.io/vuln/SNYK-JS-NODEINI-1054844
 
  const ini = require("node-ini");

   

  ini.parse("./payload.ini", function (err, data) {
     
  });
// End of file
