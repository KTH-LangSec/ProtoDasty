//https://snyk.io/vuln/SNYK-JS-IONPARSER-1048971
 
  const fs = require("fs");
  const path = require("path");
  const ION = require("ion-parser");

  let obj = {};
   

  ION.parse(
    fs.readFileSync(path.resolve(__dirname, "./payload.toml"), "utf-8")
  );
// End of file
