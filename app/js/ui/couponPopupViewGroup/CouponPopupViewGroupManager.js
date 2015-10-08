define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack", "cca/DefineView"
         ,"ui/couponPopupViewGroup/cancelPurchasePopupView/CancelPurchasePopupView"
         ,"ui/couponPopupViewGroup/purchaseMonthlyCouponPopupView/PurchaseMonthlyCouponPopupView"
         ,"ui/couponPopupViewGroup/purchaseCouponPopupView/PurchaseCouponPopupView"
         ,"ui/couponPopupViewGroup/detailUsedCouponPopupView/DetailUsedCouponPopupView"
         ,"ui/couponPopupViewGroup/expireCouponPopupView/ExpireCouponPopupView"
         ,"ui/couponPopupViewGroup/refundCouponPopupView/RefundCouponPopupView"
         ,"ui/couponPopupViewGroup/discountCouponPopupView/DiscountCouponPopupView"
         ,"ui/couponPopupViewGroup/registerMonthlyCouponPopupView/RegisterMonthlyCouponPopupView"
        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, DefineView, CancelPurchasePopupView, PurchaseMonthlyCouponPopupView, 
    		PurchaseCouponPopupView, DetailUsedCouponPopupView, ExpireCouponPopupView, RefundCouponPopupView, DiscountCouponPopupView, RegisterMonthlyCouponPopupView) {

    var CouponPopupViewGroupManager = function(id) {
        ViewGroup.call(this, id);

        this.popupViews = {};
        
        var cancelPurchasePopupView = new CancelPurchasePopupView();
        var purchaseMonthlyCouponPopupView =new PurchaseMonthlyCouponPopupView();
        var purchaseCouponPopupView =new PurchaseCouponPopupView();
        var detailUsedCouponPopupView =new DetailUsedCouponPopupView();
        var expireCouponPopupView =new ExpireCouponPopupView();
        var refundCouponPopupView =new RefundCouponPopupView();
        var discountCouponPopupView = new DiscountCouponPopupView();
        var registerMonthlyCouponPopupView = new RegisterMonthlyCouponPopupView();
        
        this.popupViews[cancelPurchasePopupView.getID()] = cancelPurchasePopupView;
        this.popupViews[purchaseMonthlyCouponPopupView.getID()] = purchaseMonthlyCouponPopupView;
        this.popupViews[purchaseCouponPopupView.getID()] = purchaseCouponPopupView;
        this.popupViews[detailUsedCouponPopupView.getID()] = detailUsedCouponPopupView;
        this.popupViews[expireCouponPopupView.getID()] = expireCouponPopupView;
        this.popupViews[refundCouponPopupView.getID()] = refundCouponPopupView;
        this.popupViews[discountCouponPopupView.getID()] = discountCouponPopupView;
        this.popupViews[registerMonthlyCouponPopupView.getID()] = registerMonthlyCouponPopupView;
        
        var currentPopup = null;
        var historyStack = null;
		var _this = this;

		CouponPopupViewGroupManager.prototype.onInit = function() {
            addEventListener();
		};

		CouponPopupViewGroupManager.prototype.onStart = function(param) {
			ViewGroup.prototype.onStart.call(this);
            historyStack = new ViewHistoryStack();

			startViewGroup(param);
		};
		CouponPopupViewGroupManager.prototype.onStop = function() {
        	 if(currentPopup != null) {
        		 currentPopup.onStop();
             }
        }
		CouponPopupViewGroupManager.prototype.onHide = function() {
			if(currentPopup != null) {
				currentPopup.onHide();
            }

		};

		CouponPopupViewGroupManager.prototype.onShow = function() {
			if(currentPopup != null) {
				currentPopup.onShow();
				sendCompleteDrawEvent();
            }
		};

		CouponPopupViewGroupManager.prototype.onUpdate = function() {
			if(currentPopup != null) {
				currentPopup.onUpdate();
            }
		};

        function startViewGroup(param) {
//        	console.log("startPopupViewGroup:"+param.targetView);
        	
        	switch(param.targetView) {
        	case DefineView.CANCEL_PURCHASE_POPUP_VIEW:
        		currentPopup = cancelPopupView;
        		break;
        	case DefineView.PURCHASE_MONTHLY_COUPON_POPUP_VIEW:
        		currentPopup = purchaseMonthlyCouponPopupView;
        		break;
        		
        	case DefineView.PURCHASE_COUPON_POPUP_VIEW:
        		currentPopup = purchaseCouponPopupView;
        		break;
        	case DefineView.DETAIL_USED_COUPON_POPUP_VIEW:
        		currentPopup = detailUsedCouponPopupView;
        		break;
        	case DefineView.EXPIRE_COUPON_POPUP_VIEW:
        		currentPopup = expireCouponPopupView;
        		break;
        	case DefineView.REFUND_COUPON_POPUP_VIEW:
        		currentPopup = refundCouponPopupView;
        		break;
        	case DefineView.DISCOUNT_COUPON_POPUP_VIEW:
        		currentPopup = discountCouponPopupView;
        		break;
        	case DefineView.REGISTER_MONTHLY_COUPON_POPUP_VIEW:
        		currentPopup = registerMonthlyCouponPopupView;
        		break;
        	}

        	if(currentPopup != null)	{
        		currentPopup.onStart(param);
            	currentPopup.onActive();	
        	}
        }


		function addEventListener() {
			removeEventListener();
			for (var view in _this.popupViews) {
            	$(_this.popupViews[view]).bind(CCAEvent.CHANGE_VIEW, changeViewListener);
            	$(_this.popupViews[view]).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, changeFocusListener);
            	$(_this.popupViews[view]).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
            	$(_this.popupViews[view]).bind(CCAEvent.FINISH_VIEW, finishViewListener);
            	$(_this.popupViews[view]).bind(CCAEvent.FINISH_VIEWGROUP, finishViewGroupListener);
            	$(_this.popupViews[view]).bind(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, finishViewGroupWithResultListener);
            }

		}

		function removeEventListener() {
			for (var view in _this.popupViews) {
            	$(_this.popupViews[view]).unbind();
            }
		}

		function sendCompleteDrawEvent() {
			_this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		}
		function changeViewListener(event, param) {
//            console.log("changeViewListener:"+param);
        }
		function changeViewGroupListener(event, param){
			_this.sendEvent(event, param);
		}
        function finishViewListener(event, param) {
//        	console.log("finishViewListener:"+param);
        	_this.sendEvent(event, param);
        }
        
        function finishViewGroupListener(event, param) {
//        	console.log("FinishViewGroupListener:"+param);
        	_this.sendEvent(event, param);      
        }

        function changeFocusListener(event, param) {
//            console.log("changeFocusListener")
        }
        function finishViewGroupWithResultListener(event, param) {
//			console.log("finishViewGroupWithResultListener:"+param);
			_this.sendEvent(event, param);
		}


        this.onInit();
	};
	CouponPopupViewGroupManager.prototype = Object.create(ViewGroup.prototype);
//  PopupViewGroupManager.prototype = new ViewGroup();


    return CouponPopupViewGroupManager;
});