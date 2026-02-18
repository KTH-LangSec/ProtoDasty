# ProtoDasty: Multi‑label Dynamic Taint Analysis for Prototype Pollution Detection

ProtoDasty is a dynamic taint analysis tool designed to detect prototype pollution flows in Node.js packages. It extends the earlier Dasty tool with a multi‑label tainting model (Basic → Proto → Property) and focuses on identifying pollutable prototype‑access flows rather than prototype‑pollution gadgets. ProtoDasty is built on NodeProf atop the Truffle Instrumentation Framework and runs on GraalJS / GraalVM.
This repository accompanies my Master’s thesis: [PLACEHOLDER_THESIS_URL]. ProtoDasty integrates partially with Dasty’s pipeline (e.g., pre‑analysis, package setup) while introducing a new prototype‑pollution detection engine and an optional fuzzing‑based test‑case generator.

## Overview

ProtoDasty reports flows that could lead to prototype pollution. Unlike the original Dasty—which detects gadgets that become dangerous after a prototype is polluted—ProtoDasty identifies the pollution itself.

#### Sources
ProtoDasty treats all exported functions of a package as attacker‑controlled entry points. Every argument of an exported function is assigned a Basic Taint.

#### Multi‑Label Tainting Model
ProtoDasty tracks taints through program operations using a three‑tier taint system:

- **Basic Taint** — assigned to every function argument (attacker‑controlled).
- **Proto Taint** — created when an access is made through a tainted property that could reference a prototype (e.g., __proto__, constructor).
- **Property Taint** — created when accessing a property on a tainted prototype, or via constructor.prototype.

Internally, taints are implemented using JavaScript Proxy objects, intercepting traps such as:

- get (property access)
- set (writes)
- ownKeys (for `for ... in` loops)
- forEach (callbacks receive tainted values)

#### Sink Definition
A sink is any assignment that would write to a prototype given appropriate attacker‑controlled inputs. Examples:

- `base[offset] = val` where `base` has a Proto or Property Taint
- `base[offset] = object` when replacing a full object
- Access patterns such as `obj["__proto__"]`, `obj.constructor.prototype`, etc.

ProtoDasty does not require the prototype to actually be polluted in the current run - it flags potentially polluting flows.

#### Flow Storage

Each identified flow stores:

- **Source** (entry point + argument index)
- **Entry point context**
- **Code Flow** (sequence of operations taint passed through)
- **Sink** (write operation)

Flows are saved immediately as JSON and also persisted via a database layer for efficient verification.

### Analysis Modes
ProtoDasty supports two modes:

- **Fuzzing Mode**:
   - Pre-analysis → Fuzzing → Taint Analysis → Verification
   - Fuzzing uses a coverage‑guided fuzzer to generate diverse inputs.

- **Test‑Driven Mode**:
   - Direct taint analysis of user‑provided scripts
   - No fuzzing, ideal for curated tests or known vulnerable flows.


## Installation

ProtoDasty relies on NodeProf, GraalVM, and GraalJS. If your installation encounters issues, consult their documentation.
If you encounter any problems during the installation process please refer to their documentation.

### Prerequisites

- build-essential
- python3

### Install Node

The current implementation requires Node 18.12.1 installed via nvm and the `NVM_DIR` environment variable to be set. If
you want to use another installation, you need to adapt the path to the node executable
in [`node.py`](pipeline/node-wrapper/node.py), [`node`](pipeline/node-wrapper/node)
and [`npm`](pipeline/node-wrapper/npm).
However, we do not recommend to use a version other than 18.12.1.

