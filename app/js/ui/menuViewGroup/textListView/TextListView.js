define(["framework/View", "framework/event/CCAEvent",
        "ui/menuViewGroup/textListView/TextListDrawer", "ui/menuViewGroup/textListView/TextListModel",
        "service/Communicator", "cca/type/SortType", "cca/DefineView",  'cca/type/VisibleTimeType'],
    function (View, CCAEvent, TextListDrawer, TextListModel, Communicator, SortType, DefineView, VisibleTimeType) {

        var TextListView = function (type) {
            View.call(this, DefineView.TEXT_LIST_VIEW);
            this.model = new TextListModel();
            this.drawer = new TextListDrawer(this.getID(), this.model, type);
            this.isRequesting = false;
            var _this = this;

            TextListView.prototype.onInit = function() {
            };
            TextListView.prototype.onBeforeStart = function() {
                _this = this;
            };
            TextListView.prototype.onAfterStart = function() {
                // _this.onHide();
                _this.hideTimerContainer();
            };
            TextListView.prototype.onBeforeActive = function() {
                _this = this;
            };
            TextListView.prototype.onAfterActive = function() {
                sendChangeFocus();
            }
            TextListView.prototype.onKeyDown = function(event, param) {
                var model = _this.model;
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
//                console.log('TextListView, onKeyDown[keyCode: ' + keyCode + ']');

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        if(model.getVIndex() == 0) {
//                            console.log('go to prev page');
                            goToPrevPage();
                        } else {
                            _this.keyNavigator.keyUp();   
                            _this.drawer.onUpdate();
                            sendChangeFocus();                                               
                        };

                        return true;
                    case tvKey.KEY_DOWN:
                        if(isLastRow() == true) {
//                            console.log('go to next page');
                            goToNextPage();
                        } else {
                            _this.keyNavigator.keyDown();
                            _this.drawer.onUpdate();
                            sendChangeFocus();
                        };

                        return true;
                    case tvKey.KEY_LEFT:
                        if(model.getHIndex() == 0) {
                            sendFinishViewEvent();
                        } else {
                            _this.keyNavigator.keyLeft();
                            _this.drawer.onUpdate();
                            sendChangeFocus();
                        };

                        return true;
                    case tvKey.KEY_RIGHT:
                        if(model.getData().length - 1 == model.getVIndex() * model.getHVisibleSize() + model.getHIndex()) {
                            model.setHIndex(0);
                            goToNextPage();
                        } else {
                            _this.keyNavigator.keyRight();    
                            _this.drawer.onUpdate();
                            sendChangeFocus();
                        };

                        return true;
                    case tvKey.KEY_YELLOW:
                    case tvKey.KEY_Y:
                        sendChangeToPosterViewEvent();
                        break;
                    case tvKey.KEY_EXIT:
                    case tvKey.KEY_BACK:
                        sendFinishViewEvent();
                        return true;
                    case tvKey.KEY_ENTER:
                        sendChangeViewGroupEvent();
                        return true;
                    default:
                        return false;
                }
            };
            TextListView.prototype.onGetData = function (param) {
                this.model.focusedCategory = param.focusedCategory;
                var vIndex = param.vIndex;
                var hIndex = param.hIndex;
                var vStartIndex = param.vStartIndex;
                var pageIndex = 0;
                //var selectedItemIndex = param.selectedItemIndex;
                //if( selectedItemIndex != undefined ) {
                //    vStartIndex = Math.floor(selectedItemIndex / (TextListView.HORIZONTAL_VISIBLE_SIZE*TextListView.VERTICAL_VISIBLE_SIZE));
                //    var delta = selectedItemIndex - vStartIndex * (TextListView.HORIZONTAL_VISIBLE_SIZE*TextListView.VERTICAL_VISIBLE_SIZE);
                //    vIndex = Math.floor(delta / TextListView.HORIZONTAL_VISIBLE_SIZE);
                //    hIndex = delta % TextListView.HORIZONTAL_VISIBLE_SIZE;
                //    pageIndex = Math.floor(selectedItemIndex / TextListView.PAGE_SIZE);
                //}
                this.model.setVIndex(vIndex | 0);
                this.model.setHIndex(hIndex | 0);
                this.model.setVStartIndex(vStartIndex | 0);
                var resultCategory = param.resultCategory;
                var keyword = param.keyword;
                if(keyword.length > 0) {
                    this.model.setKeyword(keyword);
                    this.model.setSearchField(param.searchField);
                    this.model.setIsExpandSearch(param.expandSearch);
                    requestSearchContentGroup(callBackForRequestContentGroupList, pageIndex);
                } else if(resultCategory != null) {
                    this.model.setAssetID(param.assetID);
                    this.model.setResultCategory(param.resultCategory);
                    requestRecommendContentGroupByAssetId(callBackForRequestRecommendContentGroupByAssetId, pageIndex);
                } else {
                    var currentCategoryID = param.focusedCategory.getCategoryID();
                    requestContentList(callBackForRequestContentGroupList, currentCategoryID, TextListView.PAGE_SIZE, pageIndex);
                }
            };

            function requestSearchContentGroup(callBackFunc, pageIndex) {
                if(_this.isRequesting == true) {
                    return;
                };
                _this.isRequesting = true;
                var transactionId = 0;
                var contentGroupProfile = 2; 
                var searchField = _this.model.getSearchField();
                var includeAdultCategory = (_this.model.getIsExpandSearch() == true) ? 1 : 0;
                var searchKeyword = _this.model.getKeyword();
                // var searchField = _this.searchField;
                // var includeAdultCategory = (_this.isExpandSearch == true) ? 1 : 0;
                // var searchKeyword = _this.keyword;
                var sortType = SortType.NAME_ASC;
                var startItemIndex = pageIndex * TextListView.PAGE_SIZE;
                Communicator.requestSearchContentGroup(callBackFunc, transactionId, contentGroupProfile,
                    searchField, includeAdultCategory, searchKeyword, sortType, startItemIndex, TextListView.PAGE_SIZE);
            };

            function requestRecommendContentGroupByAssetId(callBackFunc, pageIndex) {
                var assetID = _this.model.getAssetID();
                var resultCategory = _this.model.getResultCategory();
                var contentGroupProfile = "2";
                var recommendField = resultCategory.getRecommendField();
                var recommendFieldValue = resultCategory.getName();

                Communicator.requestRecommendContentGroupByAssetId(callBackFunc, assetID, contentGroupProfile, recommendField, recommendFieldValue, TextListView.PAGE_SIZE, pageIndex);
            }

            function callBackForRequestRecommendContentGroupByAssetId(response) {
                if(Communicator.isSuccessResponseFromHAS(response)) {
                    setData(response);
                    _this.drawer.onUpdate();
                    sendChangeFocus();
                    // _this.setVisibleTimer(30);
                    _this.setVisibleTimer(VisibleTimeType.TEXT_LIST);
                } else {
                    console.error("Failed to get datas from has.");
                    sendChangeViewToNoDataViewEvent(result.resultCode);
                };
            }



            function requestContentList(callback, categoryId, pageIndex, pageSize) {
                _this.isRequesting = true;
//                console.log('categoryId: ' + categoryId);
                Communicator.requestContentGroupList(callback, categoryId, SortType.NOTSET, pageIndex, pageSize);
            };
            function callBackForRequestContentGroupList(result) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {

                    setData(result);
                    _this.drawer.onUpdate();
                    // _this.setVisibleTimer(30);
                    _this.setVisibleTimer(VisibleTimeType.TEXT_LIST);
                } else {
                    console.error("Failed to get datas from has.");
                    sendChangeViewToNoDataViewEvent(result.resultCode);
                };
            };
            function setData(result) {
                result = result.searchResultList ? result.searchResultList[0] : result;

                if(result.contentGroupList.length == 0) {
                    sendChangeViewToNoDataViewEvent();
                } else {
                    var model = _this.model;
                    model.totalCount = result.totalCount;
                    model.totalPage = Math.ceil(model.totalCount / TextListView.PAGE_SIZE);

                    var verticalMaximumSize = Math.ceil(result.totalCount / TextListView.HORIZONTAL_VISIBLE_SIZE);
                    var horizontalMaximumSize = TextListView.HORIZONTAL_VISIBLE_SIZE;

                    model.setSize(TextListView.VERTICAL_VISIBLE_SIZE, TextListView.HORIZONTAL_VISIBLE_SIZE, verticalMaximumSize, horizontalMaximumSize);
                    model.setRotate(false, true);
                    model.setNextLineRotate(true);
                    _this.model.setData(result.contentGroupList);    
                }
            };

            function isLastRow() {
                var model = _this.model;
                return getVMaxForColumn(model.getHIndex())-1 == model.getVIndex();
            };
            function isLastPage() {
                return (getCurrentPageIndex()+1 < _this.model.totalPage) ? false : true;
            };
            function getVMaxForColumn(hIndex) {
                var model = _this.model;
                var contentGroupList = model.getData();
                var vMaxInCurrentPage = Math.ceil(contentGroupList.length / model.getHVisibleSize());
                var leafCount = contentGroupList.length % model.getHVisibleSize();
                return (leafCount == 0 || leafCount > hIndex) ? vMaxInCurrentPage : vMaxInCurrentPage - 1;
            };
            function getCurrentPageIndex() {
                return Math.ceil(_this.model.getVStartIndex() / _this.model.getVVisibleSize());
            };
            function goToPrevPage() {
                if(_this.isRequesting == true) {
                    return;
                }
                var model = _this.model;
                if(model.getVMax() > TextListView.VERTICAL_VISIBLE_SIZE) {
                    var lastPageIndex = model.totalPage - 1;
                    var currentPageIndex = getCurrentPageIndex();
                    var prevPageIndex = (currentPageIndex == 0) ? lastPageIndex : currentPageIndex - 1;

                    if(model.getKeyword().length > 0) {
                        requestSearchContentGroup(callbackForRequestPrevContentList, prevPageIndex);
                    } else if(model.getResultCategory() != null) {
                        requestRecommendContentGroupByAssetId(callbackForRequestPrevContentList, prevPageIndex);
                    } else {
                        var categoryId = model.focusedCategory.getCategoryID();
                        requestContentList(callbackForRequestPrevContentList, categoryId, TextListView.PAGE_SIZE, prevPageIndex);
                    }
                } else {
                    var vIndex = getVMaxForColumn(model.getHIndex()) - 1;
                    model.setVIndex(vIndex);

                    _this.drawer.onUpdate();
                    sendChangeFocus();
                }
            };
            function callbackForRequestPrevContentList(result) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    var model = _this.model;
                    setData(result);
                    var lastPageIndex = model.totalPage - 1;
                    var currentPageIndex = getCurrentPageIndex();
                    var prevPageIndex = (currentPageIndex == 0) ? lastPageIndex : currentPageIndex - 1;
                    var vStartIndex = prevPageIndex * model.getVVisibleSize();
                    var vIndex = getVMaxForColumn(model.getHIndex()) - 1;
                    if(vIndex < 0) {
                        vIndex = 0;
                        hIndex = 0;
                        model.setHIndex(hIndex);
                    }
                    model.setVStartIndex(vStartIndex);
                    model.setVIndex(vIndex);
                    _this.drawer.onUpdate();
                    sendChangeFocus();
//                    console.log('vStart: ' + model.getVStartIndex() + ', vIndex: ' + model.getVIndex());
                } else {
                    console.error("Failed to get datas from has.");
                    sendChangeViewToNoDataViewEvent(result.resultCode);
                };
            };
            function goToNextPage() {
                if(_this.isRequesting == true) {
                    return;
                }
                var model = _this.model;
                if(model.getVMax() > TextListView.VERTICAL_VISIBLE_SIZE) {
                    var nextPageIndex = (isLastPage() == true) ? 0 : getCurrentPageIndex() + 1;

                    if(model.getKeyword().length > 0) {
                        requestSearchContentGroup(callbackForReuestNextContentList, nextPageIndex);
                    } else if(model.getResultCategory() != null) {
                        requestRecommendContentGroupByAssetId(callbackForReuestNextContentList, nextPageIndex);
                    } else {
                        var categoryId = model.focusedCategory.getCategoryID();
                        requestContentList(callbackForReuestNextContentList, categoryId, TextListView.PAGE_SIZE, nextPageIndex);
                    }
                } else {
                    var vIndex = 0;
                    model.setVIndex(vIndex);

                    _this.drawer.onUpdate();
                    sendChangeFocus();
                }
            };
            function callbackForReuestNextContentList(result) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    var model = _this.model;
                    setData(result);
                    var nextPageIndex = (isLastPage() == true) ? 0 : getCurrentPageIndex() + 1;
                    var vStartIndex = nextPageIndex * model.getVVisibleSize();
                    model.setVStartIndex(vStartIndex);
                    model.setVIndex(0);
                    _this.drawer.onUpdate();
                    sendChangeFocus();
