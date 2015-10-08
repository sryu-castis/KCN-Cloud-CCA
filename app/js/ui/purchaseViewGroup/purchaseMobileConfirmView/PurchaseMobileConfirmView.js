define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent", "cca/DefineView", 
        "ui/purchaseViewGroup/purchaseMobileConfirmView/PurchaseMobileConfirmDrawer", "ui/purchaseViewGroup/purchaseMobileConfirmView/PurchaseMobileConfirmModel",
        "framework/modules/ButtonGroup", "framework/modules/InputField", "service/Communicator", "main/CSSHandler", 'cca/PopupValues', 'cca/type/PlayType', "service/CCAInfoManager"],
        function(STBInfoManager, View, CCAEvent, DefineView, PurchaseMobileConfirmDrawer, PurchaseMobileConfirmModel, ButtonGroup, InputField, Communicator, CSSHandler, PopupValues, PlayType, CCAInfoManager) {

    var PurchaseMobileConfirmView = function() {
        View.call(this, DefineView.PURCHASE_MOBILE_CONFIRM_VIEW);
        
        this.model = new PurchaseMobileConfirmModel();
        this.drawer = new PurchaseMobileConfirmDrawer(this.getID(), this.model);
        var _this = this;

        var maxLimitMinute = 5;
        var timeoutSecond = 10;
        var startTime;
        var timeoutConfirm;

        var isLoading = false;

        PurchaseMobileConfirmView.prototype.onInit = function() {

		};

		PurchaseMobileConfirmView.prototype.onBeforeActive = function() {
		};
		PurchaseMobileConfirmView.prototype.onAfterDeActive = function() {
		};
		PurchaseMobileConfirmView.prototype.onGetData = function (param) {
			setData(param);
            startCheckPurchase();
		};

		function setData(param) {
			var model = _this.model;

			var verticalVisibleSize = 1;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = verticalVisibleSize;
			var horizonMaximumSize = horizonVisibleSize;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
			model.setAsset(param.asset);
            model.setProduct(param.product);
            model.setPurchaseSessionId(param.purchaseSessionId);
            model.setMobilePayment(param.mobilePayment);
            model.setNextPlay(param.isNextPlay)

			model.setButtonGroup(getButtonGroup());
		}

		function getButtonGroup() {
			var buttonGroup = new ButtonGroup(2);
			//Label 설정
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
			buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);

			buttonGroup.setIndex(0);
			return buttonGroup;
		}

		PurchaseMobileConfirmView.prototype.onKeyDown = function(event, param) {
            if(isLoading) {
                return;
            }
			var keyCode = param.keyCode;
			var tvKey = window.TVKeyValue;
			var buttonGroup = _this.model.getButtonGroup();
			switch (keyCode) {
				case tvKey.KEY_UP:
                    _this.keyNavigator.keyUp();
                    _this.drawer.onUpdate();
					break;
				case tvKey.KEY_DOWN:
					_this.keyNavigator.keyDown();
					_this.drawer.onUpdate();
					break;
				case tvKey.KEY_RIGHT:
                    buttonGroup.next();
                    _this.drawer.onUpdate();
					break;
				case tvKey.KEY_LEFT:
					 if(buttonGroup.hasPreviousButton()){
						buttonGroup.previous();
						_this.drawer.onUpdate()
					}
					break;
                case tvKey.KEY_ESC:
				case tvKey.KEY_BACK:
				case tvKey.KEY_EXIT:
                    openCancelPopup();
					break;
				case tvKey.KEY_ENTER:
                    if(timeoutConfirm != null) {
                        clearTimeout(timeoutConfirm);
                    }
                    var buttonLabel = buttonGroup.getFocusedButton().getLabel();
                    switch (buttonLabel) {
                        case CCABase.StringSources.ButtonLabel.CONFIRM:
                            requestConfirmPurchaseBySmartPhone4Button();
                            break;
                        case CCABase.StringSources.ButtonLabel.CANCEL:
                            openCancelPopup();
                            break;
                    }
					break;
				case tvKey.KEY_0:
				case tvKey.KEY_1:
				case tvKey.KEY_2:
				case tvKey.KEY_3:
				case tvKey.KEY_4:
				case tvKey.KEY_5:
				case tvKey.KEY_6:
				case tvKey.KEY_7:
				case tvKey.KEY_8:
				case tvKey.KEY_9:
					break;
				default:
					break;
			}
        }

        function startCheckPurchase(){
            CSSHandler.requestTimeout(CSSHandler.TIME_OF_TIMEOUT_MOBILE_PURCHASE);
            startTime = new Date();
            requestConfirmPurchaseBySmartPhone();
        }

        function checkConfirmPurchase() {
            timeoutConfirm = setTimeout(function(){
                var diffMilSec =  new Date() - startTime ;
                var diffMin = diffMilSec / 1000 / 60;
                console.log("[checkConfirmPurchase] diffMin="+diffMin);
                if(diffMin < maxLimitMinute) {
                    requestConfirmPurchaseBySmartPhone();
                } else {
                    console.log("End timeout checkConfirmPurchase!");
                    if(_this.isActive()) {
                        closePurchaseViewGroup();
                    }
                }
            }, timeoutSecond*1000);
        }

        function requestConfirmPurchaseBySmartPhone() {
            console.log("requestConfirmPurchaseBySmartPhone");
            isLoading = true;
            Communicator.requestConfirmPurchaseBySmartPhone(function(result) {
                isLoading = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    completeConfirmPurchase();
                } else {
                    checkConfirmPurchase();
                    //_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
            }, _this.model.getPurchaseSessionId())
        }

		function requestConfirmPurchaseBySmartPhone4Button() {
            _this.onDeActive();
			Communicator.requestConfirmPurchaseBySmartPhone(function(result){
                _this.onActive();
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    completeConfirmPurchase();
                } else {
                    if(result.resultCode == 282) {
                        _this.model.setConfirmFail(true);
                        _this.drawer.onUpdate();
                    } else {
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode, action:"requestConfirmPurchaseBySmartPhone4Button"});
                    }
                }
            }, _this.model.getPurchaseSessionId())
		}

        function requestCancelPurchaseBySmartPhone() {
            _this.onDeActive();
            Communicator.requestCancelPurchaseBySmartPhone(function (result){
                _this.onActive();
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    closePurchaseViewGroup();
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode, action:"requestCancelPurchaseBySmartPhone"});
                }
            }, _this.model.getPurchaseSessionId())
        }

        PurchaseMobileConfirmView.prototype.onPopupResult = function(param) {
            if (param.popupType != undefined && param.popupType == PopupValues.PopupType.ERROR) {
                switch(param.action) {
                    case "requestConfirmPurchaseBySmartPhone4Button":
                        _this.onShow();
                        _this.onActive();
                        startCheckPurchase();
                        break;
                    case "requestCancelPurchaseBySmartPhone":
                    default:
                        closePurchaseViewGroup();
                        break;
                }
            } else {
                if (param.id == PopupValues.ID.CONFIRM_PURCHASE_CANCEL) {
                    switch(param.result) {
                        case CCABase.StringSources.ButtonLabel.CONFIRM:
                            requestCancelPurchaseBySmartPhone();
                            break;
                        default:
                            _this.onShow();
                            _this.onActive();
                            startCheckPurchase();
                            break;
                    }
                } else if(param.id == PopupValues.ID.ALERT_PURCHASE_COMPLETED){
                    changeToPlay();
                } else {
                    _this.onShow();
                    _this.onActive();
                }
            }
        };

        function completeConfirmPurchase() {
            CSSHandler.requestTimeout(CSSHandler.TIME_OF_TIMEOUT_NORMAL);

            var id = PopupValues.ID.ALERT_PURCHASE_COMPLETED;
            //var popupTitle = _this.model.getBundleProduct() ? _this.model.getBundleProduct().getProductName() : _this.model.getAsset().getTitle();
            var popupTitle =  _this.model.getAsset().getTitle();
            PopupValues[id].headText= popupTitle + CCABase.StringSources.alertPurchaseCompletedHeadText;

            var isNextPlay = _this.model.isNextPlay();
            if(isNextPlay) {
                var countOfNextWatch = CCAInfoManager.getCountOfNextWatch() + 1;
                CCAInfoManager.setCountOfNextWatch(countOfNextWatch);
                CCAInfoManager.setCountOfNextWatchToSTB();
            }

            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
        }

        function changeToPlay() {
            var param = {};
            param.asset =  _this.model.getAsset();
            param.product = _this.model.getProduct();
            param.coupon = null;
            param.offset = 0;

            //param.paymentType = _this.model.getPaymentType();
            param.playType = PlayType.NORMAL;
            param.targetView = DefineView.PLAYER_VIEW;

            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
        }

        //function requestAssetInfo(assetID) {
        //    var assetProfile = 9;
        //    Communicator.requestAssetInfo(callBackForRequestAssetInfo, assetID, assetProfile);
        //}
        //
        //function callBackForRequestAssetInfo(response) {
        //    if(Communicator.isSuccessResponseFromHAS(response)) {
        //        _this.model.setAsset(response.asset);
        //        changeToPlay();
        //    }
        //}


        function openCancelPopup() {
            CSSHandler.requestTimeout(CSSHandler.TIME_OF_TIMEOUT_NORMAL);
            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.CONFIRM_PURCHASE_CANCEL});
		}

        function closePurchaseViewGroup() {
            CSSHandler.requestTimeout(CSSHandler.TIME_OF_TIMEOUT_NORMAL);
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
        }

		this.onInit();
	};

	PurchaseMobileConfirmView.prototype = Object.create(View.prototype);

	return PurchaseMobileConfirmView;
});
