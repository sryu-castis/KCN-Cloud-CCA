define(["framework/View", "framework/event/CCAEvent",
        "ui/menuViewGroup/weeklyPopularityChartView/WeeklyPopularityChartDrawer", "ui/menuViewGroup/weeklyPopularityChartView/WeeklyPopularityChartModel",
        "service/Communicator", "cca/DefineView", 'cca/type/VisibleTimeType'],
    function (View, CCAEvent, WeeklyPopularityChartDrawer, WeeklyPopularityChartModel, Communicator, DefineView, VisibleTimeType) {

        var WeeklyPopularityChartView = function () {
            View.call(this, DefineView.WEEKLY_POPULARITY_CHART_VIEW);
            this.model = new WeeklyPopularityChartModel();
            this.drawer = new WeeklyPopularityChartDrawer(this.getID(), this.model);
            var _this = this;

            WeeklyPopularityChartView.prototype.onInit = function() {

            };
            WeeklyPopularityChartView.prototype.onBeforeStart = function () {
                _this = this;
            };
            WeeklyPopularityChartView.prototype.onAfterStart = function (param) {
                // _this.onHide();
            };

            WeeklyPopularityChartView.prototype.onKeyDown = function(event, param) {
                 var model = _this.model;
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
//                console.log('WeeklyPopularityChartView, onKeyDown[keyCode: ' + keyCode + ']');

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
                        changeToDailyPopularityChartView();
                        sendChangeFocus();
                        break;
                    case tvKey.KEY_RIGHT:

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
                }

                return true;
            };
            WeeklyPopularityChartView.prototype.onAfterActive = function() {
                _this = this;
                updatePoster(getPosterInfo());
                sendChangeFocus();
            }

            WeeklyPopularityChartView.prototype.onGetData = function (param) {
                this.model.focusedCategory = param.focusedCategory;
                var categoryType = param.categoryType;
                var currentCategoryID = param.focusedCategory.getCategoryID();
                var vIndex = param.vIndex;
                var hIndex = param.hIndex;
                var vStartIndex = param.vStartIndex;
                this.model.setVIndex(vIndex | 0);
                this.model.setHIndex(hIndex | 0);
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
                var selectedItem = _this.model.getPopularityList()[selectedItemIndex];
                return selectedItem;
            };

            function getPosterInfo() {
                var selectedItem = getSelectedItem();
                var posterInfo = {};
                posterInfo.assetId = selectedItem.getAssetId();
                posterInfo.ranking = selectedItem.getRanking() + '위';
                posterInfo.chartType = 'weekly';

                return posterInfo;
            };

            function updatePoster(param) {
                var assetId = param.assetId;
                var chartType = param.chartType;
                var ranking = param.ranking;
                _this.model.posterInfo = param;
                
                requestAssetInfo(callBackForRequestAssetInfo, assetId);
            };

            function callBackForRequestAssetInfo(result) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    _this.drawer.updatePoster(result.asset);
                } else {
                    console.error("Failed to get datas from has." );
                    _this.drawer.updatePoster(null);
                };
                _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
            };

            function requestAssetInfo(callback, assetId) {
                _this.isRequesting = true;
                Communicator.requestAssetInfo(callback, assetId, 7);
            };

            function requestContentList(callback, categoryId, pageSize, pageIndex) {
                _this.isRequesting = true;
                var profile = 0;
                var requestItems = 'weekly';
                Communicator.requestPopularityChart(callback, categoryId, profile, requestItems, pageSize, pageIndex);
            };
            function callBackForRequestPopularityChart(result) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    var model = _this.model;
                    model.totalCount = result.weeklyChart.totalCount;
                    model.totalPage = result.weeklyChart.totalPage;
                    
                    var verticalVisibleSize = 7;
                    var horizontalVisibleSize = 1;
                    var verticalMaximumSize = model.totalCount;
                    var horizentalMaximumSize = horizontalVisibleSize;
                    
                    model.setSize(verticalVisibleSize, horizontalVisibleSize, verticalMaximumSize, horizentalMaximumSize);
                    model.setRotate(true, false);
                    model.setNextLineRotate(false);
                    setData(result.weeklyChart.popularityList);
                    _this.drawer.onUpdate();
                    //updatePoster(getPosterInfo());
                     _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);

                } else {
                    console.error("Failed to get datas from has. error: " + result.errorString);
                    setData([]);
                    _this.drawer.onUpdate();
                    _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
                };
            };
            function setData(popularityList) {
                _this.model.setPopularityList(popularityList);
            };

            function changeToDailyPopularityChartView() {
//                console.log('changeToDailyPopularityChartView');
                var param = {};
                param.focusedCategory = _this.model.focusedCategory;
                param.targetView = DefineView.DAILY_POPULARITY_CHART_VIEW;
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

        WeeklyPopularityChartView.prototype = Object.create(View.prototype);

        return WeeklyPopularityChartView;
    });