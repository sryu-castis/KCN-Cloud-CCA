define(["framework/View", "framework/event/CCAEvent",
        "ui/menuViewGroup/recommendContentGroupView/RecommendContentGroupDrawer", 
        "ui/menuViewGroup/recommendContentGroupView/RecommendContentGroupModel",
        "service/Communicator", 'cca/type/SortType', 'cca/type/ProductType', "cca/DefineView", 'cca/type/VisibleTimeType'],
    function (View, CCAEvent, RecommendContentGroupDrawer, RecommendContentGroupModel, Communicator, SortType, ProductType, DefineView, VisibleTimeType) {

        var RecommendContentGroupView = function () {
            View.call(this, DefineView.RECOMMEND_CONTENT_GROUP_VIEW);
            this.model = new RecommendContentGroupModel();
            this.drawer = new RecommendContentGroupDrawer(this.getID(), this.model);
            this.isRequesting = false;
            var _this = this;

            RecommendContentGroupView.prototype.onInit = function() {

            };

            RecommendContentGroupView.prototype.onBeforeActive = function() {
                if(_this.model.getData().length == 0) {
                    changeToPurchaseBasedRecommendationView();
                };
            };

            RecommendContentGroupView.prototype.onAfterActive = function() {
                sendChangeFocus();
            };

            RecommendContentGroupView.prototype.onKeyDown = function(event, param) {
                var model = _this.model;
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
//                console.log('RecommendContentGroupView, onKeyDown[keyCode: ' + keyCode + ']');

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        _this.keyNavigator.keyUp();
                        adjustHIndex();   
                        _this.drawer.onUpdate(); 
                        sendChangeFocus();

                        break;
                    case tvKey.KEY_DOWN:
                        _this.keyNavigator.keyDown();
                        adjustHIndex();
                        _this.drawer.onUpdate();
                        sendChangeFocus();

                        break;
                    case tvKey.KEY_LEFT:
                        if(model.getHIndex() == 0) {
                            changeToPurchaseBasedRecommendationView();
                        } else {
                            _this.keyNavigator.keyLeft();
                            sendChangeFocus();
                        };
                        _this.drawer.onUpdate();

                        break;
                    case tvKey.KEY_RIGHT:
                        if(isLastItem() == true) {
                            _this.model.setVIndex(0);
                            _this.model.setHIndex(0);
                        } else {
                            _this.keyNavigator.keyRight();
                            sendChangeFocus();
                        };
                        _this.drawer.onUpdate();

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

            RecommendContentGroupView.prototype.onGetData = function (param) {
                var assetId = param.assetId;
                var purchasedTitle = param.purchasedTitle;
                this.model.setPurchasedTitle(purchasedTitle);

                requestPurchasedList(callBackForRequestContentGroupByAssetIdEx, assetId);
            };
            function requestPurchasedList(callback, assetId) {
                _this.isRequesting = true;
                // var sortType = SortType.NOTSET;
                // var pageSize = 6;
                // var pageIndex = 0;
                // var contentGroupProfile = 0;
                // var includeAdultCategory = 1;
                
                // console.log('assetId: ', assetId, ', categoryId: ', categoryId);
                // Communicator.requestContentGroupByAssetIdEx(callback, categoryId, assetId, sortType, 
                //     pageSize, pageIndex, contentGroupProfile, includeAdultCategory);
                var contentGroupProfile = 1; 
                var recommendField = 'contentsCF';
                Communicator.requestRecommendContentGroupByAssetId(callback, assetId, contentGroupProfile, recommendField);
            };
            function callBackForRequestContentGroupByAssetIdEx(result) {
                _this.isRequesting = false;
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    var model = _this.model;
                    var verticalVisibleSize = 2;
                    var horizontalVisibleSize = 3;
                    var verticalMaximumSize = Math.ceil(result.totalCount / horizontalVisibleSize);
                    var horizentalMaximumSize = horizontalVisibleSize;

                    model.totalCount = result.totalCount;
                    model.setSize(verticalVisibleSize, horizontalVisibleSize, verticalMaximumSize, horizentalMaximumSize);
                    model.setRotate(true, true);
                    model.setNextLineRotate(true);
                    setData(result.contentGroupList);
                    // setData([]);
                    _this.drawer.onUpdate();
                } else {
                    console.error("Failed to get datas from has.");
                    setData([]);
                    _this.drawer.onUpdate();
                };

                _this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
            };
            function setData(contentGroupList) {
                _this.model.setData(contentGroupList);
            };

            function adjustHIndex() {
                var model = _this.model;
                
                if(model.getVStartIndex() + model.getVIndex() + 1 > getVMaxForColumn(model.getHIndex())) {
//                    console.log('adjustHIndex');
                    model.setHIndex(getLeafCount()-1);
                };
            };

            function getVMaxForColumn(hIndex) {
                var model = _this.model;
                var leafCount = getLeafCount();
                return (leafCount == model.getHVisibleSize() || leafCount > hIndex) ? model.getVMax() : model.getVMax() - 1;
            };
            function getLeafCount() {
                var leafCount = _this.model.totalCount % _this.model.getHVisibleSize();
                return (leafCount == 0) ? _this.model.getHVisibleSize() : leafCount;
            };

            function getSelectedItem() {
                var model = _this.model;
                var selectedItemIndex = model.getVIndex() * model.getHVisibleSize() + model.getHIndex();
                var selectedItem = model.getData()[selectedItemIndex];
                return selectedItem;
            };

            function isLastItem () {
                var model = _this.model;
                var selectedItemIndex = model.getVIndex() * model.getHVisibleSize() + model.getHIndex();
                return (model.getData().length - 1 > selectedItemIndex) ? false : true;
            };

            function changeToPurchaseBasedRecommendationView() {
//                console.log('changeToPurchaseBasedRecommendationView');
                // weeklyPopularityChartView.onActive();
                // _this.onDeActive();
                var param = {};
                param.targetView = DefineView.PURCHASE_BASED_RECOMMENDATION_VIEW;
                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            };
            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };
            function sendChangeViewGroupEvent() {
                var param = {};
                param.targetView = DefineView.DETAIL_VIEW;
                param.contentGroupID = getSelectedItem().getContentGroupID();
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            };
            function sendChangeFocus() {
                var model = _this.model;
                var param = {};
                param.vIndex = model.getVIndex();
                param.hIndex = model.getHIndex();
                //_this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
            };
            this.onInit();
        };

        RecommendContentGroupView.prototype = Object.create(View.prototype);

        return RecommendContentGroupView;
    });