define(["framework/View", "framework/event/CCAEvent",
        "ui/popupViewGroup/choicePopupView/ChoicePopupDrawer", "ui/popupViewGroup/choicePopupView/ChoicePopupModel", "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView"],
        function(View, CCAEvent, ChoicePopupDrawer, ChoicePopupModel, ButtonGroup, PopupValues, DefineView) {

    var ChoicePopupView = function() {
        View.call(this, DefineView.CHOICE_POPUP_VIEW);
        this.model = new ChoicePopupModel();
        this.drawer = new ChoicePopupDrawer(this.getID(), this.model);
        var _this = this;

        var cancelClose;
        var timeoutClose;

        ChoicePopupView.prototype.onInit = function() {

        };

        ChoicePopupView.prototype.onStart = function() {
            _this = this;
            View.prototype.onStart.apply(this, arguments);
        };

        ChoicePopupView.prototype.onStop = function() {
            View.prototype.onStop.apply(this);
        };


        ChoicePopupView.prototype.onGetData = function(param) {
        	setData(param);
        };
        
        function setData(param) {

			var model = _this.model;

            model.setParam(param);

            var popupValue = PopupValues[param.id];
			
			var verticalVisibleSize = 1;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = 1;
			var horizonMaximumSize = 1;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);

			model.setIconType(popupValue.iconType);
			model.setTitle(popupValue.title);

            if(popupValue.headText != undefined) {
                model.setHeadTextClass(popupValue.headTextClass)
                model.setHeadText(popupValue.headText);
            }

            if(popupValue.subText != undefined) {
                model.setSubTextClass(popupValue.subTextClass);
                model.setSubText(popupValue.subText);
            }

            if(popupValue.buttonText1 != undefined) {
                model.setButtonText1(popupValue.buttonText1);
            }

            if(popupValue.buttonText2 != undefined) {
                model.setButtonText2(popupValue.buttonText2);
            }

            if(popupValue.buttonText3 != undefined) {
                model.setButtonText3(popupValue.buttonText3);
            }

            model.setButtonGroup(getButtonGroup());

            if(popupValue.timeout != undefined && popupValue.timeout > 0) {

                cancelClose = function() {
                    _this.closePopup();
                }

                timeoutClose = setTimeout(cancelClose, popupValue.timeout*1000);
            }
		};
        
        function getButtonGroup() {
			var buttonGroup = new ButtonGroup(3);
			//Label 설정
            if(_this.model.getButtonText1() != null) {
                buttonGroup.getButton(0).setLabel(_this.model.getButtonText1());
            } else {
                buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
            }

            if(_this.model.getButtonText2() != null) {
                buttonGroup.getButton(1).setLabel(_this.model.getButtonText2());
            } else {
                buttonGroup.getButton(1).setLabel(null);
            }

            if(_this.model.getButtonText3() != null) {
                buttonGroup.getButton(2).setLabel(_this.model.getButtonText3());
            } else {
                buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
            }

			//최초 설정
//			buttonGroup.getButton(0).onDeActive();
			buttonGroup.setIndex(0);

			return buttonGroup;
		}

        function resetTimeoutClose() {
            if(timeoutClose != null) {
                clearTimeout(timeoutClose);
                var param = _this.model.getParam();
                var popupValue = PopupValues[param.id];
                timeoutClose = setTimeout(cancelClose, popupValue.timeout*1000);
            }
        }

        ChoicePopupView.prototype.closePopup = function() {
            var returnParam = _this.model.getParam();
            //var buttonGroup = _this.model.getButtonGroup();
            //returnParam.result = buttonGroup.getButton(2).getLabel();
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
        }

        ChoicePopupView.prototype.closePopupWithResult = function()	{
            var returnParam = _this.model.getParam();
            var buttonGroup = _this.model.getButtonGroup();
            returnParam.result = buttonGroup.getFocusedButton().getLabel();
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
        }

        ChoicePopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var buttonGroup = _this.model.getButtonGroup();
            var returnParam = _this.model.getParam();
            console.log("choicePopupView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_RIGHT:
                    resetTimeoutClose();
            		buttonGroup.next();
					_this.drawer.onUpdate();
					break;
                case tvKey.KEY_LEFT:
                    resetTimeoutClose();
                	if(buttonGroup.hasPreviousButton()) {
						buttonGroup.previous();
						_this.drawer.onUpdate();
					}
                	break;
                case tvKey.KEY_ESC:
                case tvKey.KEY_EXIT:
                case tvKey.KEY_BACK:
                    if(timeoutClose != null) {
                        clearTimeout(timeoutClose);
                    }
                    _this.closePopup();
                    break;
				case tvKey.KEY_ENTER:
                    if(timeoutClose != null) {
                        clearTimeout(timeoutClose);
                    }
                    _this.closePopupWithResult();
                	break;
                case tvKey.KEY_UP:
                	_this.keyNavigator.keyUp();
                	_this.drawer.onUpdate();
                    break;
                case tvKey.KEY_DOWN:
                    _this.keyNavigator.keyDown();
                	_this.drawer.onUpdate();
                    break;
                default:
                    break;
            }
        };
        

//        function getEventParamObjectForGroup(targetGroup) {
//            var model = _this.model;
//            var param = {};
//            param.targetGroup = targetGroup;
//            param.index = model.getVIndex();
//            param.startIndex = model.getVStartIndex();
//            return param;
//        }
        this.onInit();
    };

    ChoicePopupView.prototype = Object.create(View.prototype);
	
    return ChoicePopupView;
});
