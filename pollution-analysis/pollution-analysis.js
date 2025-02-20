// DO NOT INSTRUMENT
const { isTaintProxy, isProtoTaintProxy, isPropertyTaintProxy, checkTaints, unwrapDeep, taintCompResult } = require("./utils");
const { createTaintVal, createCodeFlow, allTaintValues, getTypeOf } = require("./taintProxies/taint-val");
const { TAINT_TYPE } = require("./taintProxies/taint-val");
const { DONT_UNWRAP, DEFAULT_UNWRAP_DEPTH } = require("./conf/analysis-conf");
const { emulateNodeJs, emulateBuiltin } = require("./native");

class PollutionAnalysis {

    constructor(pkgName, executionDoneCallback) {
        this.pkgName = pkgName;
        this.executionDoneCallback = executionDoneCallback;
        this.uncaughtErr = null;
    }

    write = (iid, name, val, lhs, isGlobal, isScriptLocal, functionScope) => {
        // console.log("DEBUG - write", name, val, lhs);
    };

    // TODO review this code
    binaryEnter = (iid, op) => {
        if (op === '||' || op === '??') {
        }
    }

    // TODO review this code
    binary = (iid, op, left, right, result, isLogic) => {
        // ToDo - handle notUndefinedOr (default value for object deconstruction e.g. {prop = []})
        if (!isTaintProxy(left) && !isTaintProxy(right)) return;

        switch (op) {
            case '===':
            case '==':
                // note that there are no '!== and !=' they are represented as e.g. !(x === y) in GraalJS and trigger the unary hook
                let compRes = taintCompResult(left, right, op);
                const taintVal = isTaintProxy(left) ? left : right;

                taintVal.__x_addCodeFlow(iid, 'conditional', op, {result: compRes});

                const cf = createCodeFlow(iid, 'compRes', op);
                return {result: taintVal.__x_copyTaint(compRes, cf, 'boolean')};

            case '&&':
                if (!isTaintProxy(left)) break;

                // if left is undefined return false
                if (!left.__x_val) {
                    // if (!this.forceBranches) {
                    // addAndWriteBranchedOn(left.__x_taint.source.prop, iid, false, this.branchedOn, this.branchedOnFilename);
                    left.__x_addCodeFlow(iid, 'binary', '&&', {result: false});

                    const cf = createCodeFlow(iid, 'binary', op);
                    return {result: left.__x_copyTaint(false, cf, 'boolean')};
                } else {
                    // if left is not falsy wrap result
                    let taintVal;
                    const cf = createCodeFlow(iid, 'binary', op);
                    if (isTaintProxy(result)) {
                        taintVal = result;
                        taintVal.__x_taint.codeFlow.push(cf);
                    } else {
                        taintVal = left.__x_copyTaint(result, cf, getTypeOf(result));
                    }

                    return {result: taintVal};
                }
            case '+':
                // Todo - look into string Template Literals (it works but the other side is always '')
                const res = left?.__x_taint ? left.__x_add(iid, right, result, true) : right.__x_add(iid, left, result, false);
                return {result: res};
        }
    }

    putField = (iid, base, offset, val, isComputed, isOpAssign) => {
        if (isProtoTaintProxy(base) && isTaintProxy(val) && isTaintProxy(offset)) {
            // TODO - Write prototype pollution
            console.log("\n-------------------------------------\n   !! Found Prototype Pollution !!\n-------------------------------------\n");
        } else if (isPropertyTaintProxy(base) && isTaintProxy(val)) {
            // TODO - Write prototype pollution
            console.log("\n-------------------------------------------------\n   !! Found Prototype Pollution Constructor !!\n-------------------------------------------------\n");
        }
    }

    getField = (iid, base, offset, val, isComputed, scope) => {
        if (isTaintProxy(offset) && !isProtoTaintProxy(base) && !isPropertyTaintProxy(base)) {
            try {
                const cf = createCodeFlow(iid, 'propertyReadName', offset.__x_val);
                const ret = offset.__x_copyTaint(base[offset.__x_val], cf, getTypeOf(val), TAINT_TYPE.PROTO);
                return {result: ret};
            } catch (e) {
                throw e;
            }
        } else if (isProtoTaintProxy(base) && isTaintProxy(offset)) {
            try {
                const cf = createCodeFlow(iid, 'propertyReadName', offset.__x_val);
                const ret = offset.__x_copyTaint(base[offset.__x_val], cf, getTypeOf(val), TAINT_TYPE.PROPERTY);
                return {result: ret};
            } catch (e) {
                throw e;                
            }
        }
    };

