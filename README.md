# NodeJS extended logger
Scalable multifunctional tunable logger created to resolve issues of logging any processes in a large projects.
## Installation
```
$ npm install --save ex-logger
```
## Usage
To begin usage need to create instance of Logger.
```js
var exLogger = require("ex-logger");
var log = new exLogger.Logger({
        singleLine: true
    });
log.debug("Hello world");
```
Output example:
```
[2016/11/11][13:10:31][D][test.js][18] Hello world
```
Format review:
```
[DATE][TIME][LOG_LEVEL][MODULE][LINE:SYMBOL] log string
```
Logger constructor require (of course if you want to change default view configuration) config object. Here is default configuration for Logger:
```js
{
        module: "", 
        showDate: true,
        showTime: true,
        showLogLevel: true,
        showModule: true,
        showLine: true,
        showSymbol: false,
        dispatcher: "",
        logLevel: LOG_LEVELS.trace,
        isModuleFullPath: false,
        singleLine: false
    };
```
- **module** *'string'* - custom module name. By default uses the name of js file
- **showDate** *'boolean'* - show [year/month/day]
- **showTime** *'boolean'* - show [hours/minutes/seconds]
- **showLogLevel** *'boolean'* - show [T] | [D] | [I] | [W] | [E] | [F] log level
- **showModule** *'boolean'* - show module name
- **showLine** *'boolean'* - show line number where log called
- **showSymbol** *'boolean'* - show symbol on a string where log called
- **dispatcher** *'string'*- 
- **logLevel** *'number'* *(LOG_LEVELS.\*)* - minimum log level to show
- **isModuleFullPath** *'boolean'* - as module name show full file path name where log called
- **singleLine** *'boolean'* - log without \n symbol (in one line)

Hierarchy of log levels:
- trace
- debug
- info
- warning
- error
- fatal
Example of usage all log levels (for example let it be file *logtest.js*):
```js
var exLogger = require("ex-logger");
var log = new exLogger.Logger({});

log.t("trace");
// log.trace("trace");

log.d("debug");
// log.debug("debug");

log.i("info");
// log.info("info");

log.w("warning");
// log.warning("warning");
// log.warn("warning");

log.e("error");
// log.error("error");
// log.err("error");

log.f("fatal");
// log.fatal("fatal");
```
Output example (one for each log level):

![example console output](data:image/png;base64,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)