//https://snyk.io/vuln/SNYK-JS-INI-1048974
 
  const fs = require("fs");
  const path = require("path");
  const ini = require("ini");
  obj = {};

   

  ini.parse(fs.readFileSync(path.resolve(__dirname, "./payload.ini"), "utf-8"));
// End of file
