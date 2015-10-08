define(["framework/View", "framework/event/CCAEvent",
        "ui/popupViewGroup/alertPopupView/AlertPopupDrawer", "ui/popupViewGroup/alertPopupView/AlertPopupModel", "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView"],
        function(View, CCAEvent, DialogPopupDrawer, AlertPopupModel, ButtonGroup, PopupValues, DefineView) {

    var AlertPopupView = function() {
        View.call(this, DefineView.ALERT_POPUP_VIEW);
        this.model = new AlertPopupModel();
        this.drawer = new DialogPopupDrawer(this.getID(), this.model);
        var _this = this;

        var timeoutClose;

        AlertPopupView.prototype.onInit = function() {

        };

        AlertPopupView.prototype.onStart = function() {
            View.prototype.onStart.apply(this, arguments);
            /*
                @Tip Sync 로 데이터를 가져오는경우 onStart 내부에서 onGetData -> drawer.onStart 가 이루어진다
                ASync 로 데이터를 획득 할 경우 이미 drawer.onStart()가 호출된 이후임으로 drawer.onUpdate를 명시적으로 해줄 필요가 있다
            */
        };

        AlertPopupView.prototype.onStop = function() {
            View.prototype.onStop.apply(this);
        };


        AlertPopupView.prototype.onGetData = function(param) {
        	setData(param);
        };
        
        function setData(param) {

			var model = _this.model;

            model.setParam(param);

            var verticalVisibleSize = 1;
            var horizonVisibleSize = 1;
            var verticalMaximumSize = 1;
            var horizonMaximumSize = 1;

            model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
            model.setButtonGroup(getButtonGroup());

            var popupValue = PopupValues[param.id];

            var headText = null;
            if(param.popupType == PopupValues.PopupType.ERROR && $.isNumeric(param.id)) {
                popupValue = PopupValues[param.id];
                if (popupValue == null || popupValue == undefined) {
                    popupValue = PopupValues[PopupValues.ID.DEFAULT_ERROR];
                }
                headText = "[" + param.id + "] " + popupValue.headText;
            } else if (param.popupType == PopupValues.PopupType.ERROR && param.id == undefined) {
                param.id = PopupValues.ID.COMMUNICATION_ERROR;
                popupValue = PopupValues[param.id];
                headText = popupValue.headText;
            } else if(param.popupType == PopupValues.PopupType.ERROR_PLAY && $.isNumeric(param.id)) {
                popupValue = PopupValues[param.id];
                if(popupValue == null || popupValue == undefined) {
                    popupValue = PopupValues[PopupValues.ID.DEFAULT_ERROR_PLAY];
                }
                headText = "["+param.id+"] " + popupValue.headText;
            } else {
                popupValue = PopupValues[param.id];
                headText = popupValue.headText;
            }

            model.setIconType(popupValue.iconType);
            model.setTitle(popupValue.title);
            if(popupValue.headText != undefined) {
                model.setHeadTextClass(popupValue.headTextClass)
                model.setHeadText(headText);
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

            if(popupValue.timeout != undefined && popupValue.timeout > 0) {
                timeoutClose = setTimeout(function(){
                    var returnParam = _this.model.getParam();
                    returnParam.result = _this.model.getButtonGroup().getButton(0).getLabel();
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, returnParam);
                }, popupValue.timeout*1000);
            }
		};
        
        function getButtonGroup() {
			var buttonGroup = new ButtonGroup(1);
			//Label 설정

            if(_this.model.getButtonText1() != null) {
                buttonGroup.getButton(0).setLabel(_this.model.getButtonText1());
            } else {
                buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
            }

			//최초 설정
//			buttonGroup.getButton(0).onDeActive();
			buttonGroup.setIndex(0);

			return buttonGroup;
		}

        AlertPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var buttonGroup = _this.model.getButtonGroup();
            var returnParam = _this.model.getParam();
            console.log("alertPopupView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_RIGHT:
            		buttonGroup.next();
					_this.drawer.onUpdate();
					break;
                case tvKey.KEY_LEFT:
                	if(buttonGroup.hasPreviousButton()) {
						buttonGroup.previous();
						_this.drawer.onUpdate();
					}
                	break;
                case tvKey.KEY_ESC:
                case tvKey.KEY_EXIT:
                case tvKey.KEY_BACK:
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
    AlertPopupView.prototype = Object.create(View.prototype);
	
    return AlertPopupView;
});
