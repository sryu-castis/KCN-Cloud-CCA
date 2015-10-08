define(["framework/View", "framework/event/CCAEvent",
        "ui/detailViewGroup/relativeListView/RelativeListDrawer", "ui/detailViewGroup/relativeListView/RelativeListModel",
        "service/Communicator", 'cca/DefineView', 'cca/type/VisibleTimeType', "helper/UIComponentHelper"],
    function (View, CCAEvent, RelativeListDrawer, RelativeListModel, Communicator, DefineView, VisibleTimeType, UIComponentHelper) {

        var RelativeListView = function () {

            var HORISON_VISIBLE_LIST_COUNT = 6;

            View.call(this, "RelativeListView");
            this.model = new RelativeListModel();
            this.drawer = new RelativeListDrawer(this.getID(), this.model);
            var _this = this;

            RelativeListView.prototype.onInit = function() {

            };
            RelativeListView.prototype.onAfterStart = function() {
                _this.hideTimerContainer();
            }
            RelativeListView.prototype.onGetData = function (param) {
                var assetID = param['assetID'];

                _this.model.setAssetID(assetID);
                requestRelativeContentGroupList(assetID);
            };
            RelativeListView.prototype.onBeforeActive = function() {
                if(_this.model.isNullData()) {
                    sendChangeViewEvent();    
                }
            }

            function requestRelativeContentGroupList(assetID) {
                var contentGroupProfile = "2";
                var recommendField = "contentsCF";
                var recommendFieldValue = "";
                Communicator.requestRecommendContentGroupByAssetId(callBackForRequestContentGroupByAssetId, assetID, contentGroupProfile, recommendField, recommendFieldValue, HORISON_VISIBLE_LIST_COUNT, 0);
            }

            function callBackForRequestContentGroupByAssetId(response) {
                if(Communicator.isSuccessResponseFromHAS(response)) {
                    setData(response.contentGroupList);
                } else {
                    setData([]);
                }
                _this.drawer.onUpdate();
                _this.setVisibleTimer(VisibleTimeType.POSTER_LIST_TYPE);
            }


            function setData(contentGroupList) {
                var model = _this.model;

                var verticalVisibleSize = 1;
                var horizonVisibleSize = HORISON_VISIBLE_LIST_COUNT;
                var verticalMaximumSize = verticalVisibleSize;
                var horizonMaximumSize = contentGroupList ? contentGroupList.length + 1 : 1;

                model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                model.setRotate(false, true);
                model.setData(contentGroupList);
            };


            RelativeListView.prototype.onKeyDown = function(event, param) {
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        sendChangeViewEvent();
                        break;
                    case tvKey.KEY_DOWN:
                        break;
                    case tvKey.KEY_LEFT:
                        _this.keyNavigator.keyLeft();
                        _this.drawer.onUpdate();
                        break;
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_EXIT:
                        _this.sendEvent(CCAEvent.FINISH_VIEW);
                        break;
                    case tvKey.KEY_RIGHT:
                        _this.keyNavigator.keyRight();
                        _this.drawer.onUpdate();
                        break;
                    case tvKey.KEY_YELLOW:
                        sendChangeEventToSearchViewGroup();
                        break;
                    case tvKey.KEY_ENTER:
                        sendChangeViewGroupEvent();
                        break;
                    default:
                        break;
                }
            };

            function sendChangeViewEvent() {
                _this.sendEvent(CCAEvent.CHANGE_VIEW);
            }

            function sendChangeViewGroupEvent() {
                if(_this.model.getHFocusIndex() == _this.model.getHMax() - 1) {
                    var param = {'targetView': DefineView.RELATIVE_VIEW, 'assetID':_this.model.getAssetID()};
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
                } else {
                    var contentGroup = _this.model.getHFocusedItem();
                    var param = {'targetView': getTargetView(contentGroup), 'contentGroupID': contentGroup.getContentGroupID()
                        , 'uiDomainID':UIComponentHelper.UIDomainID.RECOMMEND, 'uiComponentID':UIComponentHelper.UIComponentID.RECOMMEND_ALL
                    };
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
                }
            }

            function sendChangeEventToSearchViewGroup() {
                var param = {};
                param.targetView = DefineView.SEARCH_VIEW

                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            };

            function getTargetView(contentGroup) {
                if(contentGroup.isEpisodePeerContent()) {
                    return DefineView.EPISODE_PEER_LIST_VIEW;
                } else {
                    return DefineView.DETAIL_VIEW;
                }

            }

            this.onInit();
        };

        RelativeListView.prototype = Object.create(View.prototype);

        return RelativeListView;
    });