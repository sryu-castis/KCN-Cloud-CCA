define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent", "cca/DefineView","cca/PopupValues",
        "ui/popupViewGroup/adultAuthPopupView/AdultAuthPopupDrawer", "ui/popupViewGroup/adultAuthPopupView/AdultAuthPopupModel", 
        "framework/modules/ButtonGroup", "framework/modules/InputField", "service/Communicator", 'main/CSSHandler', 'service/CCAInfoManager'],
        function(STBInfoManager, View, CCAEvent, DefineView, PopupValues, AdultAuthPopupDrawer, AdultAuthPopupModel, ButtonGroup, InputField, Communicator, CSSHandler, CCAInfoManager) {

    var AdultAuthPopupView = function() {
        View.call(this, DefineView.ADULT_AUTH_POPUP_VIEW);
        this.model = new AdultAuthPopupModel();
        this.drawer = new AdultAuthPopupDrawer(this.getID(), this.model);
        var _this = this;

        AdultAuthPopupView.prototype.onInit = function() {
		};

		AdultAuthPopupView.prototype.onBeforeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(true);
		};
		AdultAuthPopupView.prototype.onAfterDeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
		AdultAuthPopupView.prototype.onAfterStop = function() {
			CSSHandler.activateNumberKeys(false);
		};

		AdultAuthPopupView.prototype.onStart = function() {
			_this = this;
			View.prototype.onStart.apply(this, arguments);
		};

		AdultAuthPopupView.prototype.onGetData = function (param) {
			setData(param);
		};

		function setData(param) {
			var model = _this.model;
			var popupValue = PopupValues[param.id];
			model.setParam(param);
			model.setIconType(popupValue.iconType);
			model.setTitle(popupValue.title);
			model.setHeadText(popupValue.headText);
			model.setSubText(popupValue.subText);
			model.setSubSpanClass(popupValue.subSpanClass);
			model.setSubSpanText(popupValue.subSpanText);
			
			var verticalVisibleSize = 2;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = verticalVisibleSize;
			var horizonMaximumSize = horizonVisibleSize;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
			model.setButtonGroup(getButtonGroup());
			model.setInputField(getInputField());
			model.setVIndex(0);
			_this.model.getInputField().initText();
			
		};
		function getInputField() {
			var buttonGroup = _this.model.getButtonGroup();

			var inputField = new InputField();
			inputField.setDefaultText(CCABase.StringSources.inputPasswordText);

			$(inputField).bind(InputField.FULL_TEXT_EVENT, function () {
				_this.model.setVIndex(1);
				buttonGroup.getButton(0).onActive();
				buttonGroup.setIndex(0);
				_this.drawer.onUpdate();
			});
			$(inputField).bind(InputField.INIT_TEXT_EVENT, function () {
				_this.model.setSubSpanClass("impact"); 
				buttonGroup.getButton(0).onDeActive();
				buttonGroup.setIndex(1);
				_this.drawer.onUpdate();
			});
			$(inputField).bind(InputField.INVALID_TEXT_EVENT, function () {
				_this.model.setVIndex(0);
				_this.model.getInputField().setDefaultText(CCABase.StringSources.failPasswordText);
				_this.model.setSubSpanClass("error"); 
				buttonGroup.getButton(0).onDeActive();
				buttonGroup.setIndex(1);

				_this.drawer.onUpdate();
			});
			return inputField;
		}
		function getButtonGroup() {
			var buttonGroup = new ButtonGroup(2);
			//Label 설정
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
			buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
			buttonGroup.setIndex(1);
			return buttonGroup;
		}
		
		function closePopup()	{
			//_this.model.getInputField().initText();
            var returnParam = _this.model.getParam();
            var buttonGroup = _this.model.getButtonGroup();
            returnParam.result = buttonGroup.getButton(1).getLabel();
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
		}
		function closePopupWithResult()	{
			//_this.model.getInputField().initText();
			var returnParam = _this.model.getParam();
			var buttonGroup = _this.model.getButtonGroup();
            returnParam.result = buttonGroup.getFocusedButton().getLabel();
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
		}
		AdultAuthPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var inputField = _this.model.getInputField();
            var buttonGroup = _this.model.getButtonGroup();
            //console.log("AdultAuthPopupView, onKeyDown: " + keyCode +" "+_this.model.getVIndex());
            switch (keyCode) {
            	case tvKey.KEY_BACK:
				case tvKey.KEY_EXIT:
            		closePopup();
            		break;
				case tvKey.KEY_219:
					if(isInputFieldState()) {
                        if(isEmptyInputFieldText() == false) {
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
                case tvKey.KEY_RIGHT:
                    if(isButtonGroupState()) {
                        buttonGroup.next();
                        _this.drawer.onUpdate();
                    }
                    break;
                case tvKey.KEY_ENTER:
                    if(isButtonGroupState()) {// button에 focus
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
                case tvKey.KEY_UP:
                    if(isButtonGroupState()) {// button에 focus
                        _this.keyNavigator.keyUp();
                    	_this.model.getInputField().initText();
                        _this.drawer.onUpdate();
                    }
                    break;
                case tvKey.KEY_DOWN:
                    if(isInputFieldState()) {
                        _this.keyNavigator.keyDown();
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

		function checkPincode() {
			CSSHandler.isCorrectAdultPIN(_this.model.getInputField().getInputText(), callBackForCheckAdultPin);
		}

		function callBackForCheckAdultPin(isSuccess) {
			CCAInfoManager.setAdultConfirm(isSuccess);
			if(isSuccess) {
				closePopupWithResult();
			} else {
				_this.model.getInputField().inValidText();
				_this.model.setSubSpanClass(PopupValues.SubSpanClass.ERROR);
				_this.model.setSubSpanText(CCABase.StringSources.confirmAuthForExtSearchErrorSubText);
				_this.drawer.onUpdate();
			}
		}

        function isButtonGroupState() {
            return _this.model.getVIndex() == AdultAuthPopupView.STATE_BUTTON_GROUP;
        }

        function isInputFieldState() {
            return _this.model.getVIndex() == AdultAuthPopupView.STATE_INPUT_FIELD;
        }

        function isEmptyInputFieldText() {
            var inputField = _this.model.getInputField();
            return inputField.getSize() == 0;
        }

		this.onInit();
	};

	AdultAuthPopupView.prototype = Object.create(View.prototype);
    AdultAuthPopupView.STATE_INPUT_FIELD = 0;
    AdultAuthPopupView.STATE_BUTTON_GROUP = 1;

	return AdultAuthPopupView;
});
