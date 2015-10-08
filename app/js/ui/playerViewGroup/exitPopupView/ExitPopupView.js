define(["framework/View", "framework/event/CCAEvent","service/Communicator",
        "ui/playerViewGroup/exitPopupView/ExitPopupDrawer", "ui/playerViewGroup/exitPopupView/ExitPopupModel", 
        "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView", "helper/UIHelper", "cca/type/VisibleTimeType",
        "cca/type/PlayType", "helper/UIComponentHelper"
    ],
        function(View, CCAEvent, Communicator, ExitPopupDrawer, ExitPopupModel, ButtonGroup, PopupValues, DefineView, UIHelper, VisibleTimeType, PlayType, UIComponentHelper) {

    var ExitPopupView = function() {
        View.call(this, DefineView.EXIT_POPUP_VIEW);
        this.model = new ExitPopupModel();
        this.drawer = new ExitPopupDrawer(this.getID(), this.model);
        var _this = this;

        ExitPopupView.prototype.onInit = function() {

        };
        ExitPopupView.prototype.onAfterStart = function() {
            _this.hideTimerContainer();
        };

        ExitPopupView.prototype.onGetData = function(param) {
            _this.model.setAsset(param.asset);
            _this.model.setAssetID(param.assetID);
            _this.model.setPopupId(param.popupID);
            if(param.asset != null) {
                _this.model.setHDContent(param.asset.isHDContent());
            }
        	_this.model.setEOS(param['isEOS']);
			setPopupData(_this.model.getPopupId());
            requestRelativeContentGroupList(_this.model.getAssetID());
        };

        function setData(contentGroupList) {
			var model = _this.model;

            var verticalVisibleSize = 2;
			var horizonVisibleSize = contentGroupList.length;
			var verticalMaximumSize = verticalVisibleSize;
			var horizonMaximumSize = horizonVisibleSize;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
            model.setData(contentGroupList);
            model.setRotate(false, true);
		}

        function setPopupData(popupID) {
            var model = _this.model;
            var popupValue = PopupValues[popupID];

            model.setTitle(popupValue.title);

            if(popupValue.headText != undefined) {
                model.setHeadText(popupValue.headText);
            }

            if(popupValue.subText != undefined) {
                model.setSubText(popupValue.subText);
            }
            model.setButtonGroup(getButtonGroup(popupID));
        }
        function setPurchaseButtonLabel(buttonGroup)	{
            var asset = _this.model.getAsset();

            if(asset.isHDContent()) {
                var product = UIHelper.getDisplayProduct(asset.getProductList());
                if(UIHelper.isPurchasedProduct(product)) {
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.PLAY_HD);
                } else {
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.PURCHASE_HD);
                }
            } else {
                var product = UIHelper.getDisplayProduct(asset.getProductList());
                if(UIHelper.isPurchasedProduct(product)) {
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.PLAY_SD);
                } else {
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.PURCHASE_SD);
                }
            }
        }
        function getButtonGroup(popupID) {
            var buttonGroup = null;
//            console.log("exitpopup getButtonGroup poupId:"+popupID);
//            console.log("exitpopup getButtonGroup eos:"+_this.model.isEOS());
//            console.log("exitpopup getButtonGroup hd:"+_this.model.isHDContent());

            var asset = _this.model.getAsset();

            if(asset != null) {
                if(popupID == PopupValues.ID.EXIT_PREVIEW) {
                    if(_this.model.isEOS()) {
                        buttonGroup = new ButtonGroup(2);
                        setPurchaseButtonLabel(buttonGroup);

                        buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                    } else {
                        buttonGroup = new ButtonGroup(3);
                        setPurchaseButtonLabel(buttonGroup);

                        buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                        buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                    }
                } else if(popupID == PopupValues.ID.EXIT_TRAILER) {
                    if(_this.model.isEOS()) {
                        buttonGroup = new ButtonGroup(2);
                        setPurchaseButtonLabel(buttonGroup);

                        buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                    } else {
                        buttonGroup = new ButtonGroup(3);
                        setPurchaseButtonLabel(buttonGroup);

                        buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                        buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                    }
                } else if(popupID == PopupValues.ID.EXIT_NORMAL_PLAY) {
                    if(UIHelper.isHaveOST(asset)) {
                        if (_this.model.isEOS()) {
                            buttonGroup = new ButtonGroup(3);
                            buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                            buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.OST);
                            buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.REVIEW_RATING);
                        } else {
                            buttonGroup = new ButtonGroup(4);
                            buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                            buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.OST);
                            buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.REVIEW_RATING);
                            buttonGroup.getButton(3).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                        }
                    } else {
                        if (_this.model.isEOS()) {
                            buttonGroup = new ButtonGroup(2);
                            buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                            buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.REVIEW_RATING);
                        } else {
                            buttonGroup = new ButtonGroup(3);
                            buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                            buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.REVIEW_RATING);
                            buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                        }
                    }
                }
            } else {
                if (_this.model.isEOS()) {
                    buttonGroup = new ButtonGroup(1);
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                } else {
                    buttonGroup = new ButtonGroup(2);
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.EXIT_PLAYER);
                    buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                }
            }

            return buttonGroup;
        }

        function requestRelativeContentGroupList(assetID) {
            var contentGroupProfile = "2";
            var recommendField = "contentsCF";
            var recommendFieldValue = "";
            var pageSize = 5;
            var pageIndex = 0;
            Communicator.requestRecommendContentGroupByAssetId(callBackForRequestContentGroupByAssetId, assetID, contentGroupProfile, recommendField, recommendFieldValue, pageSize, pageIndex);
        }

        function callBackForRequestContentGroupByAssetId(response) {
            if(Communicator.isSuccessResponseFromHAS(response)) {
                setData(response.contentGroupList);
                _this.model.setRecommendByMD(false);
				_this.drawer.onUpdate();
            } else {
            	console.error("Failed to get datas from has.");
                // popup 처리하지 않아야 할 것으로 추정됨 _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
            }
            //_this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);


            if(_this.model.getData() == null || _this.model.getData().length == 0) {
                requestRelativeContentGroupListBySubscriber();
            }
            _this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);

        }

        function requestRelativeContentGroupListBySubscriber() {
            var contentGroupProfile = "2";
            var pageSize = 5;
            var pageIndex = 0;
            var sortType = "licenseDescend";
            var includeAdultCategory = 1;
            Communicator.requestRecommendContentGroupBySubscriber(callBackForRequestContentGroupBySubscriber, pageSize, pageIndex, sortType, contentGroupProfile, includeAdultCategory);
        }

        function callBackForRequestContentGroupBySubscriber(response) {
            var visibleTimeType = VisibleTimeType.TEXT_TYPE;
            if(Communicator.isSuccessResponseFromHAS(response)) {
                _this.model.setRecommendByMD(true);
                setData(response.contentGroupList);
                visibleTimeType = VisibleTimeType.POSTER_LIST_TYPE;
            } else {
                console.error("Failed to get datas from has.");
                //_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
            }
            _this.drawer.onUpdate();
            _this.setVisibleTimer(visibleTimeType);
        }

        ExitPopupView.prototype.onPopupResult = function(param) {
			if (param.popupType == PopupValues.PopupType.RATING) {
				sendFinishViewEvent('stop');
            } else if (param.id == PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY) {
                if(param.result == CCABase.StringSources.ButtonLabel.PLAY_CONTINUE){
                    changeToPlay(PlayType.NORMAL, _this.model.getOffset());
                }
                else if(param.result == CCABase.StringSources.ButtonLabel.PLAY_FIRST){
                    changeToPlay(PlayType.NORMAL, 0);
                }
            } else if(param.popupType = PopupValues.PopupType.EVENT_DETAIL){
                var isAgreeForEvent = false;
                if(param.result == CCABase.StringSources.ButtonLabel.ENROLL){
                    isAgreeForEvent = true;
                }
                changeToPurchase(isAgreeForEvent);
            } else if (param.popupType = PopupValues.PopupType.ERROR) {
                sendFinishViewEvent('stop');
            }

		};
        ExitPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var buttonGroup = _this.model.getButtonGroup();
            //var returnParam = _this.model.getParam();

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
                        buttonGroup.previous();
                	} else {
                		_this.keyNavigator.keyLeft();
                	}
                    _this.drawer.onUpdate();
                	break;
                case tvKey.KEY_EXIT:
                case tvKey.KEY_BACK:
                    /*if(timeoutClose != null) {
                        clearTimeout(timeoutClose);
                    }*/
                    //returnParam.result = CCABase.StringSources.ButtonLabel.CANCEL;
                    //_this.sendEvent(CCAEvent.FINISH_VIEW, returnParam);
                	sendFinishViewEvent('cancel');
                    break;
				case tvKey.KEY_ENTER:
                    /*if(timeoutClose != null) {
                        clearTimeout(timeoutClose);
                    }*/
                    if(isButtonGroupState()) {
                        selectButtonHandler(buttonGroup.getFocusedButton().getLabel())
                    } else {
                        sendChangeViewGroupEvent();
                    }
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

        function selectButtonHandler(buttonLabel) {
            switch (buttonLabel) {
                case CCABase.StringSources.ButtonLabel.PLAY_HD:
                case CCABase.StringSources.ButtonLabel.PLAY_SD:
                    requestGetLatestOffset();
                    break;
	            case CCABase.StringSources.ButtonLabel.PURCHASE_HD:
				case CCABase.StringSources.ButtonLabel.PURCHASE_SD:
					changeToPurchase();
					break;
                case CCABase.StringSources.ButtonLabel.EXIT_PLAYER:
                    sendFinishViewEvent('stop');
                    break;
                case CCABase.StringSources.ButtonLabel.CANCEL:
                    if(_this.model.isEOS()) {
                        sendFinishViewEvent('stop');
                    } else {
                        sendFinishViewEvent('cancel');
                    }
                    break;
                case CCABase.StringSources.ButtonLabel.REVIEW_RATING:
                	changeToRatingPopup();
                	break;
                case CCABase.StringSources.ButtonLabel.OST:
                    var param = {targetGroup:DefineView.MOD_VIEWGROUP, targetView:DefineView.MOD_CHOICE_DEVICE_VIEW, asset:_this.model.getAsset()};
                    param.uiDomainID = UIComponentHelper.UIDomainID.PLAYING;
                    param.uiComponentID = UIComponentHelper.UIComponentID.PLAYING_MOD;
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
                    break;
            }
        }
        function requestGetLatestOffset() {
            var asset = _this.model.getAsset();
            Communicator.requestGetLatestOffset(callbackForRequestGetLatestOffset, asset.getAssetID());
        }

        function callbackForRequestGetLatestOffset(response) {
            if(Communicator.isSuccessResponseFromHAS(response) == true) {
                _this.model.setOffset(response.latestOffset);
                if(_this.model.getOffset() > 0)	{
                    changeToSelectContinuousPlay();
                }
                else	{
                    changeToPlay(PlayType.NORMAL, 0);
                }

            } else {
                console.error("Failed to get datas from has.", response);
            }
        }

        function changeToSelectContinuousPlay()	{
            var id = PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY;
            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
        }

        function changeToPlay(playType, offset) {
            var param = {};
            param.asset = _this.model.getAsset();
            param.product = UIHelper.getDisplayProduct(param.asset.getProductList());
            param.coupon = null;
            param.offset = offset;
            param.playType = playType;
            param.targetView = DefineView.PLAYER_VIEW;

            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
        }


        function changeToPurchase(){
			var param = {};
			param.asset = _this.model.getAsset();
			param.product = UIHelper.getDisplayProduct(param.asset.getProductList());
			param.coupon = null;
			param.targetView = DefineView.SELECT_PRODUCT_VIEW;

			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}

        function changeToRatingPopup()	{
        	_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.RATING, asset:_this.model.getAsset()});
        }

        function sendChangeViewGroupEvent() {
            var model = _this.model;
            var param = {};

            var contentGroup = model.getHFocusedItem();
            param.targetView = getTargetView(contentGroup);
            param.contentGroupID = contentGroup.getContentGroupID();

            param.uiDomainID = UIComponentHelper.UIDomainID.RECOMMEND;
            if(model.isRecommendByMD()) {
                param.uiComponentID = UIComponentHelper.UIComponentID.RECOMMEND_PLAY_END_MD;
            } else {
                param.uiComponentID = UIComponentHelper.UIComponentID.RECOMMEND_PLAY_END;
            }
            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
        }

        function getTargetView(contentGroup) {
            if(contentGroup.isEpisodePeerContent()) {
                return DefineView.EPISODE_PEER_LIST_VIEW;
            } else {
                return DefineView.DETAIL_VIEW;
            }

        }
        function sendFinishViewEvent(action) {
            _this.sendEvent(CCAEvent.FINISH_VIEW, {'action' : action});
        }


        function isButtonGroupState() {
            return _this.model.getVIndex() == ExitPopupView.STATE_BUTTON_GROUP;
        }
        

        this.onInit();
    };

    ExitPopupView.prototype = Object.create(View.prototype);
    ExitPopupView.STATE_BUTTON_GROUP = 0;
    ExitPopupView.STATE_SELECT_ASSET = 1;

    return ExitPopupView;
});