#### 1. Install nvm

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
```

#### 2. Install Node.js 18.12.1

```bash
nvm install 18.12.1
```

### Install NodeProf

#### 1. Setup mx

```bash
git clone https://github.com/graalvm/mx.git
export PATH=/path/to/mx/:$PATH
```

#### 2. Install the GraalVM JDK

```bash
mx fetch-jdk --java-distribution labsjdk-ce-19
export JAVA_HOME=/path/to/labsjdk-ce-19-jvmci-23.0-b04
```

#### 3. Install [NodeProf](https://github.com/KTH-LangSec/nodeprof.js)

```bash
mkdir nodeprof-graalvm && cd nodeprof-graalvm
git clone https://github.com/KTH-LangSec/nodeprof.js.git
mx sforceimports
mx build
```

#### 4. Set environment variables

```bash
export GRAAL_NODE=/path/to/nodeprof-graalvm/graal/sdk/latest_graalvm_home/bin/node
export NODEPROF_HOME=/path/to/nodeprof-graalvm/nodeprof.js/
```

### Install ProtoDasty

#### 1. Setup

```bash
git clone https://github.com/KTH-LangSec/ProtoDasty.git
cd /path/to/proto_dasty
npm install
```

#### 2. Install MongoDB on your system.
You can follow the installation guide [here](https://www.mongodb.com/docs/manual/installation/#mongodb-installation-tutorials).

Configure [`pipeline/db/conn.js`](`pipeline/db/conn.js`)

## Usage

To analyze a package run the [`index.js`](pipeline/index.js) file in the `pipeline` directory.

### General usage

#### Running analysis

```bash
node index.js [flags] <pkgName>
node index.js --fromFile [flags] /path/to/packages-list
```

The results are stored in MongoDB.

#### Exporting results

```bash
node index.js --sarif [flags] [pkgName]
```

Depending on the flags an export can create up to four files per package/application:

1. `<name>.sarif` contains the found flows
2. `<name>-exceptions.sarif` contains potential pollutions that might have caused an exception/crash.
3. `<name>-all-taints` contains all sources and code flows independent of them reaching a sink or not. These are only
   recorded in the *unintrusive* run.
4. `<name>-branched-on` contains all sources that flowed into a conditional.

### Example usage

Analyze specific package:

```bash
node index.js express
```

Analyze a list of packages and skip already analyzed ones
(stored in pipeline/package-data/already-analyzed.txt):

```bash
node index.js --fromFile --skipDone /path/to/packages-list
```

Ignore previous pre-analysis result and force full analysis

```bash
node index.js --force express
```

Analyze a specific file:

```bash
node index.js --execFile /path/to/file.js <name>
```

Export all sarif data of the last analysis for a specific package:

```bash
node index.js --sarif --allTaints --out /path/to/sarif.sarif express
```

Export all sarif data of the last analysis for all analyzed packages:

```bash
node index.js --sarif --allTaints --outDir /path/to/sarif-dir/
```

### All flags:

#### General

| Flag                      | Description                                                                                  |
|---------------------------|----------------------------------------------------------------------------------------------|
| `--fromFile`              | Use a list of packages from a file containing a list of package names separated by new line. |                                                                                        
| `--skipTo <package_name>` | Skip to the specified package in the provided list.                                          |
| `--skipToLast`            | Skip to the last analyzed package.                                                           |
| `--skipDone`              | Skip all already analyzed packages                                                           |

#### Analysis

| Flag                                   | Description                                                                                                                      |
|----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `--forceBranchExec`                    | Enable force branch execution.                                                                                                   |
| `--onlyForceBranchExec`                | Only do force branch execution runs. Requires at least one previous unintrusive run.                                             |
| `--execFile <file_path>`               | Specify a file instead of a package to run.                                                                                      |
| `--noForIn`                            | Disable `for..in` injection run.                                                                                                 |
| `--onlyPre`                            | Only run the pre-analysis phase.                                                                                                 |
| `--noPre`                              | Skip the pre-analysis phase.                                                                                                     |
| `--force`                              | Force analysis (ignore previous pre-analysis results)                                                                            |
| `--collPrefix <prefix>`                | Specify a prefix for the MongoDB collection containing the results for the run                                                   |
| `--forceBranchExecCollPrefix <prefix>` | Specify where the forced branch exec information should be obtained. Use only if it deviates from the current collection prefix. |
| `--processNr <n>`                      | Specify a unique number to run multiple analyses in parallel                                                                     |
| `--forceProcess`                       | Forces the process to run                                                                                                        |
| `--forceSetup`                         | Force the setup phase of a package. Usually the setup is skipped when the package is already present.                            |
| `--sinkAnalysis`                       | Enables a run identifying *special* sinks that trigger *universal* gadgets.                                                      |
| `--onlySinkAnalysis`                   | Run only the special sink analysis                                                                                               |

#### Sarif export

| Flag                         | Description                                                                                                                                                   |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--sarif`                    | Output results in SARIF format.                                                                                                                               |
| `--out <output_file_path>`   | Specifies the path and file name for the output file.                                                                                                         |
| `--outDir <output_dir_path>` | Specifies the directory for the output file.                                                                                                                  |
| `--allTaints`                | Export all injected taints in addition to the flows (in a separate file).                                                                                     |
| `--exportRuns <n>`           | Export the last <n> runs (only works for flows and exceptions not for all taints and branchings) injections from the previous runs are skipped (default : 1). |

### Package Data Files

Information about analyzed packages are located in `pipeline/package-data`:

* `already-analyzed.txt`: Contains all already analyzed packages (is used for `--skipDone`)
* `last-analyzed.txt`: Contains the name of the last analyzed package (is used for `--skipToLast`)
* `nodejs-packages.txt`: Contains all package names that passed the pre-analysis
* `frontend-packages.txt`: Contains all package names that failed the pre-analysis
* `err-packages.txt`: Contains all package names that crashed during the pre-analysis (with an uncaught exception).
  Note, that if a node API call was encountered it is still added to `nodejs-packages.txt`
* `non-instrumented-packages.txt`: Contains all package names that ran but were never instrumented
* `filtered-packages`: Contains package names that were filtered out due to their name

If a package is either in `nodejs-packages.txt`, `frontend-packages.txt`, `err-packages.txt`
or `non-instrumented-packages.txt` the pre-analysis is skipped (if `--force` is not set).

## Why is the application/package not being analyzed?

If you encounter problems running the analysis you might want to try changing the pipeline filters which are in place to
avoid unnecessary instrumentation and analysis runs. If the analyzed package matches any of the filters it won't be
analyzed. The filters are defined in two locations:

1. `DONT_ANALYSE` in [`pipeline/index.js`](pipeline/index.js) specifies package names that are not analyzed at all (i.e.
   known uninteresting
   packages)
2. [`node.py`](pipeline/node-wrapper/node.py) defines different allow- and blocklists specifying which processes are
   being run and instrumented

If the package is filtered out by the pre-analysis phase, you can try to skip it with the `--noPre` flag.
