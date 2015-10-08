define(["framework/View", "framework/event/CCAEvent",
        "ui/menuViewGroup/dailyPopularityChartView/DailyPopularityChartDrawer", "ui/menuViewGroup/dailyPopularityChartView/DailyPopularityChartModel",
        "service/Communicator", "cca/DefineView", 'cca/type/VisibleTimeType'],
    function (View, CCAEvent, DailyPopularityChartDrawer, DailyPopularityChartModel, Communicator, DefineView, VisibleTimeType) {

        var DailyPopularityChartView = function (weeklyPopularityChartView) {
            View.call(this, DefineView.DAILY_POPULARITY_CHART_VIEW);
            this.model = new DailyPopularityChartModel();
            this.drawer = new DailyPopularityChartDrawer(this.getID(), this.model);
            this.pageSize = 20;
            this.isRequesting = false;
            var _this = this;

            DailyPopularityChartView.prototype.onInit = function() {
            };
            DailyPopularityChartView.prototype.onBeforeStart = function () {
                _this = this;
            };
            DailyPopularityChartView.prototype.onAfterStart = function (param) {
                // _this.onHide();
                _this.hideTimerContainer();
                //weeklyPopularityChartView.onStart(param);
            };
            DailyPopularityChartView.prototype.onAfterStop = function () {
                //weeklyPopularityChartView.onStop();
            }

            DailyPopularityChartView.prototype.onKeyDown = function(event, param) {
                var model = _this.model;
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
//                console.log('DailyPopularityChartView, onKeyDown[keyCode: ' + keyCode + ']');

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        if(_this.model.getVIndex() == 0) {
                            goToPrevPage();
                        } else {
                            _this.keyNavigator.keyUp();   
                            sendChangeFocus();
                        };
                        _this.drawer.onUpdate(); 

                        updatePoster(getPosterInfo());
                        break;
                    case tvKey.KEY_DOWN:
                        if(isLastRowInCurrentPage() == true) {
                            goToNextPage();
                        } else {
                            _this.keyNavigator.keyDown();
                            sendChangeFocus();
                        };
                        _this.drawer.onUpdate();

                        updatePoster(getPosterInfo());
                        break;
                    case tvKey.KEY_LEFT:
                        sendFinishViewEvent();

                        break;
                    case tvKey.KEY_RIGHT:
                        sendChangeFocus();
                        changeToWeeklyPopularityChartView();

                        break;
                    case tvKey.KEY_EXIT:
                    case tvKey.KEY_BACK:
                        sendFinishViewEvent();
                        break;
                    case tvKey.KEY_ENTER:
                        sendChangeViewGroupEvent();
                        break;
                    default:
                        break;
                };
                
                return true;
            };
            DailyPopularityChartView.prototype.onBeforeActive = function() {
                _this = this;
            };
            DailyPopularityChartView.prototype.onAfterActive = function() {
                _this = this;
                updatePoster(getPosterInfo());
                sendChangeFocus();
            };

            DailyPopularityChartView.prototype.onGetData = function (param) {
                this.model.focusedCategory = param.focusedCategory;
                var currentCategoryID = param.focusedCategory.getCategoryID();
                var vIndex = param.vIndex;
                var hIndex = param.hIndex;
                var vStartIndex = param.vStartIndex;
                this.model.setVIndex(vIndex | 0);
                this.model.setVStartIndex(vStartIndex | 0);

                requestContentList(callBackForRequestPopularityChart, currentCategoryID, 20, 0);
            };

            function goToPrevPage() {
                var model = _this.model;
                var totalPage = Math.ceil(model.getPopularityList().length / model.getVVisibleSize());
                var currentPageIndex = model.getVStartIndex() / model.getVVisibleSize();
                if(currentPageIndex == 0) {
                    model.setVStartIndex((totalPage - 1) * model.getVVisibleSize());
                    model.setVIndex(model.getPopularityList().length - model.getVStartIndex() - 1);
                } else {
                    model.setVStartIndex(model.getVStartIndex() - model.getVVisibleSize());
                    model.setVIndex(model.getVVisibleSize()-1);
                };
                sendChangeFocus();
            };

            function goToNextPage() {
                var model = _this.model;
                var totalPage = Math.ceil(model.getPopularityList().length / model.getVVisibleSize());
                var currentPageIndex = model.getVStartIndex() / model.getVVisibleSize();
                if(currentPageIndex + 1 == totalPage) {
                    model.setVStartIndex(0);
                } else {
                    model.setVStartIndex(model.getVStartIndex() + model.getVVisibleSize());
                };
                model.setVIndex(0);
                sendChangeFocus();
            };

            function isLastRowInCurrentPage() {
                var model = _this.model;
                if(model.getVIndex() == model.getVVisibleSize() - 1 || 
                    model.getVStartIndex() + model.getVIndex() + 1 == model.getPopularityList().length) {
                    return true;
                };

                return false;
            };

            function getSelectedItem() {
                var selectedItemIndex = _this.model.getVStartIndex() + _this.model.getVIndex();
                if(_this.model.getPopularityList()) {
                    var selectedItem = _this.model.getPopularityList()[selectedItemIndex];
                    return selectedItem;
                } else {
                    return null;
                }
            };

            function getPosterInfo() {
                var selectedItem = getSelectedItem();
                if(selectedItem) {
                    var posterInfo = {};
                    posterInfo.assetId = selectedItem.getAssetId();
                    posterInfo.ranking = selectedItem.getRanking() + '위';
                    posterInfo.chartType = 'daily';

                    return posterInfo;
                } else {
                    return null;
                }

            };

            function updatePoster(param) {
                if(param) {
                    var assetId = param.assetId;
                    var chartType = param.chartType;
                    var ranking = param.ranking;
                    _this.model.posterInfo = param;

                    requestAssetInfo(callBackForRequestAssetInfo, assetId);
                } else {
                    _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
                }
            };

            function callBackForRequestAssetInfo(result) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
//                    console.log(result);
                    _this.drawer.updatePoster(result.asset);
                } else {
                    console.error("Failed to get datas from has." );
                    _this.drawer.updatePoster(null);
                };
                _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
            };

            function requestAssetInfo(callback, assetId) {
                _this.isRequesting = true;
//                console.log('assetid: ' + assetId);
                Communicator.requestAssetInfo(callback, assetId, 7);
            };


            function requestContentList(callback, categoryId, pageSize, pageIndex) {
                _this.isRequesting = true;
//                console.log('categoryId: ' + categoryId);
                var profile = 0;
                var requestItems = 'daily';
                Communicator.requestPopularityChart(callback, categoryId, profile, requestItems, pageSize, pageIndex);
            };
            function callBackForRequestPopularityChart(result) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    var model = _this.model;
                    model.totalCount = result.dailyChart.totalCount;
                    model.totalPage = result.dailyChart.totalPage;
                    
                    var verticalVisibleSize = 7;
                    var horizontalVisibleSize = 1;
                    var verticalMaximumSize = model.totalCount;
                    var horizentalMaximumSize = horizontalVisibleSize;
                    
                    model.setSize(verticalVisibleSize, horizontalVisibleSize, verticalMaximumSize, horizentalMaximumSize);
                    model.setRotate(true, false);
                    model.setNextLineRotate(false);
                    setData(result.dailyChart.popularityList);
                    _this.drawer.onUpdate();

                    updatePoster(getPosterInfo());
                } else {
                    console.error("Failed to get datas from has.");
                    setData([]);
                    _this.drawer.onUpdate();

                    _this.drawer.updatePoster(null);
                    _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
                };
            };
            function setData(popularityList) {
                _this.model.setPopularityList(popularityList);
//                console.log(_this.model.getPopularityList());
            };

            function changeToWeeklyPopularityChartView() {
//                console.log('changeToWeeklyPopularityChartView');
                // weeklyPopularityChartView.onActive();
                // _this.onDeActive();
                var param = {};
                param.focusedCategory = _this.model.focusedCategory;
                param.targetView = DefineView.WEEKLY_POPULARITY_CHART_VIEW;
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            };
            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };
            function sendChangeViewGroupEvent() {
                var param = {};
                param.focusedCategory = _this.model.focusedCategory;
                param.targetView = DefineView.DETAIL_VIEW;
                param.assetID = _this.model.posterInfo.assetId;
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            };

            function sendChangeFocus() {
                var model = _this.model;
                var param = {};
                param.vIndex = model.getVIndex();
                param.vStartIndex = model.getVStartIndex();
                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
            };

            this.onInit();
        };

        DailyPopularityChartView.prototype = Object.create(View.prototype);

        return DailyPopularityChartView;
    });