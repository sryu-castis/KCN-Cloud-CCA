define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent",
        "cca/DefineView", "cca/PopupValues", 
        "ui/mytvViewGroup/purchaseMonthlyCouponView/PurchaseMonthlyCouponDrawer","ui/mytvViewGroup/purchaseMonthlyCouponView/PurchaseMonthlyCouponModel",
        "framework/modules/ButtonGroup", "service/Communicator", "cca/type/VisibleTimeType"],
        function(STBInfoManager, View, CCAEvent, DefineView, PopupValues, PurchaseMonthlyCouponDrawer, PurchaseMonthlyCouponModel, ButtonGroup, Communicator, VisibleTimeType) {

    var PurchaseMonthlyCouponView = null;
    PurchaseMonthlyCouponView = function() {
        View.call(this, DefineView.PURCHASE_MONTHLY_COUPON_VIEW);
        this.model = new PurchaseMonthlyCouponModel();
        this.drawer = new PurchaseMonthlyCouponDrawer(this.getID(), this.model);
        var _this = this;

        PurchaseMonthlyCouponView.prototype.onInit = function() {

        };

        PurchaseMonthlyCouponView.prototype.onStart = function() {
        	this.transactionId = $.now() % 1000000;
            View.prototype.onStart.apply(this, arguments);
        };
        PurchaseMonthlyCouponView.prototype.onAfterStart = function() {
			_this.hideTimerContainer();
		}
        PurchaseMonthlyCouponView.prototype.onStop = function() {
            View.prototype.onStop.apply(this);
        };
        PurchaseMonthlyCouponView.prototype.onAfterDeActive= function() {
        	resetFocusIndex();
		}
        PurchaseMonthlyCouponView.prototype.onPopupResult = function(param) {
//            console.log("PurchaseMonthlyCouponView.prototype.onPopupResult:"+param.targetView+" " +param.resultCode);
            if(DefineView.PURCHASE_MONTHLY_COUPON_POPUP_VIEW == param.targetView){
            	if(param.resultCode == 100)	{
            		requestMonthlyCouponList();
            		var selectedCouponProduct = _this.model.getData()[_this.model.getHIndex()];
                    var id = PopupValues.ID.ALERT_PURCHASE_MONTHLY_COUPON_COMPLETED;
                	PopupValues[id].headText=selectedCouponProduct.getCouponProductName();
                	_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
            	}
            	else if(param.resultCode == 281)	{
            		changeToDuplicateSubscribePopup(param.couponProductName);
            	} else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:param.resultCode});
                }
            }
            

        };
        PurchaseMonthlyCouponView.prototype.onGetData = function(param) {
        	requestMonthlyCouponList();
        };
        function changeToDuplicateSubscribePopup(couponProductName) {
			var id = PopupValues.ID.ALERT_DUPLICATE_MONTHLY_COUPON;
			PopupValues[id].headText = couponProductName + CCABase.StringSources.alertDuplicateMonthlyCouponHeadText;
			PopupValues[id].subText= CCABase.StringSources.alertDuplicateMonthlyCouponSubText + STBInfoManager.getNumberOfCallCenter();
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
		}
        function requestMonthlyCouponList() {
        	var transactionId = ++_this.transactionId;
        	Communicator.requestAutopayCouponProductList(callBackForRequestMonthlyCouponList, transactionId);
        }
        function callBackForRequestMonthlyCouponList(response) {
        	if(Communicator.isCorrectTransactionID(_this.transactionId, response)) {
        		if(Communicator.isSuccessResponseFromHAS(response)) {
//        			var couponProductList = new CouponProductList(response.couponProductList);
        			setData(response.couponProductList);
        			_this.drawer.onUpdate();
        		} else {
        			console.error("Failed to get datas from has.");
//                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
    			}
                _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);

            } else {

			}
		}
  
        function setData(couponProductList) {
            var model = _this.model;
           
            model.setData(couponProductList);
            model.setSize(2, 3, 2, couponProductList.length);
            model.setVIndex(0);
            model.setRotate(false, false);
            model.setButtonGroup(new ButtonGroup(2));
            model.getButtonGroup().getButton(0).setLabel(CCABase.StringSources.ButtonLabel.JOIN);
            model.getButtonGroup().getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
        };
        
        
        function resetFocusIndex()	{
        	_this.model.setVIndex(0);
        	_this.model.setHIndex(0);
            _this.model.getButtonGroup().setIndex(0);
        }
        
        function findSubscribedProduct()	{
        	for(var i=0;i<_this.model.getData().length;i++){
        		if(_this.model.getData()[i].getSubscribed() == 1)	{
        			return _this.model.getData()[i];
        		}
        	}
        	return null;
        }
        
        PurchaseMonthlyCouponView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
//            console.log("PurchaseMonthlyCouponView, onKeyDown: " + keyCode );
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
//                	_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.PURCHASE_VIEWGROUP, id:"aaa"}); // FOR TEST
                    if(_this.model.getVIndex() == 1) {// button에 focus
                        var subscribedMonthlyCoupon = findSubscribedProduct();
                        if(_this.model.getButtonGroup().getIndex() == 0)	{ // 확인
                        	if(subscribedMonthlyCoupon != null)	{
                        		changeToDuplicateSubscribePopup(subscribedMonthlyCoupon.getCouponProductName());
                        	} else	{
                        		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup(DefineView.COUPON_POPUP_VIEWGROUP, DefineView.PURCHASE_MONTHLY_COUPON_POPUP_VIEW));
                        	}
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
            param.couponProduct = model.getData()[model.getHIndex()];
            return param;
        }
        this.onInit();
    };
    PurchaseMonthlyCouponView.prototype = Object.create(View.prototype);

    return PurchaseMonthlyCouponView;
});