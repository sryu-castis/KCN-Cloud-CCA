define(["framework/View", "framework/event/CCAEvent",
        "ui/menuViewGroup/purchaseBasedRecommendationView/PurchaseBasedRecommendationDrawer", 
        "ui/menuViewGroup/purchaseBasedRecommendationView/PurchaseBasedRecommendationModel",
        "service/Communicator", 'cca/type/SortType', 'cca/type/ProductType', "cca/DefineView", "cca/type/ViewerType"],
    function (View, CCAEvent, PurchaseBasedRecommendationDrawer, PurchaseBasedRecommendationModel, Communicator, SortType, ProductType, DefineView, ViewerType) {

        var PurchaseBasedRecommendationView = function () {
            View.call(this, DefineView.PURCHASE_BASED_RECOMMENDATION_VIEW);
            this.model = new PurchaseBasedRecommendationModel();
            this.drawer = new PurchaseBasedRecommendationDrawer(this.getID(), this.model);
            this.isRequesting = false;
            var _this = this;

            PurchaseBasedRecommendationView.prototype.onInit = function() {

            };

            PurchaseBasedRecommendationView.prototype.onKeyDown = function(event, param) {
                var model = _this.model;
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
//                console.log('PurchaseBasedRecommendationView, onKeyDown[keyCode: ' + keyCode + ']');

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        if(_this.model.getVIndex() == 0) {
                            goToPrevPage();
                        } else {
                            _this.keyNavigator.keyUp();
                            sendChangeFocus();   
                        }
                        updateRecommendContentList();
                        _this.drawer.onUpdate(); 

                        break;
                    case tvKey.KEY_DOWN:
                        if(isLastRowInCurrentPage() == true) {
                            goToNextPage();
                        } else {
                            _this.keyNavigator.keyDown();
                            sendChangeFocus();
                        }
                        updateRecommendContentList();
                        _this.drawer.onUpdate();

                        break;
                    case tvKey.KEY_LEFT:
                        sendFinishViewEvent();

                        break;
                    case tvKey.KEY_RIGHT:
                        changeToRecommendContentGroupView();

                        break;
                    case tvKey.KEY_EXIT:
                    case tvKey.KEY_ESC:
                    case tvKey.KEY_BACK:
                        sendFinishViewEvent();
                        break;
                    case tvKey.KEY_ENTER:
                        sendChangeViewGroupEvent();
                        break;
                    default:
                        break;
                }
                
                return true;
            };

            PurchaseBasedRecommendationView.prototype.onAfterStart = function (param) {
                this.hideTimerContainer();
            };
            PurchaseBasedRecommendationView.prototype.onAfterActive = function() {
                sendChangeFocus();
            }
            PurchaseBasedRecommendationView.prototype.onGetData = function (param) {
                requestPurchasedList(callBackForRequestPurchasedLog);
            };
            function requestPurchasedList(callback) {
                _this.isRequesting = true;
                var purchaseLogProfile = 2;
                // var productType = ["rvod", "package"].join(","); //rvod: single product, svod: free for month
                var productType = [ProductType.RVOD, ProductType.PACKAGE];
                var expiredLogStartTime = transformTimeFormatForExpiredLogTime(getTwoMonthsAgoTime(getNow()));
                var expiredLogEndTime = transformTimeFormatForExpiredLogTime(getNow());
                var sortType = SortType.REMAIN_TIME_DESC;
                var includeAdultCategory = 1;
                var excludeInvisible = 1;
                var pageIndex = 0;
//                console.log('expiredLogStartTime: ' + expiredLogStartTime + ', expiredLogEndTime: ' + expiredLogEndTime);
                Communicator.requestPurchasedProductListForRecommendation(callback, purchaseLogProfile, productType,
                    expiredLogStartTime, expiredLogEndTime, sortType, includeAdultCategory, excludeInvisible, PurchaseBasedRecommendationView.PAGE_SIZE, pageIndex);
            };
            function callBackForRequestPurchasedLog(result) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    if(result.purchaseLogList.length == 0) {
                        sendChangeViewToNoDataViewEvent();
                    } else {
                        var model = _this.model;
                        var verticalMaximumSize = result.totalCount;
                        var horizontalMaximumSize = PurchaseBasedRecommendationView.HORIZONTAL_VISIBLE_SIZE;

                        model.totalCount = result.totalCount;
                        model.setSize(PurchaseBasedRecommendationView.VERTICAL_VISIBLE_SIZE, PurchaseBasedRecommendationView.HORIZONTAL_VISIBLE_SIZE, verticalMaximumSize, horizontalMaximumSize);
                        model.setRotate(false, false);
                        model.setNextLineRotate(false);
                        setData(result);
                        if(result.purchaseLogList.length > 0) {
                            updateRecommendContentList();
                        }
                        _this.drawer.onUpdate();    
                    }
                } else {
                    console.error("Failed to get datas from has.", result);
                    sendChangeViewToNoDataViewEvent(result.resultCode);
                }
            }
            function setData(result) {
                _this.model.setPurchaseLogList(result.purchaseLogList);
            }

            function getNow() {
                return new Date($.now());
            }
            function transformTimeFormatForExpiredLogTime(now) {
                var temp = now;
                var stringNow = temp.toJSON().split(".")[0];
                return stringNow.replace("T", " ");
            }
            function getTwoMonthsAgoTime(now) {
                var temp = now;
                var year = temp.getFullYear();
                var month = temp.getMonth();
                month = month - 2;
                if(month < 0) {
                    month += 11;
                    year -= 1;
                }
                temp.setFullYear(year);
                temp.setMonth(month);
                return temp;
            }

            function goToPrevPage() {
                var model = _this.model;
                var totalPage = Math.ceil(model.getPurchaseLogList().length / model.getVVisibleSize());
                var currentPageIndex = model.getVStartIndex() / model.getVVisibleSize();
                if(currentPageIndex == 0) {
                    model.setVStartIndex((totalPage - 1) * model.getVVisibleSize());
                    model.setVIndex(model.getPurchaseLogList().length - model.getVStartIndex() - 1);
                } else {
                    model.setVStartIndex(model.getVStartIndex() - model.getVVisibleSize());
                    model.setVIndex(model.getVVisibleSize()-1);
                };
                sendChangeFocus();
            };

            function goToNextPage() {
                var model = _this.model;
                var totalPage = Math.ceil(model.getPurchaseLogList().length / model.getVVisibleSize());
                var currentPageIndex = model.getVStartIndex() / model.getVVisibleSize();
                if(currentPageIndex + 1 == totalPage) {
                    model.setVStartIndex(0);
                } else {
                    model.setVStartIndex(model.getVStartIndex() + model.getVVisibleSize());
                };
                model.setVIndex(0);
                sendChangeFocus();
            }

            function isLastRowInCurrentPage() {
                var model = _this.model;
                if(model.getVIndex() == model.getVVisibleSize() - 1 || 
                    model.getVStartIndex() + model.getVIndex() + 1 == model.getPurchaseLogList().length) {
                    return true;
                }

                return false;
            }

            function getSelectedItem() {
                var selectedItemIndex = _this.model.getVStartIndex() + _this.model.getVIndex();
                var selectedItem = _this.model.getPurchaseLogList()[selectedItemIndex];
                return selectedItem;
            }

            function changeToRecommendContentGroupView() {
//                console.log('changeToRecommendContentGroupView');
                // weeklyPopularityChartView.onActive();
                // _this.onDeActive();
                var param = {};
                param.targetView = DefineView.RECOMMEND_CONTENT_GROUP_VIEW;
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            }
            function updateRecommendContentList() {
                var param = {};
                var selectedItem = getSelectedItem();
                param.targetView = DefineView.RECOMMEND_CONTENT_GROUP_VIEW;
                param.assetId = selectedItem.getAssetID();
                param.purchasedTitle = selectedItem.getProductName();
                _this.sendEvent(CCAEvent.UPDATE_VIEW, param);
            }
            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            }
            function sendChangeViewToNoDataViewEvent(resultCode) {
                var param = {};
                param.errorCode = resultCode;
                param.targetView = DefineView.NO_DATA_VIEW;
                param.messageType = ViewerType.RECOMMEND;
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            }
            function sendChangeViewGroupEvent() {
                var param = {};
                param.targetView = DefineView.DETAIL_VIEW;
                param.assetID = getSelectedItem().getAssetID();
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            }
            function sendChangeFocus() {
                var model = _this.model;
                var param = {};
                param.vIndex = model.getVIndex();
                param.vStartIndex = model.getVStartIndex();
                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
            }
            this.onInit();
        };

        PurchaseBasedRecommendationView.prototype = Object.create(View.prototype);

        //var verticalVisibleSize = 6;
        //var horizontalVisibleSize = 1;
        PurchaseBasedRecommendationView.VERTICAL_VISIBLE_SIZE      = 6;
        PurchaseBasedRecommendationView.HORIZONTAL_VISIBLE_SIZE    = 1;
        PurchaseBasedRecommendationView.PAGE_SIZE                  = 0;

        return PurchaseBasedRecommendationView;
    });