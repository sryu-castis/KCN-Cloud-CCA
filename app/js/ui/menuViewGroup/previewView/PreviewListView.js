define(["framework/View", "framework/event/CCAEvent",
        "ui/menuViewGroup/previewView/PreviewListDrawer", "ui/menuViewGroup/previewView/PreviewListModel",
        "service/CategoryManager", "service/Communicator", "cca/type/SortType", "cca/type/ViewerType", 'cca/type/VisibleTimeType', 'service/CCAInfoManager', 'cca/DefineView'],
    function (View, CCAEvent, PreviewListDrawer, CategoryListModel, CategoryManager, Communicator, SortType, ViewerType, VisibleTimeType, CCAInfoManager, DefineView) {

        var PreviewCategoryListView = function () {
            View.call(this, DefineView.PREVIEW_LIST_VIEW);
            this.model = new CategoryListModel();
            this.drawer = new PreviewListDrawer(this.getID(), this.model);

            var VERTICAL_VISIBLE_LIST_COUNT = 8;
            var _this = this;
            var requestID = null;

            PreviewCategoryListView.prototype.onInit = function() {

            };

            PreviewCategoryListView.prototype.onBeforeStart = function() {
                _this = this;
            };
            PreviewCategoryListView.prototype.onAfterStart = function() {
                this.hideTimerContainer();
            };

            PreviewCategoryListView.prototype.onGetData = function (param) {
                this.model.setCurrentCategory(param.focusedCategory);
                //@Comment 리스트를 8개 그려놓기 위한 꼼수
                this.model.setSize(VERTICAL_VISIBLE_LIST_COUNT, 1, 0, 1);
                getCategoryList();
            };

            PreviewCategoryListView.prototype.onStop = function () {
                View.prototype.onStop.apply(this);
                requestID = 0;
            };

            function getCategoryList() {
                var categoryID = _this.model.getCurrentCategory().getCategoryID();
                CategoryManager.getCategory(categoryID, callBackForGetCategoryList);
            }

            function callBackForGetCategoryList(category) {
                setData(category);
                if(needRequestContentGroup()) {
                    requestContentGroupList();
                } else {
                    _this.drawer.onUpdate();
                    _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);

                }
            }

            function requestContentGroupList() {
                var categoryId = _this.model.getVFocusedItem().getCategoryID();
                var sortType = SortType.NOTSET;
                var pageSize = 6;
                var pageIndex = 0;
                Communicator.requestContentGroupList(callbackForRequestContentGroup, categoryId, sortType, pageSize, pageIndex)
            }

            function needRequestContentGroup() {
                var category = _this.model.getVFocusedItem();
                return needShowContentGroup(category);
            }

            function needShowContentGroup(category) {
                if (category) {
                    if(category.isAdultCategory()) {
                        return CCAInfoManager.isAdultConfirm();
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }

            }

            function isContentViewType(category) {
                return (category.getViewerType() == ViewerType.CONTENTGROUP_LIST || category.getViewerType() == ViewerType.DEFAULT || category.getViewerType() == ViewerType.ASSET);
            }

            function callbackForRequestContentGroup (response) {
                if(Communicator.isSuccessResponseFromHAS(response)) {
                    _this.model.setContentGroupList(response.contentGroupList);
                }
                _this.drawer.onUpdate();
                _this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
            }

            function setData(category) {
                if(category && category.getSubCategoryList()) {
                    var model = _this.model;

                    var verticalVisibleSize = VERTICAL_VISIBLE_LIST_COUNT;
                    var horizonVisibleSize = 1;
                    var verticalMaximumSize = category.getSubCategoryList() ? category.getSubCategoryList().length : 0;
                    var horizonMaximumSize = horizonVisibleSize;

                    model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                    model.setRotate(false, false);
                    model.setData(category.getSubCategoryList());
                }
            }

            this.onInit();
        };

        PreviewCategoryListView.prototype = Object.create(View.prototype);

        return PreviewCategoryListView;
    });