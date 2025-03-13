//https://www.whitesourcesoftware.com/vulnerability-database/CVE-2021-25946

 
   

  const nt = require("nconf-toml");
  const fs = require("fs");
  const path = require("path");

  nt.parse(fs.readFileSync(path.resolve(__dirname, "./payload.toml"), "utf-8"));
// End of file
