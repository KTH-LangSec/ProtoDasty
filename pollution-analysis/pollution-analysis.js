// DO NOT INSTRUMENT
const { isTaintProxy, isProtoTaintProxy, isPropertyTaintProxy, checkSubFolderImport, unwrapDeep, taintCompResult, iidToLocation, overlapFunctionPackage, checkTaintedArgs } = require("./utils");
const { createTaintVal, createCodeFlow, allTaintValues, getTypeOf, checkForInKey } = require("./taintProxies/taint-val");
const { TAINT_TYPE } = require("./taintProxies/taint-val");
const { DONT_UNWRAP, DEFAULT_UNWRAP_DEPTH, EXCLUDE_INJECTION } = require("./conf/analysis-conf");
const { emulateNodeJs, emulateBuiltin } = require("./native");
const fs = require("fs");

class PollutionAnalysis {

    constructor(pkgName, jsonPkgName, pkgDir, executionDoneCallback) {
        this.pkgName = pkgName;
        this.jsonPkgName = jsonPkgName;
        this.pkgDir = pkgDir;
        this.executionDoneCallback = executionDoneCallback;
        this.uncaughtErr = null;
    }

    write = (iid, name, val, lhs, isGlobal, isScriptLocal, functionScope) => {
    };
    
    read = (iid, name, val, isGlobal, isScriptLocal, functionScope) => {
    };

    _return = (iid, val) => {
    };
    
    // TODO review this code
    unary = (iid, op, left, result) => {
        // change typeof of tainted object to circumvent type checks
        if (!isTaintProxy(left) && !isProtoTaintProxy(left) && !isPropertyTaintProxy(left)) return;
        switch (op) {
            case 'typeof':
                /* if we don't know the type yet return the proxy object and an information that it is the result of typeof
                this is used further up in the comparison to assign the correct type */
                const cf = createCodeFlow(iid, 'unary', 'typeof');
                left.__x_addCodeFlow(iid, 'unary', 'typeof', left.__x_type)
                return {result: left.__x_type};
            case '!':
                // return new taint with 'reversed' value
                return {result: !left.__x_val};
        }
    }

    // TODO review this code
    conditional = (iid, input, result, isValue) => {
        if (!isTaintProxy(input) && !isProtoTaintProxy(input) && !isPropertyTaintProxy(input)) return;

        // if it is a taint proxy and the underlying value is undefined result to false
        // addAndWriteBranchedOn(input.__x_taint.source.prop, iid, input.__x_val, this.branchedOn, this.branchedOnFilename);
        const res = typeof input.__x_val === 'object' ? {} : input.__x_val; // don't store full object in code-flow -  can lead to structured clone and other problems
        input.__x_addCodeFlow(iid, 'conditional', '-', {result: res});

        return {result: !!input.__x_val};
    }
    
    // TODO review this code
    binaryPre = (iid, op, left, right) => {
    }

