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
[DATE][TIME][LOG_LEVEL][MODULE][LINE:COLUMN] log string
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
        showColumn: false,
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
- **showColumn** *'boolean'* - show column on a string where log called
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

![example console output](http://i.piccy.info/i9/4a45f080a1fee46f66dbec8140fb0f97/1478866707/24498/1088595/logger_example_view.png)

#### Global log level settings
Here is ability to set minimum log level for all Logger instances.
```js
var exLogger = require("ex-logger");
exLogger.config.logLevel = exLogger.LOG_LEVELS.warning;

// All available log levels:
// exLogger.LOG_LEVELS.trace
// exLogger.LOG_LEVELS.debug
// exLogger.LOG_LEVELS.info
// exLogger.LOG_LEVELS.warning
// exLogger.LOG_LEVELS.error
// exLogger.LOG_LEVELS.fatal
```

## Events
Each Logger instance has a method to register callback function to call it when something is logged.
```js
var exLogger = require("ex-logger");
var log = new exLogger.Logger({});
log.on(function(logObject){
    // ...
});

log.debug("Something");
log.info("More...");
```
Here is *logObject* fields:
```js
{ 
    date: '2016/11/11',
    time: '14:37:12',
    logLevel: 'D',
    module: 'logtest.js',
    line: '7',
    column: '5',
    log: 'Something',
    dispatcher: '' 
}
```
## Dispatcher
Each new logger instance add to dispatcher and you can subscribe to dispatcher for all loggers events or with filtered only by some dispatcher name.
By default all new instances of Logger has empty dispatcher name and automatic registered to dispatcher with an empty name `""`.

Example dispatcher usage:
```js
var exLogger = require("ex-logger");

// subscribe on all any logger events
exLogger.Dispatcher.on(function(logObject){
    // ...
});

// subscribe on all Logger instances with empty dispatcher name
exLogger.Dispatcher.on("", function(logObject){
    // ...
});

// subscribe on all Logger instances with "requests" dispatcher name
exLogger.Dispatcher.on("requests", function(logObject){
    // ...
});

var log1 = new exLogger.Logger({dispatcher: "requests"});
var log2 = new exLogger.Logger({});
```

## Tips

You can log any javascript type and mix variable types in one log time.
```js
var exLogger = require("ex-logger");
var log = new exLogger.Logger({singleLine: true});

var auth = {user: "user", pass: "pass"};
var names = ["John", "Jimmy", "Joe"];
var anyString = "Hello. I'm a string";
var year = 2016;
var isare = true;
var func = function() {
    // any function
    return {auth: true};
}
var nan = NaN;
var und = undefined;
var nil = null;

log.debug(auth, names, anyString, year, isare, func, nan, und, nil);
```
Output:
```
[2016/11/11][15:03:17][D][test.js][21] {"user":"user","pass":"pass"} ["John","Jimmy","Joe"] Hello. I'm a string 2016 true function () {    // any function    return {auth: true};} NaN undefined null
```

## Support/Contacts
Ihor Levchenko
ifree92@gmail.com