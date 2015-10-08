define(["service/STBInfoManager", "framework/View", "framework/event/CCAEvent", "cca/DefineView", 
        "ui/popupViewGroup/rcpUnjoinPopupView/RcpUnjoinPopupDrawer", "ui/popupViewGroup/rcpUnjoinPopupView/RcpUnjoinPopupModel", 
        "framework/modules/ButtonGroup", "framework/modules/InputField", "service/Communicator", 'main/CSSHandler'],
        function(STBInfoManager, View, CCAEvent, DefineView, RcpUnjoinPopupDrawer, RcpUnjoinPopupModel, ButtonGroup, InputField, Communicator, CSSHandler) {

    var RcpUnjoinPopupView = function() {
        View.call(this, DefineView.RCP_UNJOIN_POPUP_VIEW);
        this.model = new RcpUnjoinPopupModel();
        this.drawer = new RcpUnjoinPopupDrawer(this.getID(), this.model);
        var _this = this;



        RcpUnjoinPopupView.prototype.onInit = function() {

		};

		RcpUnjoinPopupView.prototype.onBeforeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(true);
		};
		RcpUnjoinPopupView.prototype.onAfterDeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
		RcpUnjoinPopupView.prototype.onAfterStop = function() {
			CSSHandler.activateNumberKeys(false);
		};

		RcpUnjoinPopupView.prototype.onStart = function() {
			_this = this;
			View.prototype.onStart.apply(this, arguments);
		};

		RcpUnjoinPopupView.prototype.onGetData = function (param) {
			_this.model.setParam(param);
			setData(param.productInfo);
		};

		function setData(productInfo) {
			var model = _this.model;

			model.setData(productInfo);
			
			
			var verticalVisibleSize = 2;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = verticalVisibleSize;
			var horizonMaximumSize = horizonVisibleSize;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
			model.setButtonGroup(getButtonGroup());
			model.setInputField(getInputField());
			model.setHeadText(productInfo.getProductName())
			model.setVIndex(RcpUnjoinPopupView.STATE_INPUTFIELD);
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
				_this.model.setVIndex(RcpUnjoinPopupView.STATE_BUTTONGROUP);
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
				_this.model.setVIndex(RcpUnjoinPopupView.STATE_INPUTFIELD);
				_this.model.getInputField().setDefaultText(CCABase.StringSources.failPasswordText);

				buttonGroup.getButton(0).onDeActive();
				buttonGroup.setIndex(1);

				_this.model.setBodyLineClass("error");
				_this.drawer.onUpdate();
			});
			return inputField;
		}

		function closePopup()	{
			_this.model.getInputField().setInputText("");
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, _this.model.getParam());
		}

		function closePopupWithResult()	{
			var returnParam = _this.model.getParam();
			var buttonGroup = _this.model.getButtonGroup();
			returnParam.result = buttonGroup.getFocusedButton().getLabel();
			_this.model.getInputField().setInputText("");
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
		}
		
		RcpUnjoinPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
			var inputField = _this.model.getInputField();
			var buttonGroup = _this.model.getButtonGroup();
            switch (keyCode) {
                case tvKey.KEY_ESC:
            	case tvKey.KEY_BACK:
				case tvKey.KEY_EXIT:
            		closePopup();
            		break;
				case tvKey.KEY_219:
					if(isInputFieldState()) {
						if(isEmptyInputFieldText()) {
						} else {
							inputField.removeText();
							_this.drawer.onUpdate();
						}
            		}
					break;
                case tvKey.KEY_LEFT:
					if(isInputFieldState()) {
						if(isEmptyInputFieldText()) {
							//closePopup();
						} else {
							inputField.removeText();
							_this.drawer.onUpdate();
						}
					} else {
						if(buttonGroup.hasPreviousButton()) {
							buttonGroup.previous();
							_this.drawer.onUpdate();
						}
						//else {
						//	closePopup();
						//}
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

		function isInputFieldState() {
			return _this.model.getVIndex() == RcpUnjoinPopupView.STATE_INPUTFIELD;
		}

		function isButtonGroupState() {
			return _this.model.getVIndex() == RcpUnjoinPopupView.STATE_BUTTONGROUP;
		}

		function isEmptyInputFieldText() {
			var inputField = _this.model.getInputField();
			return inputField.getSize() == 0;
		}


		function checkPincode() {
			CSSHandler.isCorrectPurchasePIN(_this.model.getInputField().getInputText(), callBackForCheckPurchasePIN);
		}

		function callBackForCheckPurchasePIN(isSuccess) {
			if(isSuccess) {
				closePopupWithResult();
			} else {
				_this.model.getInputField().inValidText();
			}
		}

		this.onInit();
	};

	RcpUnjoinPopupView.prototype = Object.create(View.prototype);
	RcpUnjoinPopupView.STATE_INPUTFIELD = 0;
	RcpUnjoinPopupView.STATE_BUTTONGROUP = 1;

	return RcpUnjoinPopupView;
});
