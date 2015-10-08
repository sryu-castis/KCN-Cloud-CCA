define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack",
		'main/CSSHandler', "service/Communicator", "service/CCAInfoManager",
		'ui/purchaseViewGroup/selectProductView/SelectProductView', 'ui/purchaseViewGroup/selectPaymentView/SelectPaymentView',
		'ui/purchaseViewGroup/purchaseCouponConfirmView/PurchaseCouponConfirmView',
		'ui/purchaseViewGroup/purchaseProductConfirmView/PurchaseProductConfirmView',
		'ui/purchaseViewGroup/purchaseMonthlyCouponConfirmView/PurchaseMonthlyCouponConfirmView',
        'ui/purchaseViewGroup/purchaseMobileView/PurchaseMobileView',
        'ui/purchaseViewGroup/purchaseMobileConfirmView/PurchaseMobileConfirmView',
		'cca/type/ProductType', 'cca/type/PaymentType', 'cca/PopupValues',  'cca/DefineView', "service/CouponManager"
        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, CSSHandler, Communicator, CCAInfoManager,
    		SelectProductView, SelectPaymentView, PurchaseCouponConfirmView, PurchaseProductConfirmView, PurchaseMonthlyCouponConfirmView,
            PurchaseMobileView, PurchaseMobileConfirmView,
    	ProductType, PaymentType, PopupValues, DefineView, CouponManager) {

    var PurchaseViewGroupManager = function(id) {
        ViewGroup.call(this, id);
        var historyStack = null;
		var selectProductView = new SelectProductView();
		var selectPaymentView = new SelectPaymentView();
		var purchaseCouponConfirmView = new PurchaseCouponConfirmView();
		var purchaseProductConfirmView = new PurchaseProductConfirmView();
		var purchaseMonthlyCouponConfirmView = new PurchaseMonthlyCouponConfirmView();
        var purchaseMobileView = new PurchaseMobileView();
        var purchaseMobileConfirmView = new PurchaseMobileConfirmView();
		var svodPurchaseConfirmView = null;
		var currentView = null;
		var _this = this;

		PurchaseViewGroupManager.prototype.onInit = function() {
            addEventListener();
		};

		PurchaseViewGroupManager.prototype.onStart = function(param) {
			ViewGroup.prototype.onStart.call(this);
            historyStack = new ViewHistoryStack();
			CouponManager.requestTVPointBalance();
			startViewGroup(param);
		};
        PurchaseViewGroupManager.prototype.onStop = function() {
            if(currentView != null) {
                //currentView.onDeActive();
                currentView.onStop();
            }
        }
		PurchaseViewGroupManager.prototype.onHide = function() {
            if(currentView != null) {
                currentView.onHide();
            }
		}
		PurchaseViewGroupManager.prototype.onShow = function() {
			//@ 쿠폰 밸런스의 값을 업데이트해주기 위하여 업데이트를 호출하여 다시그림
            if(currentView != null) {
                currentView.onUpdate();
                currentView.onShow();
                currentView.onActive();
				sendCompleteDrawEvent();
            }
		}
		PurchaseViewGroupManager.prototype.onPopupResult = function(param) {
            if(param.id == PopupValues.ID.ALERT_LIMITED_PURCHASE) {
                _this.onShow();
                purchaseViewFinishEventListener();
            } else if(isTVPointPopup(param.id)) {
                _this.onShow();
				if (CCABase.StringSources.ButtonLabel.RECHARGE == param.result || CCABase.StringSources.ButtonLabel.CONFIRM == param.result) {
					CSSHandler.runThirdApp(CSSHandler.APP_ID_TVPOINT);
				}
			} else if(isPurchaseSuccessPopup(param.id) || isCouponPurchasedSuccessPopup(param.id)) {
                _this.onShow();
				currentView.onPopupResult(param);
			} else if(isCurrentMobilePurchaseView()) {
                currentView.onPopupResult(param);
            } else {
                _this.onShow();
			}
		}

		function isTVPointPopup(popupID) {
			return popupID == PopupValues.ID.ALERT_LACK_OF_TVPOINT || popupID == PopupValues.ID.ALERT_REGISTER_TVPOINT;
		}

		function isPurchaseSuccessPopup(popupID) {
			return popupID == PopupValues.ID.ALERT_PURCHASE_MONTHLY_COMPLETED || popupID == PopupValues.ID.ALERT_PURCHASE_COMPLETED;
		}
		function isCouponPurchasedSuccessPopup(popupID)	{
			return popupID == PopupValues.ID.ALERT_PURCHASE_COUPON_COMPLETED || popupID == PopupValues.ID.ALERT_PURCHASE_MONTHLY_COUPON_COMPLETED;
		}

        function isCurrentMobilePurchaseView() {
            return currentView == purchaseMobileView || currentView == purchaseMobileConfirmView;
        }


        function startViewGroup(param) {
            Communicator.requestAvailablePaymentType(function(result){
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    CCAInfoManager.setAvailablePaymentTypeList(result.paymentTypeList);
                }
                if(CCAInfoManager.isMobileUser()) {
                    var product = getRVODProduct(param.asset);
                    if(product != null) {
                        currentView = purchaseMobileView;
                        currentView.onStart(param);
                        currentView.onActive();
                    } else {
                        currentView = null;
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.ALERT_LIMITED_PURCHASE});
                    }
                } else {
                    currentView = findFirstVisibleView(param.asset, param.product, param.bundleProduct); // original
                    if(currentView == purchaseProductConfirmView) { //SVOD 일때
                        param.paymentType = PaymentType.Monthly;
                    }
                    currentView.onStart(param);
                    currentView.onActive();
                }
            });
        }

		function findFirstVisibleView(asset, product, bundleProduct) {
			if(bundleProduct != undefined) {
				return selectPaymentView;
			} else if(asset.getProductList().length > 1) {
                return selectProductView;
			} else {
				if(product == null) {
					product = asset.getProductList()[0];
				}

				if(isSVODProduct(product)) {
					return purchaseProductConfirmView;
				} else {
					return selectPaymentView;
				}
			}
		}

        function getRVODProduct(asset) {
            if(asset != undefined && asset != null) {
                for (var i = 0; i < asset.getProductList().length; i++) {
                    var product = asset.getProductList()[i];
                    if (isRVODProduct(product)) {
                        return product;
                    }
                }
            }
            return null;
        }

		function isSVODProduct(product) {
			return product != undefined && product != null && ProductType.SVOD == product.getProductType();
		}

        function isRVODProduct(product) {
            return product != undefined && product != null && ProductType.RVOD == product.getProductType();
        }

        function isBundleProduct(product) {
            return product != undefined && product != null && ProductType.BUNDLE == product.getProductType();
        }

		function addEventListener() {
			removeEventListener();
			$(selectProductView).bind(CCAEvent.FINISH_VIEW, purchaseViewFinishEventListener);
			$(selectProductView).bind(CCAEvent.CHANGE_VIEW, selectProductViewChangeViewListener);
			$(selectProductView).bind(CCAEvent.CHANGE_VIEWGROUP, selectProductViewGroupChangeListener);

			$(selectPaymentView).bind(CCAEvent.FINISH_VIEW, purchaseViewFinishEventListener);
			$(selectPaymentView).bind(CCAEvent.CHANGE_VIEW, selectPaymentViewChangeViewListener);
			$(selectPaymentView).bind(CCAEvent.CHANGE_VIEWGROUP, selectPaymentViewGroupChangeListener);

			$(purchaseCouponConfirmView).bind(CCAEvent.FINISH_VIEW, purchaseViewFinishEventListener);
			$(purchaseCouponConfirmView).bind(CCAEvent.CHANGE_VIEWGROUP, purchaseMonthlyCouponConfirmViewGroupChangeListener);

			$(purchaseProductConfirmView).bind(CCAEvent.FINISH_VIEW, purchaseViewFinishEventListener);
			$(purchaseProductConfirmView).bind(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, purchaseViewFinishWithResultEventListener);
			$(purchaseProductConfirmView).bind(CCAEvent.CHANGE_VIEWGROUP, purchaseConfirmViewGroupChangeListener);

			$(purchaseMonthlyCouponConfirmView).bind(CCAEvent.FINISH_VIEW, purchaseViewFinishEventListener);
			$(purchaseMonthlyCouponConfirmView).bind(CCAEvent.CHANGE_VIEWGROUP, purchaseMonthlyCouponConfirmViewGroupChangeListener);

            $(purchaseMobileView).bind(CCAEvent.FINISH_VIEW, purchaseViewFinishEventListener);
            $(purchaseMobileView).bind(CCAEvent.CHANGE_VIEW,  purchaseMobileViewChangeViewListener);
            $(purchaseMobileView).bind(CCAEvent.CHANGE_VIEWGROUP, purchaseConfirmViewGroupChangeListener);
            $(purchaseMobileView).bind(CCAEvent.FINISH_VIEWGROUP, firstPurchaseViewFinishEventListener);

            $(purchaseMobileConfirmView).bind(CCAEvent.FINISH_VIEW, purchaseViewFinishEventListener);
            $(purchaseMobileConfirmView).bind(CCAEvent.CHANGE_VIEW, purchaseMobileViewChangeViewListener);
            $(purchaseMobileConfirmView).bind(CCAEvent.CHANGE_VIEWGROUP, purchaseConfirmViewGroupChangeListener);
            $(purchaseMobileConfirmView).bind(CCAEvent.FINISH_VIEWGROUP, firstPurchaseViewFinishEventListener);

		}

		function removeEventListener() {
			$(selectProductView).unbind();
			$(selectPaymentView).unbind();
			$(purchaseCouponConfirmView).unbind();
			$(purchaseProductConfirmView).unbind();
			$(purchaseMonthlyCouponConfirmView).unbind();
            $(purchaseMobileView).unbind();
            $(purchaseMobileConfirmView).unbind();
		}

		function sendCompleteDrawEvent() {
			_this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		}

        function purchaseMobileViewChangeViewListener(event, param) {
            historyStack.push({'view':currentView});
            switch (param.targetView) {
                case DefineView.PURCHASE_MOBILE_VIEW:
                    currentView = purchaseMobileView;
                    break;
                case DefineView.PURCHASE_MOBILE_CONFIRM_VIEW:
                    currentView = purchaseMobileConfirmView;
                    break;
            }
            currentView.onStart(param);
            currentView.onActive();
        }

		function selectProductViewChangeViewListener(event, param) {
            historyStack.push({'view':currentView});

            if(isSVODProduct(param.product)) {
                currentView = purchaseProductConfirmView;
            } else {
                currentView = selectPaymentView;
            }

            currentView.onStart(param);
            currentView.onActive();
		}

		function selectPaymentViewChangeViewListener(event, param) {
			historyStack.push({'view':currentView});
			switch (param.targetView) {
				case DefineView.PURCHASE_MONTHLY_COUPON_POPUP_VIEW:
					currentView = purchaseMonthlyCouponConfirmView;
					break;
				case DefineView.PURCHASE_COUPON_POPUP_VIEW:
					currentView = purchaseCouponConfirmView;
					break;
				case DefineView.PURCHASE_CONFIRM_VIEW:
					currentView = purchaseProductConfirmView;
					break;
			}
			currentView.onStart(param);
			currentView.onActive();
		}

		function selectProductViewGroupChangeListener(event, param) {
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}

		function selectPaymentViewGroupChangeListener(event, param) {
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}

		function purchaseMonthlyCouponConfirmViewGroupChangeListener(event, param) {
			backToLastView();
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}

		function purchaseViewFinishEventListener(event, param) {
            if(currentView != null) {
                currentView.onDeActive();
            }
			if(historyStack.getSize() > 0) {
				backToLastView();
			} else {
				firstPurchaseViewFinishEventListener();
			}
		}

		function backToLastView() {
			//var lastView = currentView;
			//lastView.onStop();
			currentView = historyStack.pop().view;
			currentView.onUpdate();
			currentView.onActive();
		}

		function purchaseViewFinishWithResultEventListener(event, param) {
			if(currentView != null) {
                currentView.onHide();
            }
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, param);
		}

		function firstPurchaseViewFinishEventListener(event, param) {
            if(currentView != null) {
                currentView.onHide();
            }
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
		}

		function purchaseConfirmViewGroupChangeListener(event, param) {
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}

        this.onInit();
	};
	PurchaseViewGroupManager.prototype = Object.create(ViewGroup.prototype);


    return PurchaseViewGroupManager;
});
