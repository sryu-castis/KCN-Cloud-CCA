define(["framework/View", "framework/event/CCAEvent",
        "ui/popupViewGroup/dialogPopupView/DialogPopupDrawer", "ui/popupViewGroup/dialogPopupView/DialogPopupModel", "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView"],
        function(View, CCAEvent, DialogPopupDrawer, DialogPopupModel, ButtonGroup, PopupValues, DefineView) {

    var DialogPopupView = function() {
        View.call(this, DefineView.DIALOG_POPUP_VIEW);
        this.model = new DialogPopupModel();
        this.drawer = new DialogPopupDrawer(this.getID(), this.model);
        var _this = this;

        var cancelClose;
        var timeoutClose;

        DialogPopupView.prototype.onInit = function() {

        };

        DialogPopupView.prototype.onStart = function() {
            View.prototype.onStart.apply(this, arguments);
            /*
                @Tip Sync 로 데이터를 가져오는경우 onStart 내부에서 onGetData -> drawer.onStart 가 이루어진다
                ASync 로 데이터를 획득 할 경우 이미 drawer.onStart()가 호출된 이후임으로 drawer.onUpdate를 명시적으로 해줄 필요가 있다
            */
        };

        DialogPopupView.prototype.onStop = function() {
            View.prototype.onStop.apply(this);
        };


        DialogPopupView.prototype.onGetData = function(param) {
        	setData(param);
        };
        
        function setData(param) {

			var model = _this.model;

            model.setParam(param);

            var popupValue = PopupValues[param.id];
			
			var verticalVisibleSize = 1;
			var horizonVisibleSize = 2;
			var verticalMaximumSize = 1;
			var horizonMaximumSize = 2;

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

            if(popupValue.subSubText != undefined) {
                model.setSubSubTextClass(popupValue.subSubTextClass);
                model.setSubSubText(popupValue.subSubText);
            }

            if(popupValue.buttonText1 != undefined) {
                model.setButtonText1(popupValue.buttonText1);
            }

            if(popupValue.buttonText2 != undefined) {
                model.setButtonText2(popupValue.buttonText2);
            }

            model.setButtonGroup(getButtonGroup());

            if(popupValue.timeout != undefined && popupValue.timeout > 0) {

                cancelClose = function() {
                    var returnParam = _this.model.getParam();
                    returnParam.result = _this.model.getButtonGroup().getButton(1).getLabel();
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
                }

                timeoutClose = setTimeout(cancelClose, popupValue.timeout*1000);
            }
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

        DialogPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var buttonGroup = _this.model.getButtonGroup();
            var returnParam = _this.model.getParam();
            console.log("dialogPopupView, onKeyDown: " + keyCode );
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
                case tvKey.KEY_EXIT:
                case tvKey.KEY_ESC:
                case tvKey.KEY_BACK:
                    if(timeoutClose != null) {
                        clearTimeout(timeoutClose);
                    }
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
                    break;
				case tvKey.KEY_ENTER:
                    if(timeoutClose != null) {
                        clearTimeout(timeoutClose);
                    }
                    returnParam.result = buttonGroup.getFocusedButton().getLabel();
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
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

    DialogPopupView.prototype = Object.create(View.prototype);
	
    return DialogPopupView;
});
