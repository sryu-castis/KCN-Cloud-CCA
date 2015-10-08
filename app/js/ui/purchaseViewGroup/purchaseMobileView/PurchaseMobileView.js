define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent", "cca/DefineView", 
        "ui/purchaseViewGroup/purchaseMobileView/PurchaseMobileDrawer", "ui/purchaseViewGroup/purchaseMobileView/PurchaseMobileModel",
        "framework/modules/ButtonGroup", "framework/modules/InputField", "service/Communicator", "main/CSSHandler", 'cca/PopupValues'],
        function(STBInfoManager, View, CCAEvent, DefineView, PurchaseMobileDrawer, PurchaseMobileModel, ButtonGroup, InputField, Communicator, CSSHandler, PopupValues) {

    var PurchaseMobileView = function() {
        View.call(this, DefineView.PURCHASE_MOBILE_VIEW);
        
        this.model = new PurchaseMobileModel();
        this.drawer = new PurchaseMobileDrawer(this.getID(), this.model);
        var _this = this;

        PurchaseMobileView.prototype.onInit = function() {

		};

		PurchaseMobileView.prototype.onBeforeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(true);
		};
		PurchaseMobileView.prototype.onAfterDeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
		PurchaseMobileView.prototype.onAfterStop = function() {
			CSSHandler.activateNumberKeys(false);
		};
		PurchaseMobileView.prototype.onGetData = function (param) {
			var asset = param.asset;
			var product = param.product;
			this.model.setNextPlay(param.isNextPlay)

			setData(asset, product);
		};

		function setData(asset, product) {
			var model = _this.model;

			var verticalVisibleSize = 2;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = verticalVisibleSize;
			var horizonMaximumSize = horizonVisibleSize;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
			model.setAsset(asset);
			model.setButtonGroup(getButtonGroup());
			model.setProduct(getProduct4MobilePurchase(asset, product));
			model.setInputField(getInputField());

		}

        function getProduct4MobilePurchase(asset, product) {
            if(product == null || product == undefined) {
                product = asset.getProductList()[0];
            } else if(Array.isArray(product)) {
                product = product[0];
            }
            return product;
        }

		function getInputField() {
			var buttonGroup = _this.model.getButtonGroup();

			var inputField = new InputField();

            inputField.setSecurityMode(false);
            inputField.setMaximumSize(11);
			inputField.setDefaultText(CCABase.StringSources.initMobileText);

			$(inputField).bind(InputField.FULL_TEXT_EVENT, function () {
				_this.model.setVIndex(PurchaseMobileView.STATE_BUTTON_GROUP);
				buttonGroup.getButton(0).onActive();
				buttonGroup.setIndex(0);
				_this.drawer.onUpdate();
			});
			$(inputField).bind(InputField.INIT_TEXT_EVENT, function () {
				buttonGroup.getButton(0).onDeActive();
				buttonGroup.setIndex(1);
                _this.model.setConfirmFail(false);
				_this.drawer.onUpdate();
			});
            //$(inputField).bind(InputField.INVALID_TEXT_EVENT, function () {
            //    buttonGroup.getButton(0).onDeActive();
            //    buttonGroup.setIndex(1);
            //    _this.drawer.onUpdate();
            //});
			return inputField;
		}

		function getButtonGroup() {
			var buttonGroup = new ButtonGroup(2);
			//Label 설정
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
			buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);

			buttonGroup.getButton(0).onDeActive();
			buttonGroup.setIndex(1);
			return buttonGroup;
		}
		

		PurchaseMobileView.prototype.onKeyDown = function(event, param) {
			var keyCode = param.keyCode;
			var tvKey = window.TVKeyValue;
			var inputField = _this.model.getInputField();
			var buttonGroup = _this.model.getButtonGroup();

			switch (keyCode) {
				case tvKey.KEY_UP:
					if(isButtonGroupState()) {
                        inputField.initText();
						_this.keyNavigator.keyUp();
                        _this.drawer.onUpdate();
					}
					break;
				case tvKey.KEY_DOWN:
                    if(isInputFieldState()) {
                        if(buttonGroup.getButton(0).isActive()){
                            buttonGroup.setIndex(0);
                        }
                        _this.keyNavigator.keyDown();
                        _this.drawer.onUpdate();
                    }
					break;
				case tvKey.KEY_RIGHT:
					if(isButtonGroupState()) {
						buttonGroup.next();
						_this.drawer.onUpdate();
					}
					break;
				case tvKey.KEY_219:
					if(isInputFieldState()) {
						if(isEmptyInputFieldText() == false) {
                            _this.model.setConfirmFail(false);
							inputField.removeText();
                            buttonGroup.getButton(0).onDeActive();
                            buttonGroup.setIndex(1);
							_this.drawer.onUpdate();
						}
					}
					break;
				case tvKey.KEY_LEFT:
					if(isInputFieldState()) {
						if(isEmptyInputFieldText() == false) {
                            _this.model.setConfirmFail(false);
							inputField.removeText();
                            buttonGroup.getButton(0).onDeActive();
                            buttonGroup.setIndex(1);
							_this.drawer.onUpdate();
						}
					} else if(buttonGroup.hasPreviousButton()){
						buttonGroup.previous();
						_this.drawer.onUpdate()
					}
					break;
				case tvKey.KEY_BACK:
				case tvKey.KEY_EXIT:
					sendFinishViewEvent();
					break;
				case tvKey.KEY_ENTER:
					if(isButtonGroupState()) {
						var buttonLabel = buttonGroup.getFocusedButton().getLabel();
						switch (buttonLabel) {
							case CCABase.StringSources.ButtonLabel.CONFIRM:
                                requestStartPurchaseBySmartPhone(inputField.getInputText());
								break;
							case CCABase.StringSources.ButtonLabel.CANCEL:
								sendFinishViewEvent();
								break;
						}
					} else {
                        if(buttonGroup.getButton(0).isActive()){
                            buttonGroup.setIndex(0);
                        }
                        _this.model.setVIndex(1);
                        _this.drawer.onUpdate();
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
					if (isInputFieldState() && validatePhoneNumber(inputField, keyCode)) {
						inputField.addText(keyCode);
                        if(inputField.getInputText().length >= 10) {
                            buttonGroup.getButton(0).onActive();
                        }
						_this.drawer.onUpdate();
					}
					break;
				default:
					break;
			}
        }

        function validatePhoneNumber(inputField, keyCode) {
            var prePhoneNumber = inputField.getInputText();
            if(prePhoneNumber.length < 3) {
                var num = inputField.keySwitch(keyCode);
                switch(prePhoneNumber.length) {
                    case 0:
                        return (num == 0)? true: false;
                    case 1:
                        return (num == 1)? true: false;
                    case 2:
                        return (num == 0)? true: false;
                    default:
                        return false;
                }
            } else {
                return true;
            }
        }

		function isButtonGroupState() {
			return _this.model.getVIndex() == PurchaseMobileView.STATE_BUTTON_GROUP;
		}

		function isInputFieldState() {
			return _this.model.getVIndex() == PurchaseMobileView.STATE_INPUT_FIELD;
		}

		function isEmptyInputFieldText() {
			var inputField = _this.model.getInputField();
			return inputField.getSize() == 0;
		}


		function requestStartPurchaseBySmartPhone(modbileNumber) {
            var asset= _this.model.getAsset();
            var product = _this.model.getProduct();
            _this.onDeActive();
			Communicator.requestStartPurchaseBySmartPhone(callBackForRequestStartPurchaseBySmartPhone
                , modbileNumber
                , asset.getAssetID()
                , product.getProductID()
                , product.getGoodId()
                , product.getListPrice()
                , product.getPrice()
            )
		}

		function callBackForRequestStartPurchaseBySmartPhone(result) {
            _this.onActive();
            if(Communicator.isSuccessResponseFromHAS(result) == true) {
                var asset = _this.model.getAsset();
                var product = _this.model.getProduct();
                var purchaseSessionId = result.purchaseSessionId;
                var mobilePayment = result.mobilePayment;
                _this.sendEvent(CCAEvent.CHANGE_VIEW, {
                    targetView: DefineView.PURCHASE_MOBILE_CONFIRM_VIEW,
                    asset: asset,
                    product: product,
                    purchaseSessionId: purchaseSessionId,
                    mobilePayment: mobilePayment,
					isNextPlay :_this.model.isNextPlay()
                });
            } else if(result.resultCode == 266) {
                _this.model.setConfirmFail(true);
                _this.drawer.onUpdate();
            } else {
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
            }
		}

		function sendFinishViewEvent() {
			_this.sendEvent(CCAEvent.FINISH_VIEW);
		}

        PurchaseMobileView.prototype.onPopupResult = function(param) {
            _this.onShow();
            _this.onActive();
        }

		this.onInit();
	};

	PurchaseMobileView.prototype = Object.create(View.prototype);
	PurchaseMobileView.STATE_INPUT_FIELD = 0;
	PurchaseMobileView.STATE_BUTTON_GROUP = 1;

	return PurchaseMobileView;
});
