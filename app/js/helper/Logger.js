define(function () {
    var Logger = {};
    var isLog = false;

    Logger.initLogger = function () {
        isLog = CCASetting.ISLOG;
    };

    return Logger;
});