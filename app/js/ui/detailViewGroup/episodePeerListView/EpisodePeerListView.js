define(["framework/View", "framework/event/CCAEvent",
        "ui/detailViewGroup/episodePeerListView/EpisodePeerListDrawer", "ui/detailViewGroup/episodePeerListView/EpisodePeerListModel",
        "service/Communicator", 'cca/DefineView', 'cca/type/SortType', 'cca/type/VisibleTimeType', "service/CCAInfoManager"],
    function (View, CCAEvent, EpisodePeerListDrawer, EpisodePeerListModel, Communicator, DefineView, SortType, VisibleTimeType, CCAInfoManager) {

        var EpisodePeerListView = function () {

            var VERTICAL_VISIBLE_LIST_COUNT = 7;

            View.call(this, "EpisodePeerListView");
            this.model = new EpisodePeerListModel();
            this.drawer = new EpisodePeerListDrawer(this.getID(), this.model);
            var _this = this;
            var isFirstTimeDraw = false;
            var changeFocusEventTimer = null;
            var BLOCK_TIME_FOR_CHANGE_FOCUS = CCAInfoManager.getEpisodeListKeyBlockTime();
            var isRequest = false;

            EpisodePeerListView.prototype.onInit = function() {

            };
            EpisodePeerListView.prototype.onAfterStart = function() {
                _this.hideTimerContainer();
            }

            EpisodePeerListView.prototype.onGetData = function (param) {
                var contentGroup = param['contentGroup'];
                this.model.setContentGroup(contentGroup);
                //@Comment 리스트를 8개 그려놓기 위한 꼼수
                this.model.setSize(VERTICAL_VISIBLE_LIST_COUNT, 1, 0, 1);
                //@Comment 최초 스타트아이템 인덱스는 0
                var startItemIndex = param.startItemIndex ? param.startItemIndex : 0;
                var vIndex = param.vIndex ? param.vIndex : 0;
                this.model.setVIndex(vIndex);
                requestEpisodePeerList(startItemIndex);
                isFirstTimeDraw = true;
            };


            function requestEpisodePeerList(startItemIndex) {
                var episodePeerProfile = 1;
                var sortType = SortType.NOTSET;
                var pageSize = VERTICAL_VISIBLE_LIST_COUNT;
                var indexRotation = "1";
                var contentGroupID = _this.model.getContentGroup().getContentGroupID();

                //Communicator.requestEpisodePeerListByContentGroupId(callBackForRequestEpisodePeerListByContentGroupId, contentGroupID, episodePeerProfile, sortType, pageSize, pageIndex, indexRotation);

                _this.model.setStartItemIndex(startItemIndex);
                isRequest = true;
                Communicator.requestEpisodePeerListByContentGroupIdUseStartItemIndex(callBackForRequestEpisodePeerListByContentGroupId, contentGroupID, episodePeerProfile, sortType, pageSize, startItemIndex, indexRotation);
            }

            function callBackForRequestEpisodePeerListByContentGroupId(response) {
                isRequest = false;
                if(Communicator.isSuccessResponseFromHAS(response)) {
                    //@Comment
                    setData(response.episodePeerList);
                    _this.model.setTotalCount(response.totalCount);
                    if(hasCountOfNextWatch()) {
                        setIndexByCountOfNextWatch();
                    } else {
                        sendChangeFocusEvent(isFirstTimeDraw);
                        _this.drawer.onUpdate();
                        isFirstTimeDraw = false;
                    }
                } else {
                    CCAInfoManager.initializeCountOfNextWatch();

                }
            }

            function hasCountOfNextWatch() {
                return CCAInfoManager.getCountOfNextWatch() > 0;
            }

            function setIndexByCountOfNextWatch() {
                var beforeStartItemIndex = _this.model.getStartItemIndex();
                var afterStartItemIndex = getAfterStartItemIndex(beforeStartItemIndex);

                CCAInfoManager.initializeCountOfNextWatch();
                if(beforeStartItemIndex != afterStartItemIndex) {
                    requestEpisodePeerList(afterStartItemIndex);
                } else {
                    sendChangeFocusEvent(isFirstTimeDraw);
                    _this.drawer.onUpdate();
                    isFirstTimeDraw = false;
                }
            }

            function getAfterStartItemIndex(beforeStartItemIndex) {
                var afterStartItemIndex = beforeStartItemIndex;
                var countOfNextWatch = CCAInfoManager.getCountOfNextWatch();

                if(isDownToNextAssetDiretion()) {
                    for(var i = 0; i < countOfNextWatch; i ++) {
                        if(needNextRequest()) {
                            afterStartItemIndex = (_this.model.getStartItemIndex() + VERTICAL_VISIBLE_LIST_COUNT) % _this.model.getTotalCount();
                        }
                        _this.keyNavigator.keyDown();
                    }
                } else {
                    for(var i = 0; i < countOfNextWatch; i ++) {
                        if(needPreviousRequest()) {
                            var afterStartItemIndex = _this.model.getStartItemIndex() - VERTICAL_VISIBLE_LIST_COUNT;
                            if(afterStartItemIndex < 0) {
                                afterStartItemIndex = afterStartItemIndex + _this.model.getTotalCount();
                            }
                        }
                        _this.keyNavigator.keyUp();
                    }
                }
                return afterStartItemIndex;
            }

            function isDownToNextAssetDiretion() {
                var episodePeerList = _this.model.getData();
                var firstItem = episodePeerList[0];
                var secondItem = episodePeerList[1];

                return parseInt(firstItem.getSeriesIndex()) < parseInt(secondItem.getSeriesIndex());
            }


            function setData(episodePeerList) {
                var model = _this.model;

                var verticalVisibleSize = VERTICAL_VISIBLE_LIST_COUNT;
                var horizonVisibleSize = 1;
                var verticalMaximumSize = episodePeerList ? episodePeerList.length : 0;
                var horizonMaximumSize = horizonVisibleSize;

                model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                model.setRotate(true, false);
                model.setData(episodePeerList);
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


            EpisodePeerListView.prototype.onKeyDown = function(event, param) {
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        actionByUpKey();
                        if(!isRequesting()) {
                            _this.drawer.onUpdate();
                        }
                        break;
                    case tvKey.KEY_DOWN:
                        actionByDownKey();
                        if(!isRequesting()) {
                            _this.drawer.onUpdate();
                        }
                        break;
                    case tvKey.KEY_DOUBLE_RIGHT:
                        repeatAction(actionByDownKey);
                        break;
                    case tvKey.KEY_DOUBLE_LEFT:
                        repeatAction(actionByUpKey);
                        break;
                    case tvKey.KEY_LEFT:
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_EXIT:
                        cancelToLastChangeFocusEvent();
                        sendFinishViewEvent();
                        break;
                    case tvKey.KEY_RIGHT:
                    case tvKey.KEY_ENTER:
                        if(!isBlockTime()) {
                            sendChangeViewEvent();
                        }
                        break;
                    case tvKey.KEY_YELLOW:
                    case tvKey.KEY_Y:
                        if(!isBlockTime()) {
                            sendChangeEventToSearchViewGroup();
                        }
                        break;
                    default:
                        break;
                }
            };


            function isRequesting() {
                return isRequest;
            }

            function hasOntherPage() {
                return VERTICAL_VISIBLE_LIST_COUNT < _this.model.getTotalCount();
            }

            function repeatAction(action) {
                if(hasOntherPage()) {
                    for(var i = 0; i < VERTICAL_VISIBLE_LIST_COUNT; i++) {
                        action();
                    }
                }
            }

            function actionByDownKey() {
                if(needNextRequest()) {
                    _this.keyNavigator.keyDown();
                    requestNextPageItemList();
                } else {
                    _this.keyNavigator.keyDown();
                    if(!isUnchangedIndex()) {
                        cancelToLastChangeFocusEvent();
                        changeFocusEventTimer = setTimeout(function() {
                            sendChangeFocusEvent(false);
                            changeFocusEventTimer = null;
                        }, BLOCK_TIME_FOR_CHANGE_FOCUS);
                    }
                }
            }

            function actionByUpKey() {
                if(needPreviousRequest()) {
                    _this.keyNavigator.keyUp();
                    requestPreviousPageItemList();
                } else {
                    _this.keyNavigator.keyUp();
                    if(!isUnchangedIndex()) {
                        cancelToLastChangeFocusEvent();
                        changeFocusEventTimer = setTimeout(function() {
                            sendChangeFocusEvent(false);
                            changeFocusEventTimer = null;
                        }, BLOCK_TIME_FOR_CHANGE_FOCUS);
                    }
                }
            }

            function needPreviousRequest() {
                return (_this.model.getVIndex() == 0) && (_this.model.getTotalCount() > VERTICAL_VISIBLE_LIST_COUNT);
            }

            function isUnchangedIndex() {
                return _this.model.getVIndex() == _this.model.getPreviousVIndex();

            }

            function needNextRequest() {
                return (_this.model.getVIndex() == VERTICAL_VISIBLE_LIST_COUNT - 1) &&  (_this.model.getTotalCount() > VERTICAL_VISIBLE_LIST_COUNT);
            }

            function requestPreviousPageItemList() {
                var startItemIndex = _this.model.getStartItemIndex() - VERTICAL_VISIBLE_LIST_COUNT;
                if(startItemIndex >= 0) {
                    requestEpisodePeerList(startItemIndex)
                } else {
                    startItemIndex = startItemIndex + _this.model.getTotalCount();
                    requestEpisodePeerList(startItemIndex)
                }
            }

            function requestNextPageItemList() {
                var startItemIndex = (_this.model.getStartItemIndex() + VERTICAL_VISIBLE_LIST_COUNT) % _this.model.getTotalCount();
                requestEpisodePeerList(startItemIndex)
            }

            function sendChangeViewEvent() {
                _this.sendEvent(CCAEvent.CHANGE_VIEW);
            }

            function sendChangeFocusEvent(isFirstTime) {
                var param = {'contentGroup' : _this.model.getContentGroup(), 'episodePeer' : _this.model.getVFocusedItem()};
                param.vIndex = _this.model.getVIndex();
                param.startItemIndex = _this.model.getStartItemIndex();
                param.isFirstTime = isFirstTime;

                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
            }

            function sendChangeEventToSearchViewGroup() {
                var param = {};
                param.targetView = DefineView.SEARCH_VIEW

                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            }


            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            }

            this.onInit();
        };

        EpisodePeerListView.prototype = Object.create(View.prototype);

        return EpisodePeerListView;
    });