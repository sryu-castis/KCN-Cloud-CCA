define(["framework/View", "framework/event/CCAEvent",
        "ui/menuViewGroup/categoryListView/CategoryListDrawer","ui/relativeViewGroup/resultCategoryListView/ResultCategoryListModel",
        "service/Communicator", 'cca/model/Category', 'cca/type/ViewerType', "cca/model/ResultCategory", "cca/type/VisibleTimeType", "service/CCAInfoManager"],
		function(View, CCAEvent, CategoryListDrawer, ResultCategoryListModel, Communicator, Category, ViewerType, ResultCategory, VisibleTimeType, CCAInfoManager) {

	var ResultCategoryListView = function() {
        View.call(this, "resultCategoryListView");
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

		ResultCategoryListView.prototype.onGetData = function(param) {
            var assetID = param['assetID'];
            var index = param['vIndex']
            var startIndex = param['vStartIndex']

            this.model.setVIndex(index | 0);
            this.model.setVStartIndex(startIndex | 0);
            //@Comment 리스트를 8개 그려놓기 위한 꼼수
            this.model.setSize(VERTICAL_VISIBLE_LIST_COUNT, 1, 0, 1);
            this.model.setAssetID(assetID);
            requestRecommendContentGroupByAssetId(assetID);
            requestAssetInfo(assetID);
        };

        function requestRecommendContentGroupByAssetId(assetID) {
            var contentGroupProfile = "0";
            var recommendField = "all";
            var recommendFieldValue = "";
            var includeResultCategoryList = '1';
            Communicator.requestRecommendContentGroupByAssetId(callBackForRequestRecommendContentGroupByAssetId, assetID, contentGroupProfile, recommendField, recommendFieldValue, 1, 0, includeResultCategoryList);
        }

        function callBackForRequestRecommendContentGroupByAssetId(response) {
            if(Communicator.isSuccessResponseFromHAS(response)) {
                _this.model.setResultCategoryList(addFakeResultCategory(response.resultCategoryList));
                setData();
                _this.drawer.onStart();
                _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
            } else {

            }
        }

        function requestAssetInfo(assetID) {
            var assetProfile = 1;
            Communicator.requestAssetInfo(callBackForRequestAssetInfo, assetID, assetProfile);
        }

        function  callBackForRequestAssetInfo(response) {
            if(Communicator.isSuccessResponseFromHAS(response)) {
                _this.model.setCurrentCategory(new Category({'categoryName':response.asset.getTitle()}));
                _this.model.setRootCategoryName("연관추천");
                _this.drawer.onUpdate();
            } else {

            }

        }

        function addFakeResultCategory(resultCategoryList) {
            var resultCategory = new ResultCategory({'recommendField':'contentsCF', 'name':''});
            resultCategoryList.unshift(resultCategory);
            return resultCategoryList;
        }

        function createCategoryList (resultCategoryList) {
            var categoryList = new Array(resultCategoryList.length);
            categoryList[0] = new Category({'categoryName': '연관 VOD', 'leaf': true, 'viewerType': ViewerType.CONTENTGROUP_LIST, 'categoryId':'contentsCF'});

            for(var i = 1; i < categoryList.length; i++) {
                var searchResultCategory = resultCategoryList[i];
                var categoryName = getCategoryNameHead(searchResultCategory.getRecommendField()) + " : " +  searchResultCategory.getName();
                categoryList[i] = new Category({'categoryName': categoryName, 'leaf': true, 'viewerType': ViewerType.CONTENTGROUP_LIST, 'categoryId':searchResultCategory.getRecommendField()});
            }

            return categoryList;
        }

        function getCategoryNameHead(recommendField) {
            switch (recommendField) {
                case 'title' :
                    return '제목';
                    break;
                case 'genre' :
                    return '장르';
                    break;
                case 'actor' :
                    return '배우';
                    break;
                case 'director' :
                    return '감독';
                    break;
            }

        }

        function setData() {
            var categoryList = createCategoryList(_this.model.getResultCategoryList());
            var model = _this.model;

            var verticalVisibleSize = VERTICAL_VISIBLE_LIST_COUNT;
            var horizonVisibleSize = 1;
            var verticalMaximumSize = categoryList ? categoryList.length : 0;
            var horizonMaximumSize = horizonVisibleSize;

            model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
            model.setRotate(true, false);
            model.setData(categoryList);
            model.setFixedFocus(1, 1);
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
            param.index = model.getVIndex();
            param.startIndex = model.getVStartIndex();
            param.resultCategory = model.getResultCategoryList()[model.getVFocusIndex()];
            param.focusedCategory = model.getVFocusedItem();
            param.assetID = model.getAssetID();

            return param;
        }

        this.onInit();
	};
	ResultCategoryListView.prototype = Object.create(View.prototype);

	return ResultCategoryListView;
});
