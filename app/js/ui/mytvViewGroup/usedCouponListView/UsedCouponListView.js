define(["framework/View", "framework/event/CCAEvent",
        "ui/mytvViewGroup/usedCouponListView/UsedCouponListDrawer", "ui/mytvViewGroup/usedCouponListView/UsedCouponListModel",
        "cca/PopupValues", "cca/DefineView", "service/Communicator", "cca/type/VisibleTimeType"],
        function(View, CCAEvent, UsedCouponListDrawer, UsedCouponListModel, PopupValues, DefineView, Communicator, VisibleTimeType) {

    var UsedCouponListView = null;
    UsedCouponListView = function() {
        View.call(this, DefineView.USED_COUPON_LIST_VIEW);
        var PAGE_SIZE = 6;
        this.model = new UsedCouponListModel();
        this.drawer = new UsedCouponListDrawer(this.getID(), this.model);
        var _this = this;

        UsedCouponListView.prototype.onInit = function() {

        };

        UsedCouponListView.prototype.onStart = function() {
        	this.transactionId = $.now() % 1000000;
        	_this.model.setIsListFetched(false);
            View.prototype.onStart.apply(this, arguments);
            
            /*
                @Tip Sync 로 데이터를 가져오는경우 onStart 내부에서 onGetData -> drawer.onStart 가 이루어진다
                ASync 로 데이터를 획득 할 경우 이미 drawer.onStart()가 호출된 이후임으로 drawer.onUpdate를 명시적으로 해줄 필요가 있다
            */
        };
        UsedCouponListView.prototype.onAfterStart = function() {
			_this.hideTimerContainer();       	
		}
        
        UsedCouponListView.prototype.onStop = function() {
            View.prototype.onStop.apply(this);
        };
        
        UsedCouponListView.prototype.onGetData = function(param) {
        	requestUsedCouponList();
        };
        function requestUsedCouponList() {
        	var transactionId = ++_this.transactionId;
        	Communicator.requestCouponUseHistory(callBackForRequestUsedCouponList, transactionId);
        }
        function callBackForRequestUsedCouponList(response) {
        	if(Communicator.isCorrectTransactionID(_this.transactionId, response)) {
    			if(Communicator.isSuccessResponseFromHAS(response)) {
//    				var possessionCouponList = new PossessionCouponList(response.possessionCouponList);
    				setData(response.possessionCouponList);
    			} else {
    				console.error("Failed to get datas from has.");
//                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
    			}
    			_this.model.setIsListFetched(true);
				_this.drawer.onUpdate();
				_this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
        	}
        	
		}
        
        function setData(possessionCouponList) {
            var model = _this.model;
//            console.log(possessionCouponList);
            model.setData(possessionCouponList);
            model.setSize(PAGE_SIZE, 1, possessionCouponList.length, 1);
            model.setRotate(true, false);
        };

        UsedCouponListView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
//            console.log("UsedCouponListView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_BACK:
                case tvKey.KEY_LEFT:
                	_this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                	break;
                case tvKey.KEY_EXIT:
                        _this.sendEvent(CCAEvent.FINISH_VIEW);    
                    break;
                case tvKey.KEY_RIGHT:
                	break;
                case tvKey.KEY_ENTER:
                	var ok_data = _this.model.getData()[_this.model.getVIndex()+_this.model.getVStartIndex()];
                	var eventType = ok_data.getEventType();
//                	console.log("ok 키  처리 되어야 함 !!!:"+eventType+" "+_this.model.getVIndex()+_this.model.getVStartIndex());
                	// TODO popup 구분위한 아이디 같은 것이 필요함 	
                	if(eventType == "001")	{
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.ALERT_COUPON_USED_VOD});
                	}
                	else if(eventType == "002")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "cancelPurchasePopupView"));
                	}
                	else if(eventType == "101")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "detailUsedCouponPopupView")); 
                	}
                	else if(eventType == "102")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "detailUsedCouponPopupView"));
                	}
                	else if(eventType == "103")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "refundCouponPopupView")); 
                	}
                	else if(eventType == "104")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "expireCouponPopupView")); 
                	}
                	else if(eventType == "201")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "expireCouponPopupView")); 
                	}
                	else if(eventType == "301")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "detailUsedCouponPopupView")); 
                	}
                	else if(eventType == "302")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "detailUsedCouponPopupView"));
                	}
                	else if(eventType == "303")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "detailUsedCouponPopupView"));
                	}
                	else if(eventType == "304")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "cancelPurchasePopupView"));
                	}
                	else if(eventType == "401")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "detailUsedCouponPopupView"));
                	}
                	else if(eventType == "402")	{
                		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponPopupViewGroup", "detailUsedCouponPopupView"));
                	}
                    break;
                case tvKey.KEY_UP:
                	_this.keyNavigator.keyUp();
            		if(_this.model.getData().length-1 == _this.model.getVStartIndex()+_this.model.getVIndex())	{
            			_this.model.setVStartIndex(_this.model.getData().length-1-(_this.model.getData().length-1)%_this.model.getVVisibleSize());
            			_this.model.setVIndex((_this.model.getData().length-1)%_this.model.getVVisibleSize());
            	}
            		else if(_this.model.getPreviousVIndex() == 0){
            			_this.model.setVStartIndex(_this.model.getVStartIndex()-_this.model.getVVisibleSize()+1);
            			_this.model.setVIndex(_this.model.getVVisibleSize()-1);
            		}
            		
            	
                	_this.drawer.onUpdate();
                    break;
                case tvKey.KEY_DOWN:
                    _this.keyNavigator.keyDown();
                	if(_this.model.getPreviousVIndex()+1 == _this.model.getVVisibleSize()){
                		_this.model.setVStartIndex(_this.model.getVStartIndex()+_this.model.getVIndex());
                		_this.model.setVIndex(0);
                		
                	}
                	if(_this.model.getData().length == _this.model.getVStartIndex()+_this.model.getVIndex()){
                		_this.model.setVStartIndex(0);
                		_this.model.setVIndex(0);
                	}

                    
                	_this.drawer.onUpdate();
                    break;
                default:
                    break;
            }
        };
        function getEventParamObject(targetView) {
            var model = _this.model;
            var param = {};
            param.targetView = targetView;
            param.index = model.getVIndex();
            param.startIndex = model.getVStartIndex();
            return param;
        }
        function getEventParamObjectForGroup(targetGroup, popupType) {
            var model = _this.model;
            var param = {};
            param.targetGroup = targetGroup;
            param.targetView = popupType;
            param.possessionCoupon = _this.model.getData()[_this.model.getVIndex()+_this.model.getVStartIndex()];
            return param;
        }
        this.onInit();
    };
    UsedCouponListView.prototype = Object.create(View.prototype);

    return UsedCouponListView;
});
