define(["framework/View", "framework/event/CCAEvent",
        "ui/mytvViewGroup/purchasedListView/PurchasedListDrawer","ui/mytvViewGroup/purchasedListView/PurchasedListModel",
        "service/Communicator", "cca/type/ProductType", "helper/DateHelper", "framework/modules/ButtonGroup", "cca/PopupValues", "cca/DefineView",
        "cca/model/BundleProduct", "cca/type/VisibleTimeType"],
        function(View, CCAEvent, PurchasedListDrawer, PurchasedListModel, Communicator, ProductType, DateHelper, ButtonGroup, PopupValues, DefineView,
                 BundleProduct, VisibleTimeType) {

    var PurchasedListView = function() {
        View.call(this, DefineView.PURCHASED_LIST_VIEW);
        this.model = new PurchasedListModel();
        this.drawer = new PurchasedListDrawer(this.getID(), this.model);
        
        var PURCHASE_LOG_PROFILE = 5;
        var PRODUCT_TYPE = [ProductType.RVOD, ProductType.BUNDLE, ProductType.PACKAGE];
        var SORT_TYPE = "remainingTimeDescend";
        var INCLUDE_ADULT_CATEGORY = 1;
        var EXCLUDE_INVISIBLE = 1;
        var PAGE_SIZE = 6;
        var DURATION_BACK = 60;

        var STATE_BUTTON_GROUP = 1;
        
        var _this = this;

        PurchasedListView.prototype.onInit = function() {
        };

        PurchasedListView.prototype.onBeforeStart = function() {
            this.transactionId = $.now() % 1000000;
            this.isRequesting = false;
            _this.model.setIsListFetched(false);
        };

        PurchasedListView.prototype.onAfterStart = function() {
			_this.hideTimerContainer();
		}

        PurchasedListView.prototype.onGetData = function(param) {
        	_this.model.setButtonGroup(getButtonGroup());

            var pageIndex = 0;

            requestPurchasedProductList(pageIndex, 1);
        };

        PurchasedListView.prototype.onPopupResult = function(param) {
//            console.log("PurchasedListView.prototype.onPopupResult");

            if (param.popupType != undefined && param.popupType == PopupValues.PopupType.ERROR) {
                _this.drawer.hideButtonGroup();
                _this.sendEvent(CCAEvent.CHANGE_VIEW, getEventParamObject(DefineView.CATEGORY_LIST_VIEW));
            } else {
                if (param.id == PopupValues.ID.CONFIRM_DELETE_PURCHASED_VOD && param.result == CCABase.StringSources.ButtonLabel.CONFIRM) {
                    requestDisablePurchaseLog(param.purchaseLog);
                } else if (param.id == PopupValues.ID.ALERT_VOD_LICENSE_END) {

                }
            }
        };

        PurchasedListView.prototype.onResult = function(param) {
//            console.log("PurchasedListView.prototype.onResult");
        }
        
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
        
        function requestPurchasedProductList(pageIndex, direction) {

            _this.isRequesting = true;

            var date = new Date();
            var expiredLogEndTime = DateHelper.getDateTime(date);
            date.setDate(date.getDate()-DURATION_BACK);
        	var expiredLogStartTime = DateHelper.getDateTime(date);
        	
        	_this.model.setRequestPageIndex(pageIndex);
        	_this.model.setRequestDirection(direction);

            var transactionId = ++_this.transactionId;
        	
        	Communicator.requestPurchasedProductList(callBackForRequestPurchasedProductList, transactionId, PURCHASE_LOG_PROFILE, PRODUCT_TYPE, expiredLogStartTime, expiredLogEndTime, SORT_TYPE, INCLUDE_ADULT_CATEGORY, EXCLUDE_INVISIBLE, PAGE_SIZE, pageIndex);
        }

        function callBackForRequestPurchasedProductList(result) {
            if(Communicator.isCorrectTransactionID(_this.transactionId, result)) {
                _this.isRequesting = false;
                if (Communicator.isSuccessResponseFromHAS(result) == true) {
                    setData(result);
                    _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
                } else {
                    console.error("Failed to get datas from has.");
                    //_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup: DefineView.POPUP_VIEWGROUP,popupType: PopupValues.PopupType.ERROR,id: result.resultCode});
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

        function requestDisablePurchaseLog(purchaseLog) {
            if(_this.isRequesting == true) {
                return;
            };
            _this.isRequesting = true;
            Communicator.requestDisablePurchaseLog(callBackForRequestDisablePurchaseLog, purchaseLog.getPurchasedID());
        }

        function callBackForRequestDisablePurchaseLog(result) {
            _this.isRequesting = false;
            if(Communicator.isSuccessResponseFromHAS(result) == true) {
                requestPurchasedProductList(0, 1);
            } else {
                console.error("Failed to get datas from has.");
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
            };
        };


        function setData(result) {
            var model = _this.model;

            if(result.purchaseLogList != undefined && result.purchaseLogList != null) {
                model.setTotalCount(result.totalCount);
                model.setTotalPage(result.totalPage);
                model.setData(result.purchaseLogList);
                //model.setSize(result.purchaseLogList.length, model.getButtonGroup().getSize()+1, PAGE_SIZE, model.getButtonGroup().getSize()+1);
                model.setSize(result.purchaseLogList.length, 2, result.purchaseLogList.length, 2);
                model.setPageSize(PAGE_SIZE)
                if(model.getLastVIndex() != null)	{
                	model.setVIndex(model.getLastVIndex());
                	model.setLastVIndex(null);
                }
                else	{
	                model.setVIndex(model.getNextVIndexAfterRequest());
                }
                
                model.setCurrentPageIndex(model.getRequestPageIndex());
                model.setRotate(false, false);
            }
        };


        function requestAssetInfo(assetId) {
            _this.isRequesting = true;
            Communicator.requestAssetInfo(callBackForRequestAssetInfo, assetId, 1);
        }

        function callBackForRequestAssetInfo(result) {
            _this.isRequesting = false;
            if(Communicator.isSuccessResponseFromHAS(result)) {
                goToVodAssetDetail(result.asset);
            } else {
                console.error("Failed to get datas from has.");
                if(result.resultCode != undefined && result.resultCode != null ) {
                    goToVodAssetDetail(null);
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
            }
        }

        function goToVodDetail(purchaseLog) {
            if(ProductType.BUNDLE == purchaseLog.getProductType()) {
                requestGetBundleProductInfo(purchaseLog.getProductId());
            } else  {
                requestAssetInfo(purchaseLog.getAssetID());
            }
        }

        function goToVodAssetDetail(asset) {
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

        function requestGetBundleProductInfo(productId) {
            if(_this.isRequesting == true) {
                return;
            };
            _this.isRequesting = true;
            Communicator.requestGetBundleProductInfo(callBackForRequestGetBundleProductInfo, productId, productId, 1);
        }

        function callBackForRequestGetBundleProductInfo(result) {
            _this.isRequesting = false;
            if(Communicator.isSuccessResponseFromHAS(result) == true) {
                goToBundleDetail(result.bundleProduct);
            } else {
                console.error("Failed to get datas from has.");
                if(result.resultCode != undefined && result.resultCode != null ) {
                    goToBundleDetail(null);
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
            };
        }

        function goToBundleDetail(bundleProduct) {
            if(bundleProduct == null) {
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ALERT, id:PopupValues.ID.ALERT_VOD_LICENSE_END});
            } else {
                var param = {};
                param.targetView = DefineView.BUNDLE_PRODUCT_VIEW;
                param.bundleProduct = bundleProduct;
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            }
        }

        PurchasedListView.prototype.onKeyDown = function(event, param) {
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
                    var purchaseLog = _this.model.getData()[_this.model.getVIndex()];
                    var buttonLabel = buttonGroup.getFocusedButton().getLabel();
                    switch (buttonLabel) {
                        case CCABase.StringSources.ButtonLabel.DIRECT_VIEW:
                            _this.drawer.hideButtonGroup();
                            goToVodDetail(purchaseLog);
                            break;
                        case CCABase.StringSources.ButtonLabel.DELETE:
                            _this.drawer.hideButtonGroup();
                            var id = PopupValues.ID.CONFIRM_DELETE_PURCHASED_VOD;
                            var title = purchaseLog.getAssetTitle();
                            if(ProductType.BUNDLE == purchaseLog.getProductType()) {
                                title = purchaseLog.getProductName();
                            }
                            PopupValues[id].headText = CCABase.StringSources.confirmDeletePurchasedVODHeadText+"<br>-"+title+"-";
                            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id, purchaseLog:purchaseLog});
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
            	_this.drawer.hideButtonGroup();
            	if(_this.model.getTotalPage() > 1 && _this.model.getVIndex() == 0) {
            		requestPurchasedProductList(_this.model.getPrePageIndex(), -1);
            	} else {
	                _this.keyNavigator.keyUp();
	            	_this.drawer.onUpdate();
	            	_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
            	}
                break;
            case tvKey.KEY_DOWN:
            	_this.drawer.hideButtonGroup();
            	if(_this.model.getTotalPage() > 1 && _this.model.getVIndex() == _this.model.getVVisibleSize()-1) {
            		requestPurchasedProductList(_this.model.getNextPageIndex(), 1);
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
    PurchasedListView.prototype = Object.create(View.prototype);
    
    return PurchasedListView;
});
