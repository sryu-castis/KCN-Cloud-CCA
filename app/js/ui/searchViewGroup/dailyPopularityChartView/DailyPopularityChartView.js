define(["framework/View", "framework/event/CCAEvent",
        "ui/searchViewGroup/dailyPopularityChartView/DailyPopularityChartDrawer", "ui/menuViewGroup/dailyPopularityChartView/DailyPopularityChartModel",
        "service/Communicator", "cca/DefineView", "service/STBInfoManager", "cca/type/VisibleTimeType"],
    function (View, CCAEvent, DailyPopularityChartDrawer, DailyPopularityChartModel, Communicator, DefineView, STBInfoManager, VisibleTimeType) {

        var DailyPopularityChartView = function () {
            View.call(this, DefineView.SEARCH_DAILY_POPULARITY_CHART_VIEW);
            this.model = new DailyPopularityChartModel();
            this.drawer = new DailyPopularityChartDrawer(this.getID(), this.model);
            this.pageSize = 20;
            this.isRequesting = false;
            var _this = this;

            DailyPopularityChartView.prototype.onInit = function() {
            };

            DailyPopularityChartView.prototype.onBeforeStart = function(param) {
                _this = this;
            };
            DailyPopularityChartView.prototype.onAfterStart = function (param) {
                //_this.hideTimerContainer();
            };
            DailyPopularityChartView.prototype.onKeyDown = function(event, param) {
                var model = _this.model;
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
//                console.log('DailyPopularityChartView, onKeyDown[keyCode: ' + keyCode + ']');

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        if(model.getVStartIndex() == 0 && model.getVIndex() == 0) {
                            sendChangeViewEvent(DefineView.SEARCH_VIEW);
                        } else if(_this.model.getVIndex() == 0) {
                            goToPrevPage();
                        } else {
                            _this.keyNavigator.keyUp();   
                            sendChangeFocus();
                        };
                        _this.drawer.onUpdate(); 

                        break;
                    case tvKey.KEY_DOWN:
                        if(isLastRowInCurrentPage() == true) {
                            goToNextPage();
                        } else {
                            _this.keyNavigator.keyDown();
                            sendChangeFocus();
                        };
                        _this.drawer.onUpdate();

                        break;
                    case tvKey.KEY_LEFT:
						sendChangeViewEvent(DefineView.SEARCH_SUBSCRIBER_BASED_RECOMMANDATION_VIEW);
                        break;
                    case tvKey.KEY_RIGHT:
                        sendChangeViewEvent(DefineView.SEARCH_WEEKLY_POPULARITY_CHART_VIEW);

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
                };
                return true;
            };

            DailyPopularityChartView.prototype.onGetData = function (param) {
                // var currentCategoryID = param.currentCategoryID;
                var vIndex = param.vIndex;
                var hIndex = param.hIndex;
                var vStartIndex = param.vStartIndex;
                this.model.setVIndex(vIndex | 0);
                this.model.setHIndex(hIndex | 0);
                this.model.setVStartIndex(vStartIndex | 0);

                var categoryId = STBInfoManager.getChartCategoryId();
                requestContentList(callBackForRequestPopularityChart, categoryId, 20, 0);
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

            function callBackForRequestAssetInfo(result) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
//                    console.log(result);
                } else {
                    console.error("Failed to get datas from has." );
                };
            };

            function requestAssetInfo(callback, assetId) {
                _this.isRequesting = true;
//                console.log('assetid: ' + assetId);
                Communicator.requestAssetInfo(callback, assetId, 3);
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

                } else {
                    console.error("Failed to get datas from has.");
                };
            };
            function setData(popularityList) {
                _this.model.setPopularityList(popularityList);
            };
            function getEventParamObject()	{
            	 var param = {};
                 param.vIndex = _this.model.getVIndex();
                 param.vStartIndex = _this.model.getVStartIndex();
                 param.hIndex = 0;
                 return param;
            }
            function sendChangeViewEvent(targetView) {
//                console.log('sendChangeViewEvent');
                // weeklyPopularityChartView.onActive();
                // _this.onDeActive();
                var param = {};
                param.targetView = targetView;
                param.vIndex = _this.model.getVIndex();
                param.hIndex = 1;
                param.vStartIndex = _this.model.getVStartIndex();
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);

            };
            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };
            function sendChangeFocus()	{
                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
            }
            function sendChangeViewGroupEvent() {
                var param = {};
                param.targetView = DefineView.DETAIL_VIEW;
                var index = _this.model.getVIndex() + _this.model.getVStartIndex();
                var popularityList = _this.model.getPopularityList()[index];
                param.assetID = popularityList.getAssetId();
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            };

            this.onInit();
        };

        DailyPopularityChartView.prototype = Object.create(View.prototype);

        return DailyPopularityChartView;
    });
