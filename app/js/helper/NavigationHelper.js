define(function () {
    var NavigationHelper = {};

    NavigationHelper.isLastPage = function(model) {
        return model.getVStartIndex() == model.getVMax() - model.getVIndex() - 1;
    }
/*
    NavigationHelper.toLastLine = function(model) {
        //@ 키이벤트가 VstartIndex를 올려주었기 때문에 1감소 시킴
        model.setVStartIndex(model.getVStartIndex() - 1);
        //@ 포커스가 다음줄로 가게 하기 위한 vindex증가
        model.setVIndex(model.getVIndex() + 1);
    }

    NavigationHelper.needFixedFocus = function(model) {
        //@ 올라가는 경우 : 인덱스가 0이지만 StartIndex가 1이상일 때
        //@ 내려가는 경우 : 인덱스 + StartIndex 가 최대 갯수 -1 일 때
        return model.getVStartIndex() > 0 && model.getVIndex() == 0  || model.getVStartIndex() + model.getVIndex() == model.getVMax() - 1;
    }

    NavigationHelper.changeIndexForFixedFocus = function(model) {
        //@ 올라가는 경우 : 직전에 키이벤트에서 vIndex를 감소시켰음. 포커스가 이벤트전과 동일해야함으로 vIndex는 증가시키고 vStartIndex를 감소시킴
        //@ 내려가는 경우 : 키이벤트가 VstartIndex를 올려주었기 때문에 1감소 시킴. 포커스가 다음줄로 가게 하기 위한 vindex증가
        model.setVStartIndex(model.getVStartIndex() - 1);
        model.setVIndex(model.getVIndex() + 1);
    }*/

    return NavigationHelper;
});