define(["framework/View", "framework/event/CCAEvent",
		"ui/menuViewGroup/passwordView/PasswordDrawer", "ui/menuViewGroup/passwordView/PasswordModel",
		"service/CCAInfoManager", "framework/modules/InputField", "framework/modules/ButtonGroup", 'service/STBInfoManager',
		'main/CSSHandler', 'cca/DefineView'
	],
	function (View, CCAEvent, PasswordDrawer, PasswordModel, CCAInfoManager, InputField, ButtonGroup, STBInfoManager, CSSHandler, DefineView) {

		var PasswordView = function () {
			View.call(this, DefineView.PASSWORD_VIEW);
			this.model = new PasswordModel();
			this.drawer = new PasswordDrawer(this.getID(), this.model);
			var _this = this;

			PasswordView.prototype.onInit = function() {

			};

			PasswordView.prototype.onBeforeStart = function() {
				//@ 패스워드뷰를 여러곳에서 new 해서 사용하게 될경우 _this가 이후 생성된 객체를 가리키게 됨으로 onStart시에 해당 객체로 바꾸도록함
				_this = this;
			};

            // category list view에서 number key를 받을 수 있도록 start에서 setting
            PasswordView.prototype.onAfterStart = function() {
                //@숫자 key를 받을 수 있도록 lock 을 해제
                CSSHandler.activateNumberKeys(true);
            };
            PasswordView.prototype.onBeforeStop = function() {
                //@숫자 key를 받을 수 있도록 lock 을 해제
                CSSHandler.activateNumberKeys(false);
            };
			PasswordView.prototype.onAfterStop = function() {
				CSSHandler.activateNumberKeys(false);
			};

			PasswordView.prototype.onGetData = function (param) {
				setData(param.focusedCategory, param.type);
			};

			function setData(category, type) {
				var model = _this.model;

				model.setCurrentCategory(category);

				var verticalVisibleSize = 2;
				var horizonVisibleSize = 1;
				var verticalMaximumSize = verticalVisibleSize;
				var horizonMaximumSize = horizonVisibleSize;

				model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
				model.setButtonGroup(getButtonGroup());
				model.setInputField(getInputField());

				if(type == PasswordView.TYPE_ADULT_PASSWORD) {
					model.setTitleText(CCABase.StringSources.needAdultPassword);
				} else if(type == PasswordView.TYPE_USER_PASSWORD) {
					model.setTitleText(CCABase.StringSources.needUserPassword);
				}
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
				inputField.setDefaultText(CCABase.StringSources.inputPasswordText);

				$(inputField).bind(InputField.FULL_TEXT_EVENT, function () {
					_this.model.setVIndex(PasswordView.STATE_BUTTONGROUP);
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
					_this.model.setVIndex(PasswordView.STATE_INPUTFIELD);
					_this.model.getInputField().setDefaultText(CCABase.StringSources.failPasswordText);

					buttonGroup.getButton(0).onDeActive();
					buttonGroup.setIndex(1);

					_this.drawer.onUpdate();
				});
				return inputField;
			}

			PasswordView.prototype.onKeyDown = function (event, param) {
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
								sendFinishViewEvent();
							} else {
								inputField.removeText();
								_this.drawer.onUpdate();
							}
						} else {
							if(buttonGroup.hasPreviousButton()) {
								buttonGroup.previous();
								_this.drawer.onUpdate();
							} else {
								sendFinishViewEvent();
							}
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
									checkPincode();
									break;
								case CCABase.StringSources.ButtonLabel.CANCEL:
									sendFinishViewEvent();
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
				CSSHandler.isCorrectAdultPIN(_this.model.getInputField().getInputText(), callBackForCheckAdultPin);
			}

			function callBackForCheckAdultPin(isSuccess) {
				if(isSuccess) {
					CCAInfoManager.setAdultConfirm(true);
					_this.sendEvent(CCAEvent.CHANGE_VIEW, {'focusedCategory': _this.model.getCurrentCategory()});
				} else {
					_this.model.getInputField().inValidText();
				}
			}

			function sendFinishViewEvent(type) {
				_this.model.getInputField().initText();
				_this.model.setVIndex(PasswordView.STATE_INPUTFIELD);
				_this.sendEvent(CCAEvent.FINISH_VIEW);
			}

			function isInputFieldState() {
				return _this.model.getVIndex() == PasswordView.STATE_INPUTFIELD;
			}

			function isButtonGroupState() {
				return _this.model.getVIndex() == PasswordView.STATE_BUTTONGROUP;
			}

			function isEmptyInputFieldText() {
				var inputField = _this.model.getInputField();
				return inputField.getSize() == 0;
			}

			this.onInit();
		};

		PasswordView.prototype = Object.create(View.prototype);
		PasswordView.STATE_INPUTFIELD = PasswordDrawer.STATE_INPUTFIELD ;
		PasswordView.STATE_BUTTONGROUP = PasswordDrawer.STATE_BUTTONGROUP;
		PasswordView.TYPE_ADULT_PASSWORD = "lockAdult";
		PasswordView.TYPE_USER_PASSWORD = "lockUser";

		return PasswordView;
	});