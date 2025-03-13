//https://snyk.io/vuln/SNYK-JS-MULTIINI-1048969
 
  const ini = require("multi-ini");
  const path = require("path");

   

  ini.read(path.resolve(__dirname, "./payload.toml"), { encoding: "utf8" });
// End of file
