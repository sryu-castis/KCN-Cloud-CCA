define(["framework/View", "framework/event/CCAEvent", 'cca/type/VisibleTimeType',
        "ui/popupViewGroup/eventDetailPopupView/EventDetailPopupDrawer", "ui/popupViewGroup/eventDetailPopupView/EventDetailPopupModel", "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView", "service/Communicator"],
        function(View, CCAEvent, VisibleTimeType, EventDetailDrawer, EventDetailPopupModel, ButtonGroup, PopupValues, DefineView, Communicator) {

    var EventDetailPopupView = function() {
        View.call(this, DefineView.EVENT_DETAIL_POPUP_VIEW);
        this.model = new EventDetailPopupModel();
        this.drawer = new EventDetailDrawer(this.getID(), this.model);
        var _this = this;

        var timeoutClose;

        EventDetailPopupView.prototype.onInit = function() {

        };

        EventDetailPopupView.prototype.onAfterStart = function(param) {
            _this.hideTimerContainer();
        };

        EventDetailPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            // console.log("alertPopupView, onKeyDown: " + keyCode );
            switch (keyCode) {
                case tvKey.KEY_RIGHT:
                    _this.keyNavigator.keyRight();
                    _this.drawer.onUpdate();
                    break;
                case tvKey.KEY_LEFT:
                    _this.keyNavigator.keyLeft();
                    _this.drawer.onUpdate();
                    break;
                case tvKey.KEY_ESC:
                case tvKey.KEY_EXIT:
                case tvKey.KEY_BACK:
                    var param = {};
                    param.popupType = PopupValues.PopupType.EVENT_DETAIL;
                    param.result = CCABase.StringSources.ButtonLabel.CANCEL;
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, param);
                    break;
                case tvKey.KEY_ENTER:
                    clickButton(keyCode);
                    break;
                case tvKey.KEY_UP:
                    break;
                case tvKey.KEY_DOWN:
                    break;
                default:
                    break;
            }
        };

        EventDetailPopupView.prototype.onGetData = function(param) {
            var type = param.type;
            
            this.model.setType(type);
            requestEventInfo(callbackForRequestEventInfo, param.eventId);
        };
        
        function setData(event) {
			var model = _this.model;
            model.setData(event);
		};

        function requestEventInfo(callback, eventId) {
            Communicator.requestEventInfo(callback, eventId);
        };

        function callbackForRequestEventInfo(result) {
            if(Communicator.isSuccessResponseFromHAS(result)) {
                var model = _this.model;
                var event = result.event;

                var type = _this.model.getType();
                type = type != undefined ? type : event.getEventStatus();
                _this.model.setType(type);

                var verticalVisibleSize = 1;
                var horizonVisibleSize = (type == EventDetailDrawer.TYPE_ON_EVENT) ? 1 : 2;
                var verticalMaximumSize = 1;
                var horizonMaximumSize = horizonVisibleSize;

                model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);

                setData(event);
                _this.drawer.onUpdate();
                _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
            } else {
                 _this.sendEvent(CCAEvent.CHANGE_VIEW, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
            }
        };
        
        
        function clickButton(keyCode) {
            var model = _this.model;
            if(model.getHIndex() == 1) {
                var param = {};
                param.popupType = PopupValues.PopupType.EVENT_DETAIL;
                param.result = CCABase.StringSources.ButtonLabel.CANCEL;
                _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, param);
            } else {
                var type = model.getType();
                if(type == EventDetailDrawer.TYPE_ON_EVENT) {
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                } else if(type == EventDetailDrawer.TYPE_OFF_EVENT) {
                    if(keyCode == window.TVKeyValue.KEY_ENTER) {
                        showWinnerPopup();
                    } else {
                        _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                    };
                } else {
                    var param = {};
                    param.popupType = PopupValues.PopupType.EVENT_DETAIL;
                    param.result = CCABase.StringSources.ButtonLabel.ENROLL;
                    param.isEnrolled = true;
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, param);
                };
            };
        };

        function showWinnerPopup() {
            var param = {};
            param.eventId = _this.model.getData().getEventID();
            param.targetView = DefineView.EVENT_WINNER_POPUP_VIEW;
            _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
        };
        
        this.onInit();
    };
    EventDetailPopupView.prototype = Object.create(View.prototype);
    EventDetailPopupView.TYPE_ON_EVENT 		= EventDetailDrawer.TYPE_ON_EVENT;
    EventDetailPopupView.TYPE_OFF_EVENT 		= EventDetailDrawer.TYPE_OFF_EVENT;
    EventDetailPopupView.TYPE_ENROLL_EVENT 	= EventDetailDrawer.TYPE_ENROLL_EVENT;
	
    return EventDetailPopupView;
});
