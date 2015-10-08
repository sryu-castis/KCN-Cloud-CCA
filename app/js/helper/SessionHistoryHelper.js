define(function () {
    var SessionHistoryHelper = {};

    SessionHistoryHelper.isLastPage = function(model) {
        return model.getVStartIndex() == model.getVMax() - model.getVIndex() - 1;
    }

    SessionHistoryHelper.mergeParameter = function(originParam, addOptionParam) {
        if(originParam != null && addOptionParam != null) {
            for(var field in addOptionParam) {
                originParam[field] = addOptionParam[field];
            }
        }
        return originParam;
    }
    return SessionHistoryHelper;
});