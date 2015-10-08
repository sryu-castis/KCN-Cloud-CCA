define(["framework/View", "framework/event/CCAEvent",
        "ui/mytvViewGroup/wishListView/WishListDrawer","ui/mytvViewGroup/wishListView/WishListModel",
        "service/Communicator", "cca/type/ProductType", "helper/DateHelper", "framework/modules/ButtonGroup", "cca/DefineView", "cca/PopupValues", "cca/type/VisibleTimeType"],
        function(View, CCAEvent, WishListDrawer, WishListModel, Communicator, ProductType, DateHelper, ButtonGroup, DefineView, PopupValues, VisibleTimeType) {

    var WishListView = function() {
        View.call(this, DefineView.WISH_LIST_VIEW);
        this.model = new WishListModel();
        this.drawer = new WishListDrawer(this.getID(), this.model);
        
        var ASSET_PROFILE = 1;
        var PAGE_SIZE = 6;
        var DURATION_BACK = "0-1-0";

        var STATE_BUTTON_GROUP = 1;

        var _this = this;

        WishListView.prototype.onInit = function() {
        };

        WishListView.prototype.onBeforeStart = function() {
            this.transactionId = $.now() % 1000000;
            this.isRequesting = false;
            _this.model.setIsListFetched(false);
        };

        WishListView.prototype.onAfterStart = function() {
			_this.hideTimerContainer();
		}

        WishListView.prototype.onGetData = function(param) {
        	_this.model.setButtonGroup(getButtonGroup());
        	if(param.pageIndex != null)	{
        		_this.model.setLastVIndex(param.index);
        		requestWishList(param.pageIndex, 1);	
        	}
        	else	{
        		requestWishList(0, 1);
        	}
        };

        WishListView.prototype.onPopupResult = function(param) {
            if (param.popupType != undefined && param.popupType == PopupValues.PopupType.ERROR) {
                _this.drawer.hideButtonGroup();
                _this.sendEvent(CCAEvent.CHANGE_VIEW, getEventParamObject(DefineView.CATEGORY_LIST_VIEW));
            } else {
                if (param.id == PopupValues.ID.CONFIRM_DELETE_WISH_ITEM && param.result == CCABase.StringSources.ButtonLabel.CONFIRM) {
                    requestRemoveWishItem(param.wishItem);
                } else if (param.id == PopupValues.ID.ALERT_VOD_LICENSE_END_WISH_ITEM) {
                    requestRemoveWishItem(param.wishItem);
                }
            }
        };
        
        function getButtonGroup() {
			var buttonGroup = new ButtonGroup(3);
			//Label 설정
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.DIRECT_VIEW);
			buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.DELETE);
			buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CLOSE);
			//최초 설정
//			buttonGroup.getButton(0).onDeActive();
			buttonGroup.setIndex(0);

			return buttonGroup;
		}

        function requestWishList(pageIndex, direction) {
            _this.isRequesting = true;
        	_this.model.setRequestPageIndex(pageIndex);
        	_this.model.setRequestDirection(direction);
            var transactionId = ++_this.transactionId;
            Communicator.requestWishList(callBackForRequestWishList, transactionId, ASSET_PROFILE, PAGE_SIZE, pageIndex, DURATION_BACK);
        }

        function callBackForRequestWishList(result) {
            if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    setData(result);
                    _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
                } else {
                    console.error("Failed to get datas from has.");
                    //if(result.resultCode == 205) {
                    //    //no item nothing to do
                    //} else {
                    //    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                    //}
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

        function setData(result) {
            var model = _this.model;

            if(result.wishItemList != undefined && result.wishItemList != null) {
                model.setTotalCount(result.totalCount);
                model.setTotalPage(result.totalPage);
                model.setData(result.wishItemList);
                model.setSize(result.wishItemList.length, 2, result.wishItemList.length, 2);
                model.setPageSize(PAGE_SIZE)
                if(model.getLastVIndex() != null)	{
                	model.setVIndex(model.getLastVIndex());
                	model.setLastVIndex(null);
                }
                else	{
	                model.setVIndex(model.getNextVIndexAfterRequest());
                }
                model.setCurrentPageIndex(model.getRequestPageIndex());
                model.setRotate(true, false);
            }
        };

        function requestRemoveWishItem(wishItem) {
            if(_this.isRequesting == true) {
                return;
            };
            _this.isRequesting = true;
            Communicator.requestRemoveWishItem(callBackForRequestRemoveWishItem, wishItem.getUserID(), wishItem.getAsset().getAssetID());
        }

        function callBackForRequestRemoveWishItem(result) {
            _this.isRequesting = false;
            if(Communicator.isSuccessResponseFromHAS(result) == true) {
                requestWishList(0, 1);
            } else {
                console.error("Failed to get datas from has.");
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
            };
        }

        function requestAssetInfo(assetId) {
            _this.isRequesting = true;
            Communicator.requestAssetInfo(callBackForRequestAssetInfo, assetId, 1);
        }

        function callBackForRequestAssetInfo(result) {
            _this.isRequesting = false;
            if(Communicator.isSuccessResponseFromHAS(result)) {
                goToVodDetail(result.asset);
            } else {
                console.error("Failed to get datas from has.");
                if(result.resultCode != undefined && result.resultCode != null ) {
                    goToVodDetail(null);
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
            }
        }

        function goToVodDetail(asset) {
            _this.isRequesting = false;
            if(asset == null) {
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ALERT, id:PopupValues.ID.ALERT_VOD_LICENSE_END});
            } else {
                var param = {};
                param.targetView = DefineView.DETAIL_VIEW;
                param.assetID = asset.getAssetID();
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            }
        }

        WishListView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var buttonGroup = _this.model.getButtonGroup();
//            console.log("WishListView, onKeyDown: " + keyCode );
            if(_this.isRequesting == true) {
                console.log("WishListView, isLoading key ignore: " +  isLoading);
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
                    var wishItem = _this.model.getData()[_this.model.getVIndex()];
                    var buttonLabel = buttonGroup.getFocusedButton().getLabel();
                    switch (buttonLabel) {
                        case CCABase.StringSources.ButtonLabel.DIRECT_VIEW:
                            _this.drawer.hideButtonGroup();
                            //goToVodDetail(wishItem);
                            requestAssetInfo(wishItem.getAsset().getAssetID());
                            break;
                        case CCABase.StringSources.ButtonLabel.DELETE:
                            _this.drawer.hideButtonGroup();
                            var id = PopupValues.ID.CONFIRM_DELETE_WISH_ITEM;
                            //PopupValues[id].headText = CCABase.StringSources.confirmDeleteWishItemHeadText+"<br>-"+wishItem.getAsset().getTitle()+"-";
                            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id, wishItem:wishItem});
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
            	if(_this.model.getTotalPage() > 1 && _this.model.getVIndex() == 0) {
            		requestWishList(_this.model.getPrePageIndex(), -1);
            	} else {
	                _this.keyNavigator.keyUp();
	            	_this.drawer.onUpdate();
	            	_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
            	}
                break;
            case tvKey.KEY_DOWN:
            	if(_this.model.getTotalPage() > 1 && _this.model.getVIndex() == _this.model.getVVisibleSize()-1) {
            		requestWishList(_this.model.getNextPageIndex(), 1);
            	} else {
	                _this.keyNavigator.keyDown();
	            	_this.drawer.onUpdate();
	            	_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
            	}
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
            param.pageIndex = model.getCurrentPageIndex();
            return param;
        }
        this.onInit();
    };
    WishListView.prototype = Object.create(View.prototype);

    return WishListView;
});
