define(["framework/View", "framework/event/CCAEvent",
        "ui/menuViewGroup/categoryListView/CategoryListDrawer","ui/searchResultViewGroup/resultCategoryListView/ResultCategoryListModel",
        "service/Communicator", 'cca/model/Category', 'cca/type/ViewerType', "cca/type/VisibleTimeType", "service/CCAInfoManager"],
		function(View, CCAEvent, CategoryListDrawer, ResultCategoryListModel, Communicator, Category, ViewerType, VisibleTimeType, CCAInfoManager) {

	var ResultCategoryListView = function() {
        View.call(this, "searchResultCategoryListView");
		this.model = new ResultCategoryListModel();
		this.drawer = new CategoryListDrawer(this.getID(), this.model);
        var VERTICAL_VISIBLE_LIST_COUNT = 8;
		var _this = this;
        var changeFocusEventTimer = null;
        var BLOCK_TIME_FOR_CHANGE_FOCUS = CCAInfoManager.getCategoryKeyBlockTime();

        ResultCategoryListView.prototype.onInit = function() {

        };

        ResultCategoryListView.prototype.onAfterStart = function() {
            _this.hideTimerContainer();
        };

        // View.onStart
		ResultCategoryListView.prototype.onGetData = function(param) {
            setData(param);
            _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
            _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
        };

        function requestRecommendContentGroupByAssetId(assetID) {
            var contentGroupProfile = "2";
            var recommendField = "all";
            var recommendFieldValue = "";
            var includeResultCategoryList = '1';
            Communicator.requestRecommendContentGroupByAssetId(callBackForRequestRecommendContentGroupByAssetId, assetID, contentGroupProfile, recommendField, recommendFieldValue, 0, 0, includeResultCategoryList);

        }

        function callBackForRequestRecommendContentGroupByAssetId(response) {
            console.log(response);
            if(Communicator.isSuccessResponseFromHAS(response)) {
                _this.model.setResultCategoryList(response.resultCategoryList);
                setData();
                _this.drawer.onStart();
                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
            } else {

            }
        };

        function createCategoryList (searchField) {
            var categoryList = [
                new Category({'categoryName': 'VOD 명 검색', 'leaf': true, 'viewerType': ViewerType.CONTENTGROUP_LIST, 'searchField': 'title'}),
                new Category({'categoryName': '감독 명 검색', 'leaf': true, 'viewerType': ViewerType.CONTENTGROUP_LIST, 'searchField': 'director'}),
                new Category({'categoryName': '배우 검색', 'leaf': true, 'viewerType': ViewerType.CONTENTGROUP_LIST, 'searchField': 'actor'}),
                new Category({'categoryName': '방송프로그램 검색', 'leaf': true, 'viewerType': ViewerType.PROGRAM_LIST})
            ];

            return categoryList.filter(function(category) {
                return searchField.indexOf(category.jsonObject.searchField) > -1 || category.getViewerType() == ViewerType.PROGRAM_LIST;
            });

            // return categoryList;
        };

        function setData(param) {
            var categoryList = createCategoryList(param.searchField);
            var model = _this.model;

            var index = param['vIndex']
            var startIndex = param['startIndex']
            var vMax = categoryList.length;

            model.setKeyword(param.keyword);
            model.setExpandSearch(param.isExpandSearch);
            model.setVIndex(index| 0);
            model.setVStartIndex(startIndex | 0);
            model.setSize(VERTICAL_VISIBLE_LIST_COUNT, 1, vMax, 1);
            model.setRotate(true, false);
            model.setData(categoryList);
            model.setRootCategoryName("통합검색");
            model.setCurrentCategory(new Category({'categoryName':"검색"}));
            // model.setFixedFocus(1, 1);
        };

        function cancelToLastChangeFocusEvent() {
            if(isBlockTime()) {
                clearTimeout(changeFocusEventTimer);
                changeFocusEventTimer = null;
            }
        }

        function isBlockTime() {
            return changeFocusEventTimer != null;
        }

        ResultCategoryListView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            switch (keyCode) {
                case tvKey.KEY_UP:
                    _this.keyNavigator.keyUp();
                    _this.drawer.onUpdate();
                    cancelToLastChangeFocusEvent();
                    changeFocusEventTimer = setTimeout(function() {
                        _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
                        changeFocusEventTimer = null;
                    }, BLOCK_TIME_FOR_CHANGE_FOCUS);
                    break;
                case tvKey.KEY_DOWN:
                    _this.keyNavigator.keyDown();
                    _this.drawer.onUpdate();
                    cancelToLastChangeFocusEvent();
                    changeFocusEventTimer = setTimeout(function() {
                        _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
                        changeFocusEventTimer = null;
                    }, BLOCK_TIME_FOR_CHANGE_FOCUS);

                    break;
                case tvKey.KEY_LEFT:
                case tvKey.KEY_ESC:
                case tvKey.KEY_BACK:
                case tvKey.KEY_EXIT:
                    cancelToLastChangeFocusEvent();
                    _this.sendEvent(CCAEvent.FINISH_VIEW);
                    break;
                case tvKey.KEY_RIGHT:
                case tvKey.KEY_ENTER:
                    if(!isBlockTime()) {
                        _this.sendEvent(CCAEvent.CHANGE_VIEW, getEventParamObject());
                    }
                    break;
                default:
                    break;
            }
        };

        function getEventParamObject() {
            var model = _this.model;
            var param = {};
            // param.index = model.getVIndex();
            // param.startIndex = model.getVStartIndex();
            param.resultCategory = model.getData()[model.getVFocusIndex()];
            param.keyword = model.getKeyword();
            param.searchField = param.resultCategory.jsonObject.searchField;
            param.isExpandSearch = model.getExpandSearch();
            return param;
        }

        this.onInit();
	};
	ResultCategoryListView.prototype = Object.create(View.prototype);

	return ResultCategoryListView;
});
