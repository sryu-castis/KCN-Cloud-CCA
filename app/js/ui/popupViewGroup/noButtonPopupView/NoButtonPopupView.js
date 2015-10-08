define(["framework/View", "framework/event/CCAEvent",
        "ui/popupViewGroup/noButtonPopupView/NoButtonPopupDrawer", "ui/popupViewGroup/noButtonPopupView/NoButtonPopupModel", "cca/PopupValues", "cca/DefineView", "main/CSSHandler"],
        function(View, CCAEvent, NoButtonPopupDrawer, NoButtonPopupModel, PopupValues, DefineView, CSSHandler) {

    var NoButtonPopupView = function() {
        View.call(this, DefineView.NO_BUTTON_POPUP_VIEW);
        this.model = new NoButtonPopupModel();
        this.drawer = new NoButtonPopupDrawer(this.getID(), this.model);
        var _this = this;

        var timeoutClose;

        NoButtonPopupView.prototype.onInit = function() {

        };

        NoButtonPopupView.prototype.onStart = function() {
            View.prototype.onStart.apply(this, arguments);
            /*
                @Tip Sync 로 데이터를 가져오는경우 onStart 내부에서 onGetData -> drawer.onStart 가 이루어진다
                ASync 로 데이터를 획득 할 경우 이미 drawer.onStart()가 호출된 이후임으로 drawer.onUpdate를 명시적으로 해줄 필요가 있다
            */
        };
        NoButtonPopupView.prototype.onBeforeStart = function(param) {
			//@숫자 key를 받을 수 있도록 lock 을 해제
        	var popupValue = PopupValues[param.id];
        	if(popupValue != undefined && popupValue.ignoreNumPad == true)	{
        		//CSSHandler.activateNumberKeys(true);
                CSSHandler.allKeyBlock(5000);
        	}
			
		};
		NoButtonPopupView.prototype.onAfterDeActive = function() {
			//@숫자 key를 받을 수 있도록 lock 을 해제
			CSSHandler.activateNumberKeys(false);
		};
        NoButtonPopupView.prototype.onAfterStop = function() {
            CSSHandler.activateNumberKeys(false);
        };


        NoButtonPopupView.prototype.onGetData = function(param) {
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

            var popupValue = PopupValues[param.id];

            //var headText = null;
            //if(param.popupType == PopupValues.PopupType.ERROR && $.isNumeric(param.id)) {
            //    popupValue = PopupValues[param.id];
            //    if(popupValue == null || popupValue == undefined) {
            //        popupValue = PopupValues[PopupValues.ID.DEFAULT_ERROR];
            //    }
            //    headText = "["+param.id+"] " + popupValue.headText;
            //} else {
            //    popupValue = PopupValues[param.id];
            //    headText = popupValue.headText;
            //}

            var headText = popupValue.headText;

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

            if(popupValue.timeout != undefined && popupValue.timeout > 0) {
                timeoutClose = setTimeout(function(){
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, _this.model.getParam());
                }, popupValue.timeout*1000);
            }

		};

        NoButtonPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            console.log("noButtonPopupView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_RIGHT:
                case tvKey.KEY_LEFT:
                	break;
                case tvKey.KEY_ESC:
                case tvKey.KEY_EXIT:
                case tvKey.KEY_BACK:
				case tvKey.KEY_ENTER:
                    if(timeoutClose != null) {
                        clearTimeout(timeoutClose);
                    }
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, _this.model.getParam());
                	break;
                case tvKey.KEY_UP:
                case tvKey.KEY_DOWN:
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
    NoButtonPopupView.prototype = Object.create(View.prototype);
	
    return NoButtonPopupView;
});
