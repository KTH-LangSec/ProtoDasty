//https://snyk.io/vuln/SNYK-JS-INIREADER-1054843
 
  const iniReader = require("inireader");
  const path = require("path");
  const parser = new iniReader.IniReader();

  let obj = {};
   

  parser.load(path.resolve(__dirname, "./payload.ini"));
// End of file