    invokeFunStart = (iid, f, receiver, index, isConstructor, isAsync, functionScope) => {
        if (!functionScope?.startsWith("node:")) {
            // TODO dynamically check if the function is part of the exported functions
            if (f?.name === 'setDeepProperty') {
                const internalWrapperTaints = function (...args) {
                    args?.forEach((arg, index) => {
                        if (!arg) return;
                        const newArg = createTaintVal(
                            iid,
                            `argument_${index}`,
                            {iid: iid, entryPoint: []},
                            arg,
                            typeof arg
                        );
                        
                        args[index] = newArg;
                    });

                    try {
                        const result = !isConstructor
                        ? Reflect.apply(f, receiver, args)
                        : Reflect.construct(f, args);
                        
                        return result;
                    } catch (e) {
                        throw e;
                    }
                };
                
                return { result: internalWrapperTaints};
            }
        } else {
            const internalWrapper = function (...args) {
                const unwrappedArgs = args.map((a, index) => {
                    let taintedInputs = false;
                    if (isTaintProxy(a) || isProtoTaintProxy(a) || isPropertyTaintProxy(a)) {
                        taintedInputs = true;
                    }
                    return taintedInputs ? unwrapDeep(a) : a;
                });
                try {
                    const result = !isConstructor
                    ? Reflect.apply(f, receiver, unwrappedArgs)
                    : Reflect.construct(f, unwrappedArgs);

                    // emulate the taint propagation (only if tainted)
                    // const emulatedResult = taints.length > 0 ? emulateNodeJs(functionScope, iid, result, receiver, f, args) : null;
                    return result;
                } catch (e) {
                    throw e;
                }
            }
            return {result: internalWrapper};
        }
    };

    invokeFunPre = (iid, f, base, args, isConstructor, isMethod, functionScope, proxy, originalFun) => {
    };

    invokeFun = (iid, f, base, args, result, isConstructor, isMethod, functionScope, functionIid, functionSid) => {
        // TODO: check why isArray is not working as expected
        if (f.name == 'isArray' && getTypeOf(args) === 'array' && result === false) {
            if (isTaintProxy(args[0]) || isProtoTaintProxy(args[0]) || isPropertyTaintProxy(args[0])) {
                if (args[0].__x_type === 'array') {
                    return {result: true};
                }
            }
        }
    };

    read = (iid, name, val, isGlobal, isScriptLocal, functionScope) => {
    };

    // TODO review this code
    unary = (iid, op, left, result) => {
        // change typeof of tainted object to circumvent type checks
        if (!isTaintProxy(left)) return;

        switch (op) {
            case 'typeof':
                /* if we don't know the type yet return the proxy object and an information that it is the result of typeof
                 this is used further up in the comparison to assign the correct type */
                const cf = createCodeFlow(iid, 'unary', 'typeof');
                let tpe = left.__x_copyTaint(left.__x_typeof(), cf, 'string');
                return {result: tpe};
            case '!':
                // return new taint with 'reversed' value
                let res = left.__x_copyTaint(!left.__x_val, createCodeFlow(iid, 'unary', '!'), 'boolean');
                return {result: res};
        }
    }

    // TODO review this code
    conditional = (iid, input, result, isValue) => {
        if (!isTaintProxy(input)) return;

        // if it is a taint proxy and the underlying value is undefined result to false
        // addAndWriteBranchedOn(input.__x_taint.source.prop, iid, input.__x_val, this.branchedOn, this.branchedOnFilename);
        const res = typeof input.__x_val === 'object' ? {} : input.__x_val; // don't store full object in code-flow -  can lead to structured clone and other problems
        input.__x_addCodeFlow(iid, 'conditional', '-', {result: res});

        return {result: !!input.__x_val};
    }
    
    uncaughtException = (err, origin) => {
        if (this.executionDone) {
            this.executionDone(err);
            this.executionDone = null;
        }
    };

    endExecution = (code) => {
        if (this.executionDoneCallback) {
            this.executionDoneCallback(this.uncaughtErr);
        }
    };
}

module.exports = PollutionAnalysis;