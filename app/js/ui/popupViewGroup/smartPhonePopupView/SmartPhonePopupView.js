define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent", "cca/DefineView","cca/PopupValues",
        "ui/popupViewGroup/smartPhonePopupView/SmartPhonePopupDrawer", "ui/popupViewGroup/smartPhonePopupView/SmartPhonePopupModel", 
        "framework/modules/ButtonGroup", "framework/modules/InputField", "cca/DefineView", "helper/UIHelper", 'main/CSSHandler'],
        function(STBInfoManager, View, CCAEvent, DefineView, PopupValues, SmartPhonePopupDrawer, SmartPhonePopupModel, ButtonGroup, InputField, DefineView, UIHelper, CSSHandler) {

    var SmartPhonePopupView = function() {
        View.call(this, DefineView.SMART_PHONE_POPUP_VIEW);
        this.model = new SmartPhonePopupModel();
        this.drawer = new SmartPhonePopupDrawer(this.getID(), this.model);
        var _this = this;

        SmartPhonePopupView.prototype.onInit = function() {
		};

		SmartPhonePopupView.prototype.onBeforeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(true);
		};
		SmartPhonePopupView.prototype.onAfterDeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
		SmartPhonePopupView.prototype.onAfterStop = function() {
			CSSHandler.activateNumberKeys(false);
		};

		SmartPhonePopupView.prototype.onStart = function() {
			_this = this;
			View.prototype.onStart.apply(this, arguments);
		};

		SmartPhonePopupView.prototype.onGetData = function (param) {
			setData(param);
		};

		function setData(param) {
			var model = _this.model;
			var popupValue = PopupValues[param.id];

			model.setParam(param);
			model.setIconType(popupValue.iconType);
			model.setTitle(popupValue.title);
			model.setHeadTextClass(popupValue.headTextClass);
			model.setHeadText(popupValue.headText);
			model.setSubTextClass(popupValue.subTextClass);
			model.setSubText(popupValue.subText);
			model.setFocusablePhone(popupValue.focusablePhone);

			if(popupValue.buttonText1 != undefined) {
				model.setButtonText1(popupValue.buttonText1);
			}

			if(popupValue.buttonText2 != undefined) {
				model.setButtonText2(popupValue.buttonText2);
			}
			
			var verticalVisibleSize = 2;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = verticalVisibleSize;
			var horizonMaximumSize = horizonVisibleSize;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
			model.setButtonGroup(getButtonGroup());
			model.setInputField(getInputField());

			initIndex();
		};

		function getButtonGroup() {
			var buttonGroup = new ButtonGroup(2);
			//Label 설정
			if(_this.model.getButtonText1() != null) {
				buttonGroup.getButton(0).setLabel(_this.model.getButtonText1());
			} else {
				buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
			}

			if(_this.model.getButtonText2() != null) {
				buttonGroup.getButton(1).setLabel(_this.model.getButtonText2());
			} else {
				buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
			}
			return buttonGroup;
		}

        function getInputField() {
            var buttonGroup = _this.model.getButtonGroup();
            var inputField = new InputField();
            inputField.setSecurityMode(false);
            inputField.setMaximumSize(11);
            $(inputField).bind(InputField.FULL_TEXT_EVENT, function () {
                _this.model.setVIndex(SmartPhonePopupView.STATE_BUTTON_GROUP);
                buttonGroup.getButton(0).onActive();
                buttonGroup.setIndex(0);
                _this.drawer.onUpdate();
            });
            return inputField;
        }

		function initIndex() {

			var model = _this.model;
			var param = model.getParam();
			var inputField = model.getInputField();
			var buttonGroup = model.getButtonGroup();
			var focusablePhone = model.getFocusablePhone();

			if(focusablePhone) {
				model.setVIndex(0);
				buttonGroup.setIndex(1);
				buttonGroup.getButton(0).onDeActive();
			} else {
				model.setVIndex(1);
				buttonGroup.setIndex(0);
				if(param.user != undefined) {
					inputField.setInputText(UIHelper.addHyphenForMobileNumber(param.user.getPhoneNumber()));
				}
				inputField.setActive(false);
			}
		}

		SmartPhonePopupView.prototype.closePopup = function()	{
			_this.model.getInputField().setInputText("");
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, _this.model.getParam());
		}

		SmartPhonePopupView.prototype.closePopupWithResult = function()	{
			var returnParam = _this.model.getParam();
			var buttonGroup = _this.model.getButtonGroup();
            returnParam.result = buttonGroup.getFocusedButton().getLabel();
			returnParam.phoneNumber = UIHelper.addHyphenForMobileNumber(_this.model.getInputField().getInputText());
			_this.model.getInputField().setInputText("");
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
		}

		SmartPhonePopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var inputField = _this.model.getInputField();
			var buttonGroup = _this.model.getButtonGroup();
            switch (keyCode) {
                case tvKey.KEY_ESC:
            	case tvKey.KEY_BACK:
				case tvKey.KEY_EXIT:
                    _this.closePopup();
            		break;
				case tvKey.KEY_219:
					if(isInputFieldState()) {
						_this.model.getInputField().removeText();
                        buttonGroup.getButton(0).onDeActive();
                        buttonGroup.setIndex(1);
						_this.drawer.onUpdate();
            		}
					break;
                case tvKey.KEY_LEFT:
                	if(isButtonGroupState()) {
						if(buttonGroup.hasPreviousButton()) {
							buttonGroup.previous();
							_this.drawer.onUpdate();
						}
                    } else {
						_this.model.getInputField().removeText();
                        buttonGroup.getButton(0).onDeActive();
                        buttonGroup.setIndex(1);
						_this.drawer.onUpdate();
					}
                    break;
                case tvKey.KEY_RIGHT:
                    if(isButtonGroupState()) {
						buttonGroup.next();
                        _this.drawer.onUpdate();
                    }
                    break;
                case tvKey.KEY_ENTER:
                    if(isButtonGroupState()) {
                    	if(buttonGroup.getIndex() == 0){
							_this.closePopupWithResult();
                    	} else{
							_this.closePopup();
                    	}
                    }
                    break;
                case tvKey.KEY_UP:
                    if(isButtonGroupState() && _this.model.getInputField().isActive()) {
                    	_this.model.setVIndex(SmartPhonePopupView.STATE_INPUTFIELD);
                    	//_this.model.getInputField().setInputText("");
                        _this.drawer.onUpdate();
                    }
                    break;
                case tvKey.KEY_DOWN:
                    if(isInputFieldState()) {
						_this.model.setVIndex(SmartPhonePopupView.STATE_BUTTON_GROUP);
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
                	if(isInputFieldState()) {
                    	inputField.addText(keyCode);
                        _this.drawer.onUpdate();
                    }
                	break;
                default:
                    break;
            }
        };

		function isInputFieldState() {
			return _this.model.getVIndex() == SmartPhonePopupView.STATE_INPUTFIELD;
		}

		function isButtonGroupState() {
			return _this.model.getVIndex() == SmartPhonePopupView.STATE_BUTTON_GROUP;
		}


		this.onInit();
	};

	SmartPhonePopupView.prototype = Object.create(View.prototype);
	SmartPhonePopupView.STATE_INPUTFIELD = 0;
	SmartPhonePopupView.STATE_BUTTON_GROUP = 1;

	return SmartPhonePopupView;
});
