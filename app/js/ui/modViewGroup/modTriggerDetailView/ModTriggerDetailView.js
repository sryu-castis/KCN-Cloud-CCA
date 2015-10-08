define(["framework/View", "framework/event/CCAEvent", "cca/model/ExtContentInfo",
        "ui/modViewGroup/modTriggerDetailView/ModTriggerDetailDrawer", "ui/modViewGroup/modTriggerDetailView/ModTriggerDetailModel",
        "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView", "service/Communicator", 'main/CSSHandler', "cca/type/VisibleTimeType"],
        function(View, CCAEvent, ExtContentInfo,
                 ModTriggerDetailDrawer, ModTriggerDetailModel,
                 ButtonGroup, PopupValues, DefineView, Communicator, CSSHandler, VisibleTimeType) {

    var ModTriggerDetailView = function() {
        View.call(this, DefineView.MOD_TRIGGER_DETAIL_VIEW);
        this.model = new ModTriggerDetailModel();
        this.drawer = new ModTriggerDetailDrawer(this.getID(), this.model);
        var _this = this;

        var isLoading = false;

        ModTriggerDetailView.prototype.onInit = function() {
        };

        ModTriggerDetailView.prototype.onAfterStart = function() {
            _this.hideTimerContainer();
        }

        ModTriggerDetailView.prototype.onGetData = function(param) {
        	setData(param);
        };
        
        function setData(param) {

			var model = _this.model;

            model.setParam(param);
            model.setAsset(param.asset);

			var verticalVisibleSize = 2;
			var horizonVisibleSize = 1;
			var verticalMaximumSize = 2;
			var horizonMaximumSize = 1;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);

            model.setVIndex(verticalVisibleSize-1);

            model.setButtonGroup(getButtonGroup());

            requestGetExtContentInfo(model.getAsset());

		};
        
        function getButtonGroup() {
            var buttonGroup = new ButtonGroup(3);
            buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.MOD_PLAY_SMART_PHONE);
            buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.MOD_PLAY_MK3);
            buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);

            //최초 설정
//			buttonGroup.getButton(0).onDeActive();
            buttonGroup.setIndex(0);

            return buttonGroup;
		}

        function requestGetExtContentInfo(asset) {
            isLoading = true;
            Communicator.requestGetExtContentInfo(function(result){
                isLoading = false;
                //result.resultCode = 261;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    _this.model.setExtContentInfo(new ExtContentInfo(result));
                    _this.drawer.onUpdate();
                    _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
            }, asset.getExtContentDomainId(), asset.getExtContentType(), asset.getExtContentId());
        }


        ModTriggerDetailView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var buttonGroup = _this.model.getButtonGroup();
            if(isLoading) {
                return;
            }
            switch (keyCode) {
            	case tvKey.KEY_RIGHT:
                    if(isButtonGroupState()) {
                        buttonGroup.next();
                    } else {
                        _this.keyNavigator.keyRight();
                    }
					_this.drawer.onUpdate();
					break;
                case tvKey.KEY_LEFT:
                    if(isButtonGroupState()) {
                        if (buttonGroup.hasPreviousButton()) {
                            buttonGroup.previous();
                            _this.drawer.onUpdate();
                        }
                    } else {
                        _this.keyNavigator.keyLeft();
                        _this.drawer.onUpdate();
                    }
                	break;
                case tvKey.KEY_EXIT:
                case tvKey.KEY_ESC:
                case tvKey.KEY_BACK:
                    _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                    break;
				case tvKey.KEY_ENTER:
                    goEnterAction();
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

        function goEnterAction() {
            var buttonGroup = _this.model.getButtonGroup();
            if(isButtonGroupState()) {
                switch (buttonGroup.getIndex()) {
                    case 0:
                        _this.sendEvent(CCAEvent.CHANGE_VIEW, {targetView:DefineView.MOD_REQUEST_PHONE_LIST, asset:_this.model.getAsset()});
                        break;
                    case 1:
                        runMonkey3(_this.model.getAsset());
                        break;
                    case 2:
                        _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                        break;
                }
            }
        }

        function runMonkey3(asset) {
            Communicator.requestSetExtSvcSource(function(result){
                //result.resultCode = 204;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    CSSHandler.runThirdApp(CSSHandler.APP_ID_MONKEY3);
                    //_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
            }, asset.getExtContentDomainId(), asset.getExtContentType(), asset.getExtContentId(), 'content');
        }

        function isButtonGroupState() {
            return _this.model.getVIndex() == _this.model.getVVisibleSize()-1;
        }

        this.onInit();
    };

    ModTriggerDetailView.prototype = Object.create(View.prototype);
	
    return ModTriggerDetailView;
});
