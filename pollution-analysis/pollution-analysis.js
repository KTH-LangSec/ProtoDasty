// DO NOT INSTRUMENT

class PollutionAnalysis {
    builtinDependencies = [];

    constructor(pkgName, executionDoneCallback) {
        this.pkgName = pkgName;
        this.executionDoneCallback = executionDoneCallback;
        this.uncaughtErr = null;
    }

    write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
        // TODO - propagate taints here
        console.error('\nDEBUG - write');
        console.error('\tName: ', name);
        console.error('\tValue: ', val);
        console.error('\tLHS: ', lhs);
        // if (val?.__taint) {
        //     val.__addCodeFlow(iid, 'write', name);
        // }
    };

    uncaughtException = (err, origin) => {
        if (this.executionDone) {
            this.executionDone(err);
            this.executionDone = null;
        }
    }

    endExecution = (code) => {
        if (this.executionDoneCallback) {
            this.executionDoneCallback(this.uncaughtErr);
        }
    }
}

module.exports = PollutionAnalysis;