//                    console.log('vStart: ' + model.getVStartIndex() + ', vIndex: ' + model.getVIndex());
                } else {
                    console.error("Failed to get datas from has.");
                    sendChangeViewToNoDataViewEvent(result.resultCode);
                };
            };
            function sendChangeToPosterViewEvent() {
                //var selectedItemIndex = _this.model.getVStartIndex() * (TextListView.HORIZONTAL_VISIBLE_SIZE*TextListView.VERTICAL_VISIBLE_SIZE) + _this.model.getVIndex() * TextListView.HORIZONTAL_VISIBLE_SIZE + _this.model.getHIndex();
                var param = {focusedCategory: _this.model.focusedCategory, targetView: DefineView.POSTER_LIST_VIEW};
                param.resultCategory = _this.model.getResultCategory();
                param.assetID = _this.model.getAssetID();
                param.keyword = _this.model.getKeyword();
                param.searchField = _this.model.getSearchField();
                param.isExpandSearch = _this.model.getIsExpandSearch();
                //param.selectedItemIndex = selectedItemIndex;
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            };
            function sendChangeViewGroupEvent() {
                var model = _this.model;
                var selectedItemIndex = model.getVIndex() * model.getHVisibleSize() + model.getHIndex();
                var selectedItem = model.getData()[selectedItemIndex];
//                console.log('selected contentGroup: ' + selectedItem.getTitle());
                var param = {};
                param.focusedCategory = _this.model.focusedCategory;
                param.targetView = getTargetView(selectedItem);
                param.contentGroupID = selectedItem.getContentGroupID();
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            };

            function getTargetView(contentGroup) {
                if(contentGroup.isEpisodePeerContent()) {
                    return DefineView.EPISODE_PEER_LIST_VIEW;
                } else {
                    return DefineView.DETAIL_VIEW;
                }

            }

            function sendChangeViewToNoDataViewEvent(result) {
                var param = {};
                param.errorCode = resultCode;
                param.targetView = DefineView.NO_DATA_VIEW;
                param.messageType = ViewerType.TEXT_VIEW;
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            };
            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };
            function sendChangeFocus() {
                var model = _this.model;
                var param = {};
                param.vIndex = model.getVIndex();
                param.hIndex = model.getHIndex();
                param.vStartIndex = model.getVStartIndex();
                param.keyword = model.getKeyword();
                param.searchField = model.getSearchField();
                param.isExpandSearch = model.getIsExpandSearch();
                param.assetID = model.getAssetID();
                //param.focusedCategory = model.focusedCategory;
                param.resultCategory = model.getResultCategory();                
                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
            };

            this.onInit();
        };

        TextListView.prototype = Object.create(View.prototype);
        TextListView.TYPE_NORMAL_CATEGORY = TextListDrawer.TYPE_NORMAL_CATEGORY;
        TextListView.TYPE_RESULT_CATEGORY = TextListDrawer.TYPE_RESULT_CATEGORY;
        TextListView.TYPE_SEARCH_RESULT_CATEGORY = TextListDrawer.TYPE_SEARCH_RESULT_CATEGORY;

        TextListView.VERTICAL_VISIBLE_SIZE      = 7;
        TextListView.HORIZONTAL_VISIBLE_SIZE    = 2;
        TextListView.PAGE_SIZE                  = 14;

        return TextListView;
    });