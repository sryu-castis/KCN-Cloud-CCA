define(["framework/View", "framework/event/CCAEvent",
        "ui/mytvViewGroup/registrationMobileView/RegistrationMobileDrawer","ui/mytvViewGroup/registrationMobileView/RegistrationMobileModel",
        "service/Communicator", "framework/modules/ButtonGroup", "framework/modules/Button", "cca/DefineView", "cca/PopupValues", "cca/type/VisibleTimeType"],
        function(View, CCAEvent, RegistrationMobileDrawer, RegistrationMobileModel, Communicator, ButtonGroup, Button, DefineView, PopupValues, VisibleTimeType) {

    var RegistrationMobileView = function() {
        View.call(this, DefineView.REGISTRATION_MOBILE_VIEW);
        this.model = new RegistrationMobileModel();
        this.drawer = new RegistrationMobileDrawer(this.getID(), this.model);

        var PAGE_SIZE = 4;

        var STATE_BUTTON_GROUP = 1;

        var _this = this;

        RegistrationMobileView.prototype.onInit = function() {
        };

        RegistrationMobileView.prototype.onBeforeStart = function() {
            this.transactionId = $.now() % 1000000;
            this.isRequesting = false;
            _this.model.setIsListFetched(false);
        };

        RegistrationMobileView.prototype.onAfterStart = function() {
			_this.hideTimerContainer();
		}

        RegistrationMobileView.prototype.onGetData = function(param) {
        	_this.model.setButtonGroup(getButtonGroup());
            _this.model.setRegisterButton(getRegisterButton());
            requestUserList(0, 1);
        };

        RegistrationMobileView.prototype.onPopupResult = function(param) {
//            console.log("RegistrationMobileView.prototype.onPopupResult");

            if (param.popupType != undefined && param.popupType == PopupValues.PopupType.ERROR) {
                _this.drawer.hideButtonGroup();
                _this.sendEvent(CCAEvent.CHANGE_VIEW, getEventParamObject(DefineView.CATEGORY_LIST_VIEW));
            } else {
                if (param.id == PopupValues.ID.REGISTER_SMART_PHONE) {
                    if(param.result == PopupValues[param.id].buttonText1){
                        requestAuthCode(param.phoneNumber);
                    }
                } else if (param.id == PopupValues.ID.REGISTER_SMART_PHONE_AUTH) {
                    if(param.result == PopupValues[param.id].buttonText1){
                        requestUserList(0, 1);
                    }
                } else if (param.id == PopupValues.ID.ALERT_DUPLICATE_SMART_PHONE) {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.REGISTER_SMART_PHONE});
                } else if (param.id == PopupValues.ID.UNREGISTER_SMART_PHONE) {
                    if(param.result == PopupValues[param.id].buttonText1){
                        requestRemoveUser(param.user.getUserID());
                    }
                }
            }
        };
        
        function getButtonGroup() {
			var buttonGroup = new ButtonGroup(2);
			//Label 설정
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.REG_TERMINATE);
			buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CLOSE);
			//최초 설정
