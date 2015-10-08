define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent", "cca/DefineView", 
        "ui/couponPopupViewGroup/registerMonthlyCouponPopupView/RegisterMonthlyCouponPopupDrawer", "ui/couponPopupViewGroup/registerMonthlyCouponPopupView/RegisterMonthlyCouponPopupModel", 
        "framework/modules/ButtonGroup", "framework/modules/InputField", "service/Communicator", 
        'main/CSSHandler', 'cca/type/PlayType', 'cca/type/PaymentType', 'cca/PopupValues', 'service/CouponManager', 'helper/UIHelper'],
        function(STBInfoManager, View, CCAEvent, DefineView, RegisterMonthlyCouponPopupDrawer, RegisterMonthlyCouponPopupModel, 
        		ButtonGroup, InputField, Communicator, CSSHandler, PlayType, PaymentType, PopupValues, CouponManager, UIHelper) {

    var RegisterMonthlyCouponPopupView = function() {
        View.call(this, "registerMonthlyCouponPopupView");
        this.model = new RegisterMonthlyCouponPopupModel();
        this.drawer = new RegisterMonthlyCouponPopupDrawer(this.getID(), this.model);
        var _this = this;

        RegisterMonthlyCouponPopupView.prototype.onInit = function() {

		};
		RegisterMonthlyCouponPopupView.prototype.onBeforeStart = function() {
			this.transactionId = $.now() % 1000000;
			_this = this;
		}

		RegisterMonthlyCouponPopupView.prototype.onGetData = function (param) {
			setData(param);
			
		};
		RegisterMonthlyCouponPopupView.prototype.onBeforeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(true);
		};
		RegisterMonthlyCouponPopupView.prototype.onAfterDeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
		RegisterMonthlyCouponPopupView.prototype.onAfterStop = function() {
			CSSHandler.activateNumberKeys(false);
		};
		
		function changeToSuccessPurchasePopup(couponProductName, subtext) {
//			console.log("changeToSuccessPurchasePopup:"+couponProductName+", "+subtext);
			var id = PopupValues.ID.ALERT_REGISTER_MONTHLY_COUPON_COMPLETED;
			PopupValues[id].headText = couponProductName +  CCABase.StringSources.alertRegisterMonthlyCouponCompletedHeadText;
			PopupValues[id].subText = subtext;
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
		}
		function requestSVODChannelConfirmByCoupon() {
			  var couponProductId = _this.model.getCouponProductId();
			  var productCode = _this.model.getProductCode();
//			  console.log("requestSVODChannelConfirmByCoupon:"+couponProductId+", "+productCode);
			  Communicator.requestSVODChannelConfirmByCoupon(callbackForRequestSVODChannelConfirmByCoupon, _this.transactionId, couponProductId, productCode);
		}
		function callbackForRequestSVODChannelConfirmByCoupon(response) {
//			console.log("callbackForRequestSVODChannelConfirmByCoupon:"+response.resultCode);
			if(Communicator.isSuccessResponseFromHAS(response)) {
				 changeToSuccessPurchasePopup(_this.model.getNotice1(), _this.model.getNotice4()); 
			} else {
				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
			}
		}
		function setData(param) {
			var model = _this.model;

			model.setNotice1(param.notice_1);
			model.setNotice2(param.notice_2.replace(/\n/g, "<br>"));
			model.setNotice3(param.notice_3.replace(/\n/g, "<br>"));
			model.setNotice4(param.notice_4.replace(/\n/g, "<br>"));
			model.setCouponProductId(param.couponProductId);
			model.setProductCode(param.productCode);

			var verticalVisibleSize = 2;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = verticalVisibleSize;
			var horizonMaximumSize = horizonVisibleSize;
			model.setSubSpanClass("normal"); 
			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
			model.setButtonGroup(getButtonGroup());
			model.setInputField(getInputField());
			model.setVIndex(0);
		};
		
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
				_this.model.setVIndex(RegisterMonthlyCouponPopupView.STATE_BUTTONGROUP);
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
				_this.model.setVIndex(RegisterMonthlyCouponPopupView.STATE_INPUTFIELD);
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
			_this.model.setVIndex(RegisterMonthlyCouponPopupView.STATE_INPUTFIELD);
			var param = {};
			param.targetGroup = DefineView.MY_TV_VIEWGROUP;
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP, param);	 
		}

		RegisterMonthlyCouponPopupView.prototype.onKeyDown = function (event, param) {
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
						if(buttonGroup.hasPreviousButton()) {
							buttonGroup.previous();
							_this.drawer.onUpdate();
						}
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
			CSSHandler.isCorrectPurchasePIN(_this.model.getInputField().getInputText(), callBackForCheckPurchasePIN);
		}

		function callBackForCheckPurchasePIN(isSuccess) {
			if(isSuccess) {
//				console.error("do register 월정액");
//				closePopup();
				requestSVODChannelConfirmByCoupon();
			} else {
				_this.model.getInputField().inValidText();
			}
		}

		function isInputFieldState() {
			return _this.model.getVIndex() == RegisterMonthlyCouponPopupView.STATE_INPUTFIELD;
		}

		function isButtonGroupState() {
			return _this.model.getVIndex() == RegisterMonthlyCouponPopupView.STATE_BUTTONGROUP;
		}

		this.onInit();
	};

	RegisterMonthlyCouponPopupView.prototype = Object.create(View.prototype);
	RegisterMonthlyCouponPopupView.STATE_INPUTFIELD = 0;
	RegisterMonthlyCouponPopupView.STATE_BUTTONGROUP = 1;

	return RegisterMonthlyCouponPopupView;
});