    // TODO review this code
    binary = (iid, op, left, right, result, isLogic) => {
        // ToDo - handle notUndefinedOr (default value for object deconstruction e.g. {prop = []})
        // console.log("Binary", left, `(${isProtoTaintProxy(left)})`, op, right, `(${isProtoTaintProxy(right)})`, "=", result);
        if (!isTaintProxy(left) && !isTaintProxy(right)
         && !isProtoTaintProxy(left) && !isProtoTaintProxy(right)
         && !isPropertyTaintProxy(left) && !isPropertyTaintProxy(right)) return;

        switch (op) {
            case '===':
            case '==':
                // note that there are no '!== and !=' they are represented as e.g. !(x === y) in GraalJS and trigger the unary hook
                let compRes = taintCompResult(left, right, op);
                const taintVal = isTaintProxy(left) || isProtoTaintProxy(left) ? left : right;
                
                taintVal.__x_addCodeFlow(iid, 'conditional', op, {result: compRes});

                return {result: compRes};
                
            case '&&':
                if (!isTaintProxy(left) && !isProtoTaintProxy(left) && !isPropertyTaintProxy(left)) break;

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
                    if (isTaintProxy(result) || isProtoTaintProxy(result) || isPropertyTaintProxy(result)) {
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
        // we need to check if the function is returned, or just a sample of the object??????
        if ((typeof base == 'function' || typeof base == 'object') && base.__x_toTaint) {
            val.__x_toTaint = true;
        }
        if (isTaintProxy(offset) && !isProtoTaintProxy(base) && !isPropertyTaintProxy(base)) {
            try {
                const cf = createCodeFlow(iid, 'propertyReadName', offset.__x_val);

                // need to check if the base is tainted
                const ret =  isTaintProxy(base) 
                        ? offset.__x_copyTaint(base.__x_val[offset.__x_val], cf, getTypeOf(val), TAINT_TYPE.PROTO)
                        : offset.__x_copyTaint(base[offset.__x_val], cf, getTypeOf(val), TAINT_TYPE.PROTO);
                return {result: ret};
            } catch (e) {
                throw e;
            }
        } else if (isProtoTaintProxy(base) && isTaintProxy(offset)) {
            try {
                const cf = createCodeFlow(iid, 'propertyReadName', offset.__x_val);
                const ret = offset.__x_copyTaint(base.__x_val[offset.__x_val], cf, getTypeOf(val), TAINT_TYPE.PROPERTY);
                return {result: ret};
            } catch (e) {
                throw e;                
            }
        }
    };

    invokeFunStart = (iid, f, receiver, index, isConstructor, isAsync, functionScope, imports) => {
        if (f?.__x_wrapped) return;
        if (isTaintProxy(f) || isProtoTaintProxy(f) || isPropertyTaintProxy(f)) return;
        // TODO dynamically check if the function is part of the exported functions
        // TODO implement readFile?
        if (!functionScope?.startsWith("node:")) {

            if (f?.name == 'entryPoint' || f?.__x_toTaint || receiver?.__x_toTaint) {
            // if (f?.__x_toTaint || receiver?.__x_toTaint) {
                console.log("Polluted", f.name);
                
                const internalWrapperTaints = function (...args) {
                    args?.forEach((arg, index) => {
                        if (!arg) return;
                        if (isTaintProxy(arg) || isProtoTaintProxy(arg) || isPropertyTaintProxy(arg)) {
                            args[index] = arg;
                        } else {
                            const newArg = createTaintVal(
                                iid,
                                `argument_${index}`,
                                {iid: iid, entryPoint: []},
                                arg,
                                typeof arg
                            );
                            args[index] = newArg;
                        }
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
                internalWrapperTaints.__x_fName = f.name;
                internalWrapperTaints.__x_wrapped = true;
                
                return { result: internalWrapperTaints};
            }
        }
        // TODO check where this is needed
        // if (f?.name == 'call') {
        //     if (receiver.name == 'relative') {
        //         const relativeCallWrapper = function (...args) {

        //             if (!args[1]?.__x_val && !args[2]?.__x_val) return;
                    
        //             const safeArg1 = args[1].__x_val ?? args[1];
        //             const safeArg2 = args[2].__x_val ?? args[2];
                    
        //             const cf = createCodeFlow(iid, 'relativePath', 'Path.relative');
                    
        //             return args[1].__x_val
        //             ? args[1].__x_copyTaint(args[0].relative(safeArg1, safeArg2), cf, 'string')
        //             : args[2].__x_copyTaint(args[0].relative(safeArg1, safeArg2), cf, 'string');
        //         }
        //         return {result: relativeCallWrapper};
        //     }
        // }
    };

    invokeFunPre = (iid, f, base, args, isConstructor, isMethod, functionScope, proxy, originalFun) => {
    };
    
    invokeFun = (iid, f, base, args, res, isConstructor, isMethod, functionScope, functionIid, functionSid) => {
        // emulate taint propagation for builtins
        if (functionScope
        && !(isTaintProxy(f) || isProtoTaintProxy(f) || isPropertyTaintProxy(f))) {
            let taintedResult = null;
            if (functionScope === '<builtin>') {
                taintedResult = emulateBuiltin(iid, res, base, f, args);
            } else if (functionScope.startsWith('node:')) {
                taintedResult = emulateNodeJs(functionScope, iid, res, base, f, args);
            }
    
            if (taintedResult !== null) {
                return {result: taintedResult};
            }
        }

        if (f.name == 'call' && checkTaintedArgs(args)) {
            // TODO automate this so that the function is called automatically
            if (base.name == 'toString' && args[0]) {
                return {result: args[0].toString()};
            } else if (base.name == 'hasOwnProperty') {
                console.log("hasOwnProperty", args[0].__x_val, "!", args[1].__x_val)
                const ret = args[1].__x_taint ? args[0].hasOwnProperty(args[1].__x_val) : args[0].hasOwnProperty(args[1]);
                return {result: ret};
            } else if (base.name == 'relative') {
                return {result: args[0].relative(args[1].__x_val, args[2].__x_val)};
            }
        }

        if (f.name == 'require') {
            // ToDo: verify how to check if it really belongs to the package being analysed
            // if ((overlapFunctionPackage(args[0], this.pkgName) || args[0] == this.jsonPkgName) &&
            if (checkSubFolderImport(this.jsonPkgName, args[0]) &&
            (typeof res === 'function' || typeof res === 'object')) {
                console.log("\tFunction: ", f.name, args);
                res.__x_toTaint = true;
            }
        }
    };
    
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
