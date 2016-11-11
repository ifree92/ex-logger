var path = require("path");
var colors = require("colors");

var COLORS_BY_LEVELS = {
    trace: colors.gray,
    debug: colors.green,
    info: colors.cyan,
    warning: colors.yellow,
    error: colors.red,
    fatal: colors.red.bold
};

var LOG_LEVELS = {
    trace: 0,
    debug: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
    0: "T",
    1: "D",
    2: "I",
    3: "W",
    4: "E",
    5: "F"
};

var LOG_LEVELS_NAMES = {
    trace: "T",
    debug: "D",
    info: "I",
    warning: "W",
    error: "E",
    fatal: "F"
};

var config = {
    logLevel: LOG_LEVELS.trace
};

var Dispatcher = {
    LOGGERS: {},
    LISTENERS: {},
    GLOBAL_LISTENERS: [],
    add: function(logger){
        if (! logger instanceof Logger)
            return;
        if (!this.LOGGERS.hasOwnProperty(logger.config.dispatcher))
            this.LOGGERS[logger.config.dispatcher] = [];
        this.LOGGERS[logger.config.dispatcher].push(logger);
        if (this.LISTENERS.hasOwnProperty(logger.config.dispatcher)) {
            for (var i = 0; i < this.LISTENERS[logger.config.dispatcher].length; i++)
                logger.on(this.LISTENERS[logger.config.dispatcher][i]);
        }
        for (var i = 0; i < this.GLOBAL_LISTENERS.length; i++)
            logger.on(this.GLOBAL_LISTENERS[i]);
    },
    on: function(name, cb) {
        if (typeof name == "function") {
            this.GLOBAL_LISTENERS.push(name);
            for (var i in this.LOGGERS)
                for (var j = 0; j < this.LOGGERS[i].length; j++)
                    this.LOGGERS[i][j].on(name);
            return;
        } else if (typeof name != "string" || typeof cb != "function")
            return;
        if (!this.LISTENERS.hasOwnProperty(name))
            this.LISTENERS[name] = [];
        this.LISTENERS[name].push(cb);
        if (this.LOGGERS.hasOwnProperty(name)) {
            for (var i = 0; i < this.LOGGERS[name].length; i++) {
                this.LOGGERS[name][i].on(cb);
            }
        }
    }
};


