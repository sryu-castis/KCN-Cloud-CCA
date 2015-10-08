define(["framework/View", "framework/event/CCAEvent", 
        "cca/DefineView", "cca/PopupValues",
        "ui/mytvViewGroup/purchaseCouponView/PurchaseCouponDrawer","ui/mytvViewGroup/purchaseCouponView/PurchaseCouponModel",
        "framework/modules/ButtonGroup", "service/Communicator", "cca/type/VisibleTimeType"],
        function(View, CCAEvent, 
        		DefineView, PopupValues,
        		PurchaseCouponDrawer, PurchaseCouponModel, ButtonGroup, Communicator, VisibleTimeType) {

    var PurchaseConponView = null;
    PurchaseConponView = function() {
        View.call(this, "purchaseConponView");
        this.model = new PurchaseCouponModel();
        this.drawer = new PurchaseCouponDrawer(this.getID(), this.model);
        var _this = this;

        PurchaseConponView.prototype.onInit = function() {

        };

        PurchaseConponView.prototype.onStart = function() {
        	this.transactionId = $.now() % 1000000;
            View.prototype.onStart.apply(this, arguments);
        };
        PurchaseConponView.prototype.onAfterStart = function() {  
        	_this.hideTimerContainer();
		}
        PurchaseConponView.prototype.onStop = function() {
            View.prototype.onStop.apply(this);
        };
        PurchaseConponView.prototype.onAfterDeActive= function() {
        	resetFocusIndex();
		}
        PurchaseConponView.prototype.onPopupResult = function(param) {
//        	console.log("PurchaseConponView.prototype.onPopupResult:"+param.targetView+" " +param.resultCode);
        	if(DefineView.PURCHASE_COUPON_POPUP_VIEW == param.targetView){
        		if(param.resultCode == 100)	{
                    var selectedCouponProduct = _this.model.getData()[_this.model.getHIndex()];
                    var id = PopupValues.ID.ALERT_PURCHASE_COUPON_COMPLETED;
                    PopupValues[id].headText=selectedCouponProduct.getCouponProductPrice()+CCABase.StringSources.alertPurchaseCouponCompletedHeadText;
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
        		}
        		else	{
        			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:param.resultCode});
        		}
        	}
        };
        PurchaseConponView.prototype.onGetData = function(param) {
        	requestCouponProductList();
        };
        function requestCouponProductList() {
        	var transactionId = ++_this.transactionId;
        	Communicator.requestCouponProductList(callBackForRequestCouponProductList, transactionId);
        }
        function callBackForRequestCouponProductList(response) {
        	if(Communicator.isCorrectTransactionID(_this.transactionId, response)) {
        		if(Communicator.isSuccessResponseFromHAS(response)) {
//    				var couponProductList = new CouponProductList(response.couponProductList);
    				setData(response.couponProductList);
    				_this.drawer.onUpdate();
    			} else {
                    console.error("Failed to get datas from has.");
                }
                _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
            }
			
		}
 
        function setData(couponProductList) {
            var model = _this.model;
           
            model.setData(couponProductList);
            model.setSize(2, 3, 2, couponProductList.length);
            model.setVIndex(0);
            model.setRotate(false, false);
            model.setButtonGroup(new ButtonGroup(2));
            model.getButtonGroup().getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
            model.getButtonGroup().getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
        };
        
        function resetFocusIndex()
        {
        	_this.model.setVIndex(0);
        	_this.model.setHIndex(0);
            _this.model.getButtonGroup().setIndex(0);
        }
        PurchaseConponView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
//            console.log("PurchaseConponView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_BACK:
                    _this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
            		break;
                case tvKey.KEY_LEFT:
                	if(_this.model.getVIndex() == 1) {// button에 focus
                        if(_this.model.getButtonGroup().getIndex() == 0)	{
                            _this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                        }
                        else	{
                        	_this.model.getButtonGroup().previous();
                            _this.drawer.onUpdate();
                        }
                        
                    }
                    else {// coupon에 focus
                    	if(_this.model.getHIndex() == 0)	{
                            _this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                    	}
                    	else	{
                    		_this.keyNavigator.keyLeft();
                            _this.drawer.onUpdate();	
                    	}
                        
                    }
                    break;
                case tvKey.KEY_RIGHT:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                    	_this.model.getButtonGroup().next();
                        _this.drawer.onUpdate();
                    }
                    else 	{// coupon에 focus
                        _this.keyNavigator.keyRight();
                        _this.drawer.onUpdate();
                    }
                    break;
                case tvKey.KEY_EXIT:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                        _this.sendEvent(CCAEvent.FINISH_VIEW);    
                    }
                    break;

                case tvKey.KEY_ENTER:
                    if(_this.model.getVIndex() == 1) {// button에 focus 
                        if(_this.model.getButtonGroup().getIndex() == 0)	{ // 확인
                        	var selectedCouponProduct = _this.model.getData()[_this.model.getHIndex()];
                    		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup(DefineView.COUPON_POPUP_VIEWGROUP, DefineView.PURCHASE_COUPON_POPUP_VIEW)); //이게 원래임
                        }
                        else	{	// 취소
                            _this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                        }
                    }
                    else {// coupon에 focus
                    	_this.model.setVIndex(1); 
                        _this.drawer.onUpdate();
                    }
                    break;
                case tvKey.KEY_UP:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                        _this.model.setVIndex(0); 
                        _this.model.getButtonGroup().setIndex(0);
                        _this.drawer.onUpdate();
                    }
                    else {// coupon에 focus

                    }
                    break;
                case tvKey.KEY_DOWN:
                    if(_this.model.getVIndex() == 1) {// button에 focus
                        // do nothing
                    }
                    else {// coupon에 focus
                        _this.model.setVIndex(1); 
                        _this.drawer.onUpdate();
                    }
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
            param.couponProduct = _this.model.getData()[_this.model.getHIndex()];
            return param;
        }
        this.onInit();
    };
    PurchaseConponView.prototype = Object.create(View.prototype);

    return PurchaseConponView;
});
