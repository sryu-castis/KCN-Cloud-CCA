define(["framework/View", "framework/event/CCAEvent", "cca/type/SortType", "service/Communicator",
        "ui/popupViewGroup/eventWinnerPopupView/EventWinnerPopupDrawer", "ui/popupViewGroup/eventWinnerPopupView/EventWinnerPopupModel",
        "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView", "cca/type/VisibleTimeType"],
        function(View, CCAEvent, SortType, Communicator, EventWinnerDrawer, EventWinnerPopupModel, ButtonGroup, PopupValues, DefineView, VisibleTimeType) {

    var EventWinnerPopupView = function() {
        View.call(this, DefineView.EVENT_WINNER_POPUP_VIEW);
        this.model = new EventWinnerPopupModel();
        this.drawer = new EventWinnerDrawer(this.getID(), this.model);
        var _this = this;

        EventWinnerPopupView.prototype.onInit = function() {

        };

        EventWinnerPopupView.prototype.onStart = function(param) {
            this.transactionId = 0;
            this.isRequesting = false;
            View.prototype.onStart.apply(this, arguments);
            /*
                @Tip Sync 로 데이터를 가져오는경우 onStart 내부에서 onGetData -> drawer.onStart 가 이루어진다
                ASync 로 데이터를 획득 할 경우 이미 drawer.onStart()가 호출된 이후임으로 drawer.onUpdate를 명시적으로 해줄 필요가 있다
            */
        };

        EventWinnerPopupView.prototype.onAfterStart = function() {
            _this.hideTimerContainer();
        }

        EventWinnerPopupView.prototype.onStop = function() {
            View.prototype.onStop.apply(this);
        };

        EventWinnerPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            // console.log("alertPopupView, onKeyDown: " + keyCode );
            switch (keyCode) {
                case tvKey.KEY_RIGHT:
                    showNextPage();
                    break;
                case tvKey.KEY_LEFT:
                    showPrevPage();
                    break;
                case tvKey.KEY_EXIT:
                case tvKey.KEY_BACK:
                case tvKey.KEY_ENTER:
                    _this.sendEvent(CCAEvent.FINISH_VIEW);
                    break;
                case tvKey.KEY_UP:
                    break;
                case tvKey.KEY_DOWN:
                    break;
                default:
                    break;
            };
        };

        EventWinnerPopupView.prototype.onGetData = function(param) {
            requestEventWinnerList(param.eventId);
        };

        function requestEventWinnerList(eventId) {
            if(_this.isRequesting == true) {
                return;
            };
            _this.isRequesting = true;

            var transactionId = ++_this.transactionId;
            var sortType = SortType.NAME_ASC;
            var pageSize = 0;
            var pageIndex = 0;

            Communicator.requestEventWinnerList(callbackForRequestEventWinnerList, transactionId, eventId, sortType, pageIndex, pageSize);
        };

        function callbackForRequestEventWinnerList(result) {
            _this.isRequesting = false;
            if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
            	if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    var model = _this.model;
                    var verticalVisibleSize = 4;
                    var horizonVisibleSize = 1;
                    var verticalMaximumSize = result.totlaCount;
                    var horizonMaximumSize = horizonVisibleSize;

                    model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                    model.setRotate(true, false);
                    setData(result.eventWinnerList);
                } else {
                    console.error("Failed to get datas from has.");
                };
            }
            _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);


        };
        
        function setData(param) {
			var model = _this.model;
            model.setData(param.event);
		};
        

        function showPrevPage () {
            console.log('show prev page');
        };
        function showNextPage () {
            console.log('show next page');
        };

        this.onInit();
    };
    EventWinnerPopupView.prototype = Object.create(View.prototype);
	
    return EventWinnerPopupView;
});