function Logger(config) {
    // default config
    this.config = {
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
    this.cbs = [];

    if (typeof config == "object") {
        if (config.hasOwnProperty("module") && typeof config.module == "string")
            this.config.module = config.module;
        if (config.hasOwnProperty("showDate") && typeof config.showDate == "boolean")
            this.config.showDate = config.showDate;
        if (config.hasOwnProperty("showTime") && typeof config.showTime == "boolean")
            this.config.showTime = config.showTime;
        if (config.hasOwnProperty("showLogLevel") && typeof config.showLogLevel == "boolean")
            this.config.showLogLevel = config.showLogLevel;
        if (config.hasOwnProperty("showModule") && typeof config.showModule == "boolean")
            this.config.showModule = config.showModule;
        if (config.hasOwnProperty("showLine") && typeof config.showLine == "boolean")
            this.config.showLine = config.showLine;
        if (config.hasOwnProperty("showSymbol") && typeof config.showSymbol == "boolean")
            this.config.showSymbol = config.showSymbol;
        if (config.hasOwnProperty("dispatcher") && typeof config.dispatcher == "string")
            this.config.dispatcher = config.dispatcher;
        if (config.hasOwnProperty("logLevel") && typeof config.logLevel == "number")
            this.config.logLevel = config.logLevel;
        if (config.hasOwnProperty("isModuleFullPath") && typeof config.isModuleFullPath == "boolean")
            this.config.isModuleFullPath = config.isModuleFullPath;
        if (config.hasOwnProperty("singleLine") && typeof config.singleLine == "boolean")
            this.config.singleLine = config.singleLine;0
    }
    Dispatcher.add(this);
}

Logger.prototype.trace = Logger.prototype.t = function() {
    this.__log(COLORS_BY_LEVELS.trace, arguments, LOG_LEVELS.trace);
};

Logger.prototype.debug = Logger.prototype.d = function() {
    this.__log(COLORS_BY_LEVELS.debug, arguments, LOG_LEVELS.debug);
};

Logger.prototype.info = Logger.prototype.i = function () {
    this.__log(COLORS_BY_LEVELS.info, arguments, LOG_LEVELS.info);
};

Logger.prototype.warning = Logger.prototype.warn = Logger.prototype.w = function() {
    this.__log(COLORS_BY_LEVELS.warning, arguments, LOG_LEVELS.warning);
};

Logger.prototype.error = Logger.prototype.err = Logger.prototype.e = function() {
    this.__log(COLORS_BY_LEVELS.error, arguments, LOG_LEVELS.error);
};

Logger.prototype.fatal = Logger.prototype.f = function() {
    this.__log(COLORS_BY_LEVELS.fatal, arguments, LOG_LEVELS.fatal);
};

Logger.prototype.__log = function(color, args, logLevel) {
    // console.log(this.config.logLevel, config.logLevel);
    if (logLevel < this.config.logLevel || logLevel < config.logLevel)
        return;
    var callerInfo = getCallerInfo();
    var logObject = {
        date: getDate(),
        time: getTime(),
        logLevel: LOG_LEVELS[logLevel],
        module: "",
        line: callerInfo.line,
        symbol: callerInfo.symbol,
        log: "",
        dispatcher: this.config.dispatcher
    };
    if (this.config.module)
        logObject.module = this.config.module;
    else
        if (this.config.isModuleFullPath)
            logObject.module = callerInfo.filePath ;
        else
            logObject.module = callerInfo.file;
    var logString = "";
    if (this.config.showDate)
        logString += "[" + logObject.date + "]";
    if (this.config.showTime)
        logString += "[" + logObject.time + "]";
    if (this.config.showLogLevel)
        logString += "[" + logObject.logLevel + "]";
    if (this.config.showModule) {
        logString += "[" + logObject.module + "]";
    }
    if (this.config.showLine) {
        logString += "[" + logObject.line;
        if (this.config.showSymbol)
            logString += ":" + logObject.symbol;
        logString += "]";
    }

    logObject.log = getLineFromArguments(args);
    if (this.config.singleLine)
        logObject.log = logObject.log.replace(/\n/g, "");
    this.emit(logObject);
    logString += " " + logObject.log;
    console.log(color(logString));
};

Logger.prototype.on = function(cb) {
    if (typeof cb != "function")
        return;
    this.cbs.push(cb);
};

Logger.prototype.emit = function(logObject) {
    for (var i = 0; i < this.cbs.length; i++) {
        if (typeof this.cbs[i] == "function")
            this.cbs[i](logObject);
    }
};

module.exports = {
    Logger : Logger,
    Dispatcher : Dispatcher,
    config : config,
    LOG_LEVELS : LOG_LEVELS,
    LOG_LEVELS_NAMES : LOG_LEVELS_NAMES
};

// Additional functions

function getCallerInfo() {
    var err = new Error();
    var line = err.stack.split("\n")[4];
    var callerInfo = {
        file: "",
        filePath: "",
        line: 0,
        symbol: 0
    };
    line = line.substr(line.indexOf("("));
    line = line.substr(1, line.length - 2).split(":");
    callerInfo.symbol = line[line.length - 1];
    callerInfo.line = line[line.length - 2];
    for (var i = 0; i < line.length - 2; i++) {
        callerInfo.filePath += line[i];
    }
    var filePath = callerInfo.filePath.split(path.sep);
    callerInfo.file = filePath[filePath.length - 1];
    return callerInfo;
}

function getLineFromArguments(args) {
    if (!args instanceof Array)
        return "";
    var line = "";
    for (var i = 0; i < args.length; i++) {
        switch (typeof args[i]) {
            case "object":
                try {
                    line += JSON.stringify(args[i]);
                } catch (e) {}
                break;
            default:
                line += args[i];
        }
        if (i < args.length - 1)
            line += " ";
    }
    return line;
}

function getDate() {
    var date = new Date();
    return date.getFullYear() +
        "/" +
        fixZeroDigit(date.getMonth() + 1) +
        "/" +
        fixZeroDigit(date.getDate());
}

function getTime() {
    var date = new Date();
    return fixZeroDigit(date.getHours()) +
        ":" +
        fixZeroDigit(date.getMinutes()) +
        ":" +
        fixZeroDigit(date.getSeconds());
}

function fixZeroDigit(digit, showSign) {
    if (typeof(digit) == "string") digit = parseInt(digit);
    if (typeof(digit) != "number") return "00";
    var sign = "+";
    if (digit < 0) {
        sign = "-";
        digit = digit * -1;
    }
    return showSign ? sign + (digit < 10 ? ("0" + digit) : digit) : (digit < 10 ? ("0" + digit) : digit);
}