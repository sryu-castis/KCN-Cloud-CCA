define(["framework/View", "framework/event/CCAEvent",
        "ui/mytvViewGroup/discountCouponUsedListView/DiscountCouponUsedListDrawer", "ui/mytvViewGroup/discountCouponUsedListView/DiscountCouponUsedListModel",
        "service/Communicator", "cca/type/VisibleTimeType", "cca/DefineView"],
        function(View, CCAEvent, DiscountCouponUsedListDrawer, DiscountCouponUsedListModel, Communicator, VisibleTimeType, DefineView) {

    var DiscountCouponUsedListView = null;
    DiscountCouponUsedListView = function() {
        View.call(this, DefineView.DISCOUNT_COUPON_USED_LIST_VIEW);
        var PAGE_SIZE = 6;
        this.model = new DiscountCouponUsedListModel();
        this.drawer = new DiscountCouponUsedListDrawer(this.getID(), this.model);
        var _this = this;

        DiscountCouponUsedListView.prototype.onInit = function() {

        };

        DiscountCouponUsedListView.prototype.onBeforeStart = function() {
        	this.transactionId = $.now() % 1000000;
        	_this.model.setIsListFetched(false);
        };

        DiscountCouponUsedListView.prototype.onAfterStart = function() {
			_this.hideTimerContainer();
		}
        DiscountCouponUsedListView.prototype.onGetData = function(param) {
            requestDiscountUsedCouponList();
        };
        
        function requestDiscountUsedCouponList() {
        	var transactionId = ++_this.transactionId;
        	Communicator.requestDiscountCouponUseHistory(callBackForRequestContentGroupInfo, transactionId);
        }
        function callBackForRequestContentGroupInfo(response) {
			if(Communicator.isCorrectTransactionID(_this.transactionId, response)) {
				if(Communicator.isSuccessResponseFromHAS(response)) {
					setData(response.discountCouponList);
				} else {
					console.error("Failed to get datas from has.");
//	                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
				}
				_this.model.setIsListFetched(true);
				_this.drawer.onUpdate();
				_this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
			}
			
		}
        function setData(discountCouponList) {
            var model = _this.model;
           
            model.setData(discountCouponList);
            model.setSize(PAGE_SIZE, 1, discountCouponList.length, 1);
            model.setRotate(true, false);
        };

        DiscountCouponUsedListView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
//            console.log("DiscountCouponUsedListView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_BACK:
                case tvKey.KEY_LEFT:
                	_this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                	break;
                case tvKey.KEY_EXIT:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                        _this.sendEvent(CCAEvent.FINISH_VIEW);    
                    }
                    break;
                case tvKey.KEY_RIGHT:
                	break;
                case tvKey.KEY_ENTER:
                	var ok_data = _this.model.getData()[_this.model.getVIndex()+_this.model.getVStartIndex()];
                	_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup(DefineView.COUPON_POPUP_VIEWGROUP, DefineView.DISCOUNT_COUPON_POPUP_VIEW));
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
            param.discountCoupon = _this.model.getData()[_this.model.getVIndex()+_this.model.getVStartIndex()];
            return param;
        }
        this.onInit();
    };
    DiscountCouponUsedListView.prototype = Object.create(View.prototype);

    return DiscountCouponUsedListView;
});