//			buttonGroup.getButton(0).onDeActive();
			buttonGroup.setIndex(0);

			return buttonGroup;
		}

        function getRegisterButton() {
            var button = new Button();
            //Label 설정
            button.setLabel(CCABase.StringSources.ButtonLabel.REGISTER_MOBILE);

            return button;
        }

        function requestUserList(pageIndex, direction) {

            _this.isRequesting = true;

        	_this.model.setRequestPageIndex(pageIndex);
        	_this.model.setRequestDirection(direction);

            var transactionId = ++_this.transactionId;

        	Communicator.requestUserList(callBackForRequestUserList, transactionId, PAGE_SIZE, pageIndex);
        }

        function callBackForRequestUserList(result) {
            if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
                _this.isRequesting = false;
                if (Communicator.isSuccessResponseFromHAS(result) == true) {
                    setData(result);
                } else {
                    console.error("Failed to get datas from has.");
                    //_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
                _this.model.setIsListFetched(true);
                if (_this.model.getData() == null || _this.model.getData().length == 0) {
                    _this.model.setState(RegistrationMobileModel.STATE_REGISTER_BUTTON);
                }
                _this.drawer.onUpdate();
                _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
            } else if(result.transactionId == undefined) {
                _this.isRequesting = false;
            }
        };

        function requestAuthCode(phoneNumber) {
            if(_this.isRequesting == true) {
                return;
            };
            _this.isRequesting = true;
            Communicator.requestAuthCode(callBackForRequestAuthCode, phoneNumber);
        }

        function callBackForRequestAuthCode(result) {
            _this.isRequesting = false;
            if(Communicator.isSuccessResponseFromHAS(result) == true) {
                var id = PopupValues.ID.REGISTER_SMART_PHONE_AUTH;
                PopupValues[id].headText = CCABase.StringSources.registerSmartPhoneAuthHeadText+result.authCode;
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
            } else {
                console.error("Failed to get datas from has.");
                switch (result.resultCode) {
                    case 204: //Invalid PhoneNumber
                        break;
                    case 221 : //Already PhoneNumber Exists
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.ALERT_DUPLICATE_SMART_PHONE});
                        return;
                }
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
            };
        }

        function requestRemoveUser(userId) {
            if(_this.isRequesting == true) {
                return;
            };
            _this.isRequesting = true;
            Communicator.requestRemoveUser(callBackForRequestRemoveUser, userId);
        }

        function callBackForRequestRemoveUser(result) {
            _this.isRequesting = false;
            if(Communicator.isSuccessResponseFromHAS(result) == true) {
                requestUserList(0, 1);
            } else {
                console.error("Failed to get datas from has.");
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
            };
        };

        function setData(result) {
            var model = _this.model;

            if(result.userList != undefined && result.userList != null) {
                model.setTotalCount(result.totalCount);
                model.setTotalPage(result.totalPage);
                model.setData(result.userList);
                model.setSize(result.userList.length, 2, result.userList.length, 2);
                model.setPageSize(PAGE_SIZE)
                model.setVIndex(model.getNextVIndexAfterRequest());
                model.setCurrentPageIndex(model.getRequestPageIndex());
                model.setRotate(true, false);
            }
        };

        RegistrationMobileView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var buttonGroup = _this.model.getButtonGroup();
            if(_this.isRequesting == true) {
                return;
            }
            switch (keyCode) {
            case tvKey.KEY_BACK:
            case tvKey.KEY_EXIT:
            	if(isButtonGroupState()) {
            		_this.drawer.hideButtonGroup();
            	} else {
                    _this.model.setState(RegistrationMobileModel.STATE_REGISTER_BUTTON);
            		_this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
            	}
            	break;
            case tvKey.KEY_LEFT:
                if(isButtonGroupState()) {
                    if(buttonGroup.getIndex() == 0) {
                        buttonGroup.setIndex(buttonGroup.getSize()-1)
                    } else {
                        buttonGroup.previous();
                    }
                    _this.drawer.drawButtonGroup();
                } else {
                    _this.model.setState(RegistrationMobileModel.STATE_REGISTER_BUTTON);
                    _this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                }
            	break;
            case tvKey.KEY_RIGHT:
                if(isButtonGroupState()) {
                    if(buttonGroup.getIndex() == buttonGroup.getSize()-1) {
                        buttonGroup.setIndex(0)
                    } else {
                        buttonGroup.next();
                    }
                    _this.drawer.drawButtonGroup();
                }
            	break;
            case tvKey.KEY_ENTER:
                if(isRegisterButtonState()) {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.REGISTER_SMART_PHONE});
                } else if(isButtonGroupState()) {
                    var buttonLabel = buttonGroup.getFocusedButton().getLabel();
                    switch (buttonLabel) {
                        case CCABase.StringSources.ButtonLabel.REG_TERMINATE:
                            _this.drawer.hideButtonGroup();
                            var user = _this.model.getData()[_this.model.getVIndex()];
                            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.UNREGISTER_SMART_PHONE, user:user});
                            break;
                        case CCABase.StringSources.ButtonLabel.CLOSE:
                            _this.drawer.hideButtonGroup();
                            break;
                    }
                } else {
                    _this.drawer.showButtonGroup();
                }
                break;
            case tvKey.KEY_UP:
                if(isRegisterButtonState()) {
                    //nothing to do
                } else if(_this.model.getCurrentPageIndex() == 0 && _this.model.getVIndex() == 0) {
                    _this.model.setState(RegistrationMobileModel.STATE_REGISTER_BUTTON);
                    _this.drawer.onUpdate();
                } else if(_this.model.getTotalPage() > 1 && _this.model.getVIndex() == 0) {
                    requestUserList(_this.model.getPrePageIndex(), -1);
            	} else {
	                _this.keyNavigator.keyUp();
	            	_this.drawer.onUpdate();
            	}
                break;
            case tvKey.KEY_DOWN:
                if(_this.model.getData() != null &&_this.model.getData().length > 0) {
                    if (isRegisterButtonState()) {
                        _this.model.setState(RegistrationMobileModel.STATE_USER_LIST);
                        _this.drawer.onUpdate();
                    } else if (_this.model.getTotalPage() > 1 && _this.model.getVIndex() == _this.model.getVVisibleSize() - 1) {
                        requestUserList(_this.model.getNextPageIndex(), 1);
                    } else {
                        _this.keyNavigator.keyDown();
                        _this.drawer.onUpdate();
                    }
                }
                break;
            default:
                break;
            }
        };
        
        function isButtonGroupState() {
            return _this.model.getHIndex() == STATE_BUTTON_GROUP;
		}

        function isRegisterButtonState() {
            return _this.model.getState() == RegistrationMobileModel.STATE_REGISTER_BUTTON;
        }
        
        function getEventParamObject(targetView) {
            var model = _this.model;
            var param = {};
            param.targetView = targetView;
            param.index = model.getVIndex();
            param.startIndex = model.getVStartIndex();
            return param;
        }
        this.onInit();
    };
    RegistrationMobileView.prototype = Object.create(View.prototype);

    return RegistrationMobileView;
});
