define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent", "cca/DefineView", 
        "ui/purchaseViewGroup/purchaseProductConfirmView/PurchaseProductConfirmDrawer", "ui/purchaseViewGroup/purchaseProductConfirmView/PurchaseProductConfirmModel", 
        "framework/modules/ButtonGroup", "framework/modules/InputField", "service/Communicator", 'service/PurchaseManager',
        'main/CSSHandler', 'cca/type/PlayType', 'cca/type/PaymentType', 'cca/PopupValues', 'service/CouponManager', 'helper/UIHelper', "service/CCAInfoManager"],
        function(STBInfoManager, View, CCAEvent, DefineView, PurchaseProductConfirmDrawer, PurchaseProductConfirmModel, 
        		ButtonGroup, InputField, Communicator, PurchaseManager, CSSHandler, PlayType, PaymentType, PopupValues, CouponManager, UIHelper,CCAInfoManager) {

    var PurchaseProductConfirmView = function() {
        View.call(this, DefineView.PURCHASE_PRODUCT_CONFIRM_VIEW);
        this.model = new PurchaseProductConfirmModel();
        this.drawer = new PurchaseProductConfirmDrawer(this.getID(), this.model);
        var _this = this;



        PurchaseProductConfirmView.prototype.onInit = function() {

		};
		PurchaseProductConfirmView.prototype.onBeforeStart = function() {
			this.transactionId = $.now() % 1000000;
			_this = this;
		}
		PurchaseProductConfirmView.prototype.onAfterStart = function() {
			//_this.hideTimerContainer();
		};
		PurchaseProductConfirmView.prototype.onGetData = function (param) {
			setData(param);
		};
		PurchaseProductConfirmView.prototype.onBeforeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(true);
		};
		PurchaseProductConfirmView.prototype.onAfterDeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
		PurchaseProductConfirmView.prototype.onAfterStop = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};

		PurchaseProductConfirmView.prototype.onPopupResult = function(param) {
			if(param.popupType == PopupValues.PopupType.ERROR) {
				closePopup();
			} else if(param.id == PopupValues.ID.ALERT_PURCHASE_MONTHLY_COMPLETED || param.id == PopupValues.ID.ALERT_PURCHASE_COMPLETED){
				if(_this.model.getPlayAfterPurchase() == false) {
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, {'product': _this.model.getProduct(), 'needReloadHistory': !_this.model.getPlayAfterPurchase()});
				} else {
					if(_this.model.getBundleProduct() != null) {
						var assetID =  _this.model.getBundleProduct().getBundleAssetList()[0].getAssetID();
						requestAssetInfo(assetID)
					} else {
						changeToPlay();
					}
				}
				
			}
		}

		function setData(param) {
			var model = _this.model;

			model.setPlayAfterPurchase(param.playAfterPurchase);
			model.setProduct(param.product);
			model.setAsset(param.asset);
			model.setCoupon(param.coupon);
			model.setIsAgreeForEvent(param.isAgreeForEvent);
			model.setBundleProduct(param.bundleProduct);
			model.setNextPlay(param.isNextPlay)

			var verticalVisibleSize = 2;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = verticalVisibleSize;
			var horizonMaximumSize = horizonVisibleSize;
			model.setSubSpanClass("normal"); // TODO 나중에 적정한 곳으로 normal과 error를 빼도록 하자
			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
			model.setButtonGroup(getButtonGroup());
			model.setInputField(getInputField());
			model.setVIndex(0);
			model.setPaymentType(param.paymentType);
			model.setStyleValues(param.paymentType); // cash, coupon, point, monthly
			if(model.getStyleValues() == PaymentType.Monthly){
				requestProductInstruction();
			}
			var productPrice = UIHelper.getProductPriceWithVAT(model.getProduct().getPrice());
			if(model.getStyleValues() == PaymentType.Coupon && CouponManager.getTotalMoneyBalance() < productPrice)	{ // coupon 이 부족한 경우
				model.setStyleValues(PaymentType.Complex);
				model.setPaymentType(PaymentType.Complex);
			}
			if(model.getStyleValues() == PaymentType.Normal && model.getCoupon() != null)	{
				model.setStyleValues(PaymentType.Discount);
			}
		};
		
		function requestProductInstruction() {
			var transactionId = ++_this.transactionId;
        	Communicator.requestProductInstruction(callBackForProductInstruction, transactionId, _this.model.getProduct().getProductID(), _this.model.getProduct().getGoodId());
        }
        function callBackForProductInstruction(response) {
             if(Communicator.isCorrectTransactionID(_this.transactionId, response)) {
            	 if(Communicator.isSuccessResponseFromHAS(response)) {
					 if(STBInfoManager.isB2B()) {
						 var index = response.secondPopupString.indexOf("\\n");
						 if(index > 0) {
							 var subText = response.secondPopupString.slice(0, index - 1).replace(/\r/g, "<br>")
						 } else {
							 var subText =response.secondPopupString.replace(/\r/g, "<br>");
						 }
					 } else {
						 var subText =response.secondPopupString.replace(/\r/g, "<br>");
					 }
     				_this.model.setSubText(subText);
     				_this.drawer.onUpdate();
     			} else {
     				console.error("Failed to get datas from has.");
//                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.popupViewGroup, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
     			} 
             }
			
		} 
		function getButtonGroup() {
			var buttonGroup = new ButtonGroup(2);
			//Label 설정
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
			buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);

			//최초 설정
			buttonGroup.getButton(0).onDeActive();
			buttonGroup.setIndex(1);
			return buttonGroup;
		}
		function getInputField() {
			var buttonGroup = _this.model.getButtonGroup();

			var inputField = new InputField();
			inputField.setDefaultText(CCABase.StringSources.inputPurchasePasswordText);

			$(inputField).bind(InputField.FULL_TEXT_EVENT, function () {
				_this.model.setVIndex(PurchaseProductConfirmView.STATE_BUTTONGROUP);
				buttonGroup.getButton(0).onActive();
				buttonGroup.setIndex(0);
				_this.drawer.onUpdate();
			});
			$(inputField).bind(InputField.INIT_TEXT_EVENT, function () {
				buttonGroup.getButton(0).onDeActive();
				buttonGroup.setIndex(1);
				_this.drawer.onUpdate();
			});
			$(inputField).bind(InputField.INVALID_TEXT_EVENT, function () {
				_this.model.setVIndex(PurchaseProductConfirmView.STATE_INPUTFIELD);
				_this.model.getInputField().setDefaultText(CCABase.StringSources.failPasswordText);
				_this.model.setSubSpanClass("error");// TODO 나중에 적정한 곳으로 normal과 error를 빼도록 하자
				buttonGroup.getButton(0).onDeActive();
				buttonGroup.setIndex(1);

				_this.drawer.onUpdate();
			});
			return inputField;
		}

		function closePopup()	{
			_this.model.getInputField().initText();
			_this.model.setVIndex(PurchaseProductConfirmView.STATE_INPUTFIELD);
			var param = {};
			param.asset = _this.model.getAsset();
			param.product = _this.model.getProduct();
			param.coupon = _this.model.getCoupon();
			_this.sendEvent(CCAEvent.FINISH_VIEW, param);	 
		}

		PurchaseProductConfirmView.prototype.onKeyDown = function (event, param) {
			var keyCode = param.keyCode;
			var tvKey = window.TVKeyValue;
			var inputField = _this.model.getInputField();
			var buttonGroup = _this.model.getButtonGroup();

			switch (keyCode) {
				case tvKey.KEY_UP:
					if(isButtonGroupState()) {
						_this.keyNavigator.keyUp();
						inputField.initText();
						_this.drawer.onUpdate();
					}
					break;
				case tvKey.KEY_DOWN:
					_this.keyNavigator.keyDown();
					_this.drawer.onUpdate();
					break;
				case tvKey.KEY_RIGHT:
					if(isButtonGroupState()) {
						buttonGroup.next();
						_this.drawer.onUpdate();
					}
					break;
				case tvKey.KEY_219:
					if(isInputFieldState()) {
						inputField.removeText();
						_this.drawer.onUpdate();
					}
					break;
				case tvKey.KEY_LEFT:
					if(isInputFieldState()) {
						inputField.removeText();
						_this.drawer.onUpdate();
					} else {
						buttonGroup.previous();
						_this.drawer.onUpdate();
					}
					break;
				case tvKey.KEY_BACK:
				case tvKey.KEY_EXIT:
					closePopup();
					break;
				case tvKey.KEY_ENTER:
					if(isButtonGroupState()) {
						var buttonLabel = buttonGroup.getFocusedButton().getLabel();
						switch (buttonLabel) {
							case CCABase.StringSources.ButtonLabel.CONFIRM:
								checkPincode();
								break;
							case CCABase.StringSources.ButtonLabel.CANCEL:
								closePopup();
								break;
						}
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
					if (isInputFieldState()) {
						inputField.addText(keyCode);
						_this.drawer.onUpdate();
					}
					break;
				default:
					break;
			}
		};

		function checkPincode() {
			CSSHandler.isCorrectPurchasePIN(_this.model.getInputField().getInputText(), _this.callBackForCheckPurchasePIN);
		}

        PurchaseProductConfirmView.prototype.callBackForCheckPurchasePIN = function(isSuccess) {
            if(isSuccess) {
                //purchaseProduct();
                //changeToPlay();
                if(_this.model.getPlayAfterPurchase() == false) {
                    var param = {};
                    var asset =  _this.model.getAsset();
                    var product = _this.model.getProduct();
                    var coupon = _this.model.getCoupon();
                    var isAgreeForEvent = _this.model.getIsAgreeForEvent();

                    var paymentType = _this.model.getPaymentType();
                    var playType = PlayType.NORMAL;

					var needRetryPurchase = false;

                    PurchaseManager.setPlayInfo(asset, product, playType, paymentType, coupon, isAgreeForEvent, needRetryPurchase);
                    PurchaseManager.purchase(callBackPurchase);

                } else {
                	changeToPurchaseSuccessPopup();	
                }
				var isNextPlay = _this.model.isNextPlay();
				if(isNextPlay) {
					var countOfNextWatch = CCAInfoManager.getCountOfNextWatch() + 1;
					CCAInfoManager.setCountOfNextWatch(countOfNextWatch);
					CCAInfoManager.setCountOfNextWatchToSTB();
				}
            } else {
                _this.model.getInputField().inValidText();
            }
        }

        function callBackPurchase(response) {
            if(Communicator.isSuccessResponseFromHAS(response)) {
                changeToPurchaseSuccessPopup();
            } else {
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
            }
        }

		function changeToPurchaseSuccessPopup() {
			var currentPaymentType = _this.model.getPaymentType();
			var id = null;
			if(PaymentType.Monthly == currentPaymentType) {
				id = PopupValues.ID.ALERT_PURCHASE_MONTHLY_COMPLETED;
			} else {
				id = PopupValues.ID.ALERT_PURCHASE_COMPLETED;
				var popupTitle = _this.model.getBundleProduct() ? _this.model.getBundleProduct().getProductName() : _this.model.getAsset().getTitle();
				PopupValues[id].headText= popupTitle + CCABase.StringSources.alertPurchaseCompletedHeadText;
			}

			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
		}

		function changeToPlay() {
			var param = {};
			param.asset =  _this.model.getAsset();
			param.product = _this.model.getProduct();
			param.coupon = _this.model.getCoupon();
			param.isAgreeForEvent = _this.model.getIsAgreeForEvent();
			param.offset = 0;

			param.paymentType = _this.model.getPaymentType();
			param.playType = PlayType.NORMAL;
			param.targetView = DefineView.PLAYER_VIEW;

			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}

		function requestAssetInfo(assetID) {
			var assetProfile = 9;
			Communicator.requestAssetInfo(callBackForRequestAssetInfo, assetID, assetProfile);
		}

		function callBackForRequestAssetInfo(response) {
			if(Communicator.isSuccessResponseFromHAS(response)) {
				_this.model.setAsset(response.asset);
				changeToPlay();
			}
		}

		function isInputFieldState() {
			return _this.model.getVIndex() == PurchaseProductConfirmView.STATE_INPUTFIELD;
		}

		function isButtonGroupState() {
			return _this.model.getVIndex() == PurchaseProductConfirmView.STATE_BUTTONGROUP;
		}

		this.onInit();
	};

	PurchaseProductConfirmView.prototype = Object.create(View.prototype);
	PurchaseProductConfirmView.STATE_INPUTFIELD = 0;
	PurchaseProductConfirmView.STATE_BUTTONGROUP = 1;

	return PurchaseProductConfirmView;
});
