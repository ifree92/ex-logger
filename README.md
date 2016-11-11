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
