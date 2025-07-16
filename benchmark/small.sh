#!/bin/bash

native="node /home/mateus/Dasty/examples/ex-1.js"
graal="$GRAAL_NODE /home/mateus/Dasty/examples/ex-1.js"
nodeprof="$GRAAL_NODE --engine.WarnInterpreterOnly=false --jvm --experimental-options --vm.Dtruffle.class.path.append=$NODEPROF_HOME/build/nodeprof.jar --nodeprof.Scope=module --nodeprof.IgnoreJalangiException=false --nodeprof --nodeprof.ExcludeSource=node_modules/istanbul-lib-instrument/,node_modules/mocha/,node_module/.bin/,node_modules/nyc,node_modules/jest,node_modules/@jest,node_modules/@babel,node_modules/babel,node_modules/grunt,typescript,ts-node,tslib,tsutils,eslint,Gruntfile.js,jest,.node $NODEPROF_HOME/src/ch.usi.inf.nodeprof/js/jalangi.js --analysis $THE_TOOL_HOME/taint-analysis/benchmark.js --exec-path $THE_TOOL_HOME/pipeline/node-wrapper/node /home/mateus/Dasty/examples/ex-1.js"
analysis="$GRAAL_NODE --engine.WarnInterpreterOnly=false --jvm --experimental-options --vm.Dtruffle.class.path.append=$NODEPROF_HOME/build/nodeprof.jar --nodeprof.Scope=module --nodeprof.IgnoreJalangiException=false --nodeprof --nodeprof.ExcludeSource=node_modules/istanbul-lib-instrument/,node_modules/mocha/,node_module/.bin/,node_modules/nyc,node_modules/jest,node_modules/@jest,node_modules/@babel,node_modules/babel,node_modules/grunt,typescript,ts-node,tslib,tsutils,eslint,Gruntfile.js,jest,.node $NODEPROF_HOME/src/ch.usi.inf.nodeprof/js/jalangi.js --analysis $THE_TOOL_HOME/pollution-analysis/ --exec-path $THE_TOOL_HOME/pipeline/node-wrapper/node --initParam pkgName:express --initParam writeOnDetect:true --initParam recordAllFunCalls:false /home/mateus/Dasty/examples/ex-1.js"

# Execute 'npm test' and measure the runtime
runtime_native=$((time -p $native >/dev/null) |& grep real | awk '{print $2}')
runtime_graal=$((time -p $graal >/dev/null) |& grep real | awk '{print $2}')
runtime_nodeprof=$((time -p $nodeprof >/dev/null) |& grep real | awk '{print $2}')
runtime_analysis=$((time -p $analysis >/dev/null) |& grep real | awk '{print $2}')

# Output the runtime
echo "Runtime small.js:"
echo "Native: $runtime_native"
echo "Graal: $runtime_graal"
echo "NodeProf: $runtime_nodeprof"
echo "Analysis: $runtime_analysis"
