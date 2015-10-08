define(["framework/View", "framework/event/CCAEvent",
        "ui/mytvViewGroup/purchasedSVODListView/PurchasedSVODListDrawer","ui/mytvViewGroup/purchasedSVODListView/PurchasedSVODListModel",
        "service/Communicator", "service/STBInfoManager", "framework/modules/ButtonGroup", "cca/DefineView", "cca/PopupValues", "cca/type/VisibleTimeType"],
        function(View, CCAEvent, PurchasedSVODListDrawer, PurchasedSVODListModel, Communicator, STBInfoManager, ButtonGroup, DefineView, PopupValues, VisibleTimeType) {

    var PurchasedSVODListView = function() {
        View.call(this, DefineView.PURCHASED_SVOD_LIST_VIEW);
        this.model = new PurchasedSVODListModel();
        this.drawer = new PurchasedSVODListDrawer(this.getID(), this.model);

        var PAGE_SIZE = 6;

        var STATE_BUTTON_GROUP = 1;

        var _this = this;

        PurchasedSVODListView.prototype.onInit = function() {
        };

        PurchasedSVODListView.prototype.onBeforeStart = function() {
            this.transactionId = $.now() % 1000000;
            this.isRequesting = false;
            _this.model.setIsListFetched(false);
        };

        PurchasedSVODListView.prototype.onAfterStart = function() {
			_this.hideTimerContainer();
		}

        PurchasedSVODListView.prototype.onPopupResult = function(param) {
//            console.log("PurchasedSVODListView.prototype.onPopupResult");

            if (param.popupType != undefined && param.popupType == PopupValues.PopupType.ERROR) {
                _this.drawer.hideButtonGroup();
                _this.sendEvent(CCAEvent.CHANGE_VIEW, getEventParamObject(DefineView.CATEGORY_LIST_VIEW));
            } else {
                if (param.id == PopupValues.ID.CONFIRM_UNJOIN_RCP_PRODUCT && param.result == CCABase.StringSources.ButtonLabel.CONFIRM) {
                    var id = PopupValues.ID.UNJOIN_RCP;
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id, productInfo:param.productInfo});
                } else if (param.id == PopupValues.ID.UNJOIN_RCP && param.result == CCABase.StringSources.ButtonLabel.CONFIRM) {
                    requestUnjoinRCPProduct(param.productInfo);
                } else if (param.id == PopupValues.ID.ALERT_UNJOIN_RCP_PRODUCT_COMPLETE) {
                    requestRCPProductList();
                }
            }
        };


        PurchasedSVODListView.prototype.onGetData = function(param) {
        	_this.model.setButtonGroup(getButtonGroup());
        	requestRCPProductList();
        };
        
        function getButtonGroup() {
			var buttonGroup = new ButtonGroup(2);
			//Label 설정
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.UNJOIN);
			buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CLOSE);
			//최초 설정
//			buttonGroup.getButton(0).onDeActive();
			buttonGroup.setIndex(0);

			return buttonGroup;
		}

        function requestRCPProductList() {

            _this.isRequesting = true;

            var appId = 1;
            var sourceId = -1; //가입상품 목록 요청.
            var cableCardMac = "000000000000";

            var transactionId = ++_this.transactionId;

        	Communicator.requestRCPProductList(callBackForRequestRCPProductList, transactionId, appId, sourceId, STBInfoManager.getMacAddress().replace(/:/gi,""), cableCardMac, STBInfoManager.getSmartCardId())
        }
        
        function callBackForRequestRCPProductList(result) {
            if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    setData(result);
                } else {
                    console.log("Failed to get datas from has.");
                    //_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
                _this.model.setIsListFetched(true);
                _this.drawer.onUpdate();
                _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
                if(_this.model.getData() == null || _this.model.getData().length == 0) {
                    _this.drawer.hideButtonGroup();
                    _this.sendEvent(CCAEvent.CHANGE_VIEW, getEventParamObject(DefineView.CATEGORY_LIST_VIEW));
                }
            } else if(result.transactionId == undefined) {
                _this.isRequesting = false;
            }
        };

        function requestUnjoinRCPProduct(productInfo) {
            if(_this.isRequesting == true) {
                return;
            };
            _this.isRequesting = true;
            var appId = 1;
            var sourceId = -1; //구매취소
            var cableCardMac = "000000000000";
            Communicator.requestPurchaseRCPProduct(callBackForRequestUnjoinRCPProduct, appId, sourceId, STBInfoManager.getMacAddress().replace(/:/gi,""), cableCardMac, STBInfoManager.getSmartCardId(), productInfo.getProductID(), productInfo.getPrice())
        }

        function callBackForRequestUnjoinRCPProduct(result) {
            _this.isRequesting = false;
            if(Communicator.isSuccessResponseFromHAS(result) == true) {
                var id = PopupValues.ID.ALERT_UNJOIN_RCP_PRODUCT_COMPLETE;
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
            } else {
                console.log("Failed to get datas from has.");
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
            };
        };

        function setData(result) {
            var model = _this.model;

            if(result.productInfoList != undefined && result.productInfoList != null) {
                //model.setTotalCount(result.totalCount);
                //model.setTotalPage(1);
                model.setData(result.productInfoList);
                model.setSize(PAGE_SIZE, 2, result.productInfoList.length, 2);
                model.setVIndex(0);
                model.setRotate(true, false);
            }
        };

        PurchasedSVODListView.prototype.onKeyDown = function(event, param) {
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
                if(isButtonGroupState()) {
                    var buttonLabel = buttonGroup.getFocusedButton().getLabel();
                    switch (buttonLabel) {
                        case CCABase.StringSources.ButtonLabel.UNJOIN:
                            _this.drawer.hideButtonGroup();
                            var productInfo = _this.model.getData()[_this.model.getVStartIndex()+_this.model.getVIndex()];
                            var id = PopupValues.ID.CONFIRM_UNJOIN_RCP_PRODUCT;
                            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id, productInfo:productInfo});
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
                _this.keyNavigator.keyUp();
                if(_this.model.getData().length-1 == _this.model.getVStartIndex()+_this.model.getVIndex())	{
                    _this.model.setVStartIndex(_this.model.getData().length-1-(_this.model.getData().length-1)%_this.model.getVVisibleSize());
                    _this.model.setVIndex((_this.model.getData().length-1)%_this.model.getVVisibleSize());
                } else if(_this.model.getPreviousVIndex() == 0){
                    _this.model.setVStartIndex(_this.model.getVStartIndex()-_this.model.getVVisibleSize()+1);
                    _this.model.setVIndex(_this.model.getVVisibleSize()-1);
                }
                _this.drawer.onUpdate();
                break;
            case tvKey.KEY_DOWN:
                _this.keyNavigator.keyDown();
                if(_this.model.getPreviousVIndex()+1 == _this.model.getVVisibleSize()){
                    _this.model.setVStartIndex(_this.model.getVStartIndex()+_this.model.getVIndex());
                    _this.model.setVIndex(0);

                } else if(_this.model.getData().length == _this.model.getVStartIndex()+_this.model.getVIndex()){
                    _this.model.setVStartIndex(0);
                    _this.model.setVIndex(0);
                }
                _this.drawer.onUpdate();
                break;
            default:
                break;
            }
        };

        function isButtonGroupState() {
            return _this.model.getHIndex() == STATE_BUTTON_GROUP;
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
    PurchasedSVODListView.prototype = Object.create(View.prototype);

    return PurchasedSVODListView;
});
