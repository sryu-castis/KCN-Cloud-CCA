define(["framework/View", "framework/event/CCAEvent",
        "ui/mytvViewGroup/watchedListView/WatchedListDrawer","ui/mytvViewGroup/watchedListView/WatchedListModel",
        "service/Communicator", "cca/type/ProductType", "helper/DateHelper", "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView", "cca/type/VisibleTimeType"],
        function(View, CCAEvent, WatchedListDrawer, WatchedListModel, Communicator, ProductType, DateHelper, ButtonGroup, PopupValues, DefineView, VisibleTimeType) {

    var WatchedListView = function() {
        View.call(this, DefineView.WATCHED_LIST_VIEW);
        this.model = new WatchedListModel();
        this.drawer = new WatchedListDrawer(this.getID(), this.model);
        
        var SERVICE_LOG_PROFILE = 3;
        var PRODUCT_TYPE = "all";
        var ASSET_DUPLICATION_SHOW_METHOD = 0;
        var PAGE_SIZE = 6;
        var DURATION_BACK = 7;

        var STATE_BUTTON_GROUP = 1;

        var _this = this;

        WatchedListView.prototype.onInit = function() {
        };

        WatchedListView.prototype.onBeforeStart = function() {
            this.transactionId = $.now() % 1000000;
            this.isRequesting = false;
            _this.model.setIsListFetched(false);
        };

        WatchedListView.prototype.onAfterStart = function() {
			_this.hideTimerContainer();
		}

        WatchedListView.prototype.onGetData = function(param) {
        	_this.model.setButtonGroup(getButtonGroup());

            var pageIndex = 0;
            requestWatchedList(pageIndex, 1);
        };

        WatchedListView.prototype.onPopupResult = function(param) {
            if (param.popupType != undefined && param.popupType == PopupValues.PopupType.ERROR) {
                _this.drawer.hideButtonGroup();
                _this.sendEvent(CCAEvent.CHANGE_VIEW, getEventParamObject(DefineView.CATEGORY_LIST_VIEW));
            } else {
                if (param.id == PopupValues.ID.CONFIRM_DELETE_SERVICE_LOG && param.result == CCABase.StringSources.ButtonLabel.CONFIRM) {
                    requestDisableServiceLog(param.serviceLog);
                } else if (param.id == PopupValues.ID.ALERT_VOD_LICENSE_END) {
                    //nothing to do
                }
            }

        };
        
        function getButtonGroup() {
			var buttonGroup = new ButtonGroup(3);
			//Label 설정
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.DIRECT_VIEW);
			buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.DELETE);
			buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CLOSE);
			buttonGroup.setIndex(0);

			return buttonGroup;
		}

        function requestWatchedList(pageIndex, direction) {
            _this.isRequesting = true;

            var date = new Date();
            var endTime = DateHelper.getDateTime(date);
            date.setDate(date.getDate()-DURATION_BACK);
        	var startTime = DateHelper.getDateTime(date);
        	
        	_this.model.setRequestPageIndex(pageIndex);
        	_this.model.setRequestDirection(direction);

            var transactionId = ++_this.transactionId;

        	Communicator.requestServiceLogList(callBackForRequestWatchedList, transactionId, SERVICE_LOG_PROFILE, startTime, endTime, PRODUCT_TYPE, ASSET_DUPLICATION_SHOW_METHOD, PAGE_SIZE, pageIndex);
        }
        
        function callBackForRequestWatchedList(result) {
            if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
                _this.isRequesting = false;
                if (Communicator.isSuccessResponseFromHAS(result) == true) {
                    setData(result);
                    _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
                } else {
                    console.error("Failed to get datas from has.");
                    //_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup: DefineView.POPUP_VIEWGROUP, popupType: PopupValues.PopupType.ERROR, id: result.resultCode});
                }
                _this.model.setIsListFetched(true);
                _this.drawer.onUpdate();
                _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
                if (_this.model.getData() == null || _this.model.getData().length == 0) {
                    _this.drawer.hideButtonGroup();
                    _this.sendEvent(CCAEvent.CHANGE_VIEW, getEventParamObject(DefineView.CATEGORY_LIST_VIEW));
                }
            } else if(result.transactionId == undefined) {
                _this.isRequesting = false;
            }
        };

        function requestDisableServiceLog(serviceLog) {
            if(_this.isRequesting == true) {
                return;
            };
            _this.isRequesting = true;
            Communicator.requestDisableServiceLog(callBackForRequestDisableServiceLog, serviceLog.getAssetID(), serviceLog.getProductID(), serviceLog.getGoodID());
        }

        function callBackForRequestDisableServiceLog(result) {
            _this.isRequesting = false;
            if(Communicator.isSuccessResponseFromHAS(result) == true) {
                requestWatchedList(0, 1);
            } else {
                console.error("Failed to get datas from has.");
                //_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
            };
            _this.model.setIsListFetched(true);
        };

        function setData(result) {
            var model = _this.model;

            if(result.serviceLogList != undefined && result.serviceLogList != null) {
                model.setTotalCount(result.totalCount);
                model.setTotalPage(result.totalPage);
                model.setData(result.serviceLogList);
                model.setSize(result.serviceLogList.length, 2, result.serviceLogList.length, 2);
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

        function requestAssetInfo(assetId) {
            _this.isRequesting = true;
            Communicator.requestAssetInfo(callBackForRequestAssetInfo, assetId, 1);

            //test
            //assetId = "www.wisepeer.com|T0002573MKM000010294";
            //Communicator.requestAssetInfo(callBackForRequestAssetInfo, assetId, 9);
        }

        function  callBackForRequestAssetInfo(result) {
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

        WatchedListView.prototype.onKeyDown = function(event, param) {
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
                    var serviceLog = _this.model.getData()[_this.model.getVIndex()];
                    var buttonLabel = buttonGroup.getFocusedButton().getLabel();
                    switch (buttonLabel) {
                        case CCABase.StringSources.ButtonLabel.DIRECT_VIEW:
                            _this.drawer.hideButtonGroup();
                            requestAssetInfo(serviceLog.getAssetID());
                            break;
                        case CCABase.StringSources.ButtonLabel.DELETE:
                            _this.drawer.hideButtonGroup();
                            var id = PopupValues.ID.CONFIRM_DELETE_SERVICE_LOG;
                            PopupValues[id].headText = CCABase.StringSources.confirmDeleteServiceLogHeadText+"<br>-"+serviceLog.getAssetTitle()+"-";
                            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id, serviceLog:serviceLog});
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
            		requestWatchedList(_this.model.getPrePageIndex(), -1);
            	} else {
	                _this.keyNavigator.keyUp();
	            	_this.drawer.onUpdate();
	            	_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
            	}
                break;
            case tvKey.KEY_DOWN:
            	if(_this.model.getTotalPage() > 1 && _this.model.getVIndex() == _this.model.getVVisibleSize()-1) {
                    requestWatchedList(_this.model.getNextPageIndex(), 1);
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
            param.vIndex = model.getVIndex();
            param.vStartIndex = model.getVStartIndex();
            param.pageIndex = model.getCurrentPageIndex();
            return param;
        }
        this.onInit();
    };
    WatchedListView.prototype = Object.create(View.prototype);

    return WatchedListView;
});
