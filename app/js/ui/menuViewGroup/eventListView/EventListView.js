define(["framework/View", "framework/event/CCAEvent",
        "ui/menuViewGroup/eventListView/EventListDrawer", "ui/menuViewGroup/eventListView/EventListModel",
        "service/Communicator",'cca/type/SortType', "cca/DefineView", "cca/PopupValues", 'cca/type/VisibleTimeType'],
    function (View, CCAEvent, EventListDrawer, EventListModel, Communicator, SortType, DefineView, PopupValues, VisibleTimeType) {

        var EventListView = function () {
            View.call(this, DefineView.EVENT_LIST_VIEW);
            this.model = new EventListModel();
            this.drawer = new EventListDrawer(this.getID(), this.model);

            var _this = this;

            EventListView.prototype.onInit = function() {

            };

            EventListView.prototype.onBeforeStart = function (param) {
                _this = this;
                this.model.eventStatus = param.type;
                this.isRequesting = false;
                this.transactionId = $.now() % 1000000;
            };

            EventListView.prototype.onAfterStart = function() {
                _this.hideTimerContainer();
            };

            EventListView.prototype.onBeforeActive = function (param) {
                if(_this.model.getData().length == 0) {
                    sendFinishViewEvent();
                };
            };

            EventListView.prototype.onAfterActive = function (param) {
                sendChangeFocus();
            };

            EventListView.prototype.onKeyDown = function (event, param) {
                var model = _this.model;
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
//              console.log('PosterListView, onKeyDown[keyCode: ' + keyCode + ']');

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        if(model.getVIndex() == 0) {
                            scrollUp();
                        } else {
                            _this.keyNavigator.keyUp();
                            _this.drawer.onUpdate();
                            sendChangeFocus();    
                        };
                        
                        return true;
                    case tvKey.KEY_DOWN:
                        if(model.getVIndex() == model.getVVisibleSize()-1 || isLastItem() == true) {
                            scrollDown();
                        } else {
                            _this.keyNavigator.keyDown();
                            _this.drawer.onUpdate();    
                            sendChangeFocus();
                        };
                        
                        return true;
                    case tvKey.KEY_RIGHT:
                        return true;
                    case tvKey.KEY_LEFT:
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_EXIT:
                    case tvKey.KEY_BACK:
                        sendFinishViewEvent();
                        return true;
                    case tvKey.KEY_ENTER:
                        sendChangeViewGroupEvent();
                        return true;
                    default:
                        return false;
                };
            };            

            EventListView.prototype.onGetData = function (param) {
                var pageIndex = 0;
                var pageSize = 0;
                var vIndex = param.vIndex;
                var vStartIndex = param.vStartIndex;
                this.model.setVIndex(vIndex | 0);
                this.model.setVStartIndex(vStartIndex | 0);
                requestEventList(callbackForRequestEventList, this.model.eventStatus, pageIndex, pageSize);
            };

            function requestEventList (callback, eventStatus, pageIndex, pageSize) {
                if(_this.isRequesting == true) {
                    return;
                };
                _this.isRequesting = true;
                var transactionId = ++_this.transactionId;
                var eventType = 'all';
                var eventEnrollStatus = 99;
                var sortType = SortType.CREATION_TIME_DESC;
                Communicator.requestEventList(callback, transactionId, eventType, eventStatus, eventEnrollStatus, sortType, pageIndex, pageSize);
                // Communicator.requestBundleProductList(0, function(result){console.log(result)}, 0, 0, 0);
            };

            function callbackForRequestEventList(result) {
                _this.isRequesting = false;
                if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
                	if(Communicator.isSuccessResponseFromHAS(result) == true) {
                        var model = _this.model;
                        var verticalVisibleSize = 6;
                        var horizonVisibleSize = 1;
                        var verticalMaximumSize = verticalVisibleSize;
                        var horizonMaximumSize = horizonVisibleSize;

                        model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                        model.setRotate(true, false);
                        setData(result.eventList);
                        _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);

                    } else {
                        console.error("Failed to get datas from has.");
                        setData([]);
                    };
                }
            };

            function setData(eventList) {
                _this.model.setData(eventList);
                _this.drawer.onUpdate();
            };

            function isLastItem() {
                return (_this.model.getVStartIndex() + _this.model.getVIndex() == _this.model.getData().length - 1);
            };

            function scrollUp() {
                var model = _this.model;
                var vStartIndex = model.getVStartIndex() - model.getVVisibleSize();
                var totalPage = Math.ceil(model.getData().length / model.getVVisibleSize());
                var vIndexOfLastPage = model.getData().length % model.getVVisibleSize() - 1;
                var isOverflow = vStartIndex < 0;
                vStartIndex = isOverflow ? (totalPage - 1) * model.getVVisibleSize() : vStartIndex; 
                var vIndex = (isOverflow == true) ? vIndexOfLastPage : model.getVVisibleSize() - 1;
                model.setVStartIndex(vStartIndex);
                model.setVIndex(vIndex);
                _this.drawer.onUpdate();
                sendChangeFocus();
            };

            function scrollDown() {
                var model = _this.model;
                var vStartIndex = model.getVStartIndex() + model.getVVisibleSize();
                var isOverflow = vStartIndex > model.getData().length - 1;
                vStartIndex = isOverflow ? 0 : vStartIndex;
                var vIndex = 0;
                model.setVStartIndex(vStartIndex);
                model.setVIndex(vIndex);
                _this.drawer.onUpdate();
                sendChangeFocus();
            };

            function sendChangeViewGroupEvent() {
                var model = _this.model;
                var selectedItem = model.getData()[model.getVStartIndex() + model.getVIndex()];
                //console.log('selected contentGroup: ' + selectedItem.getTitle());
                var param = {};
                param.popupType = PopupValues.PopupType.EVENT_DETAIL;
                // param.type = _this.model.eventStatus;
                // param.targetView = DefineView.EVENT_DETAIL_POPUP_VIEW;
                param.eventId = selectedItem.getEventID();
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            };

            function sendChangeFocus() {
                var model = _this.model;
                var param = {};
                param.vIndex = model.getVIndex();
                param.vStartIndex = model.getVStartIndex();
                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
            };

            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };

            this.onInit();
        };

        EventListView.prototype = Object.create(View.prototype);
        EventListView.TYPE_ON_EVENT = 10;
        EventListView.TYPE_OFF_EVENT = 20;

        return EventListView;
    });