define(["framework/View", "framework/event/CCAEvent", "service/Communicator", "cca/DefineView", "cca/PopupValues",
        "ui/menuViewGroup/categoryListView/CategoryListDrawer","ui/menuViewGroup/categoryListView/CategoryListModel",
        "service/CategoryManager", "helper/CategoryHelper", "helper/NavigationHelper", "cca/type/JumpType", 'helper/DrawerHelper', 'cca/type/VisibleTimeType',
        'service/CCAInfoManager', 'main/CSSHandler'
    ],
		function(View, CCAEvent, Communicator, DefineView, PopupValues, CategoryListDrawer, CategoryListModel, CategoryManager, CategoryHelper, NavigationHelper, JumpType, DrawerHelper, VisibleTimeType, CCAInfoManager, CSSHandler) {

	var CategoryListView = function() {
        View.call(this, DefineView.CATEGORY_LIST_VIEW);
		this.model = new CategoryListModel();
		this.drawer = new CategoryListDrawer(this.getID(), this.model);
        var VERTICAL_VISIBLE_LIST_COUNT = 8;
        var BLOCK_TIME_FOR_CHANGE_FOCUS = CCAInfoManager.getCategoryKeyBlockTime();

        var _this = this;
        var viewerTypeForJump = null;
        var changeFocusEventTimer = null;

        CategoryListView.prototype.onInit = function() {

        };

		CategoryListView.prototype.onBeforeStart = function(param) {
            _this = this;

            if(param.isFirstDepth) {
                this.drawer.setFirstDepth(true);
            } else {
                this.drawer.setFirstDepth(false);
            }

		};
        CategoryListView.prototype.onAfterStart = function() {
            _this.hideTimerContainer();
        };

        CategoryListView.prototype.onBeforeActive = function() {
            _this = this;
        }

		CategoryListView.prototype.onGetData = function(param) {
			var categoryType = param['categoryType'];
            var currentCategoryID = param['currentCategoryID']
            var rootCategoryName = param['rootCategoryName'];
			var index = param['vIndex']
            var startIndex = param['vStartIndex']
            var jumpType = param['jumpType'];
            var detailIconType = param['detailIconType'];
            viewerTypeForJump = param['viewerTypeForJump'];

            this.model.setVIndex(index | 0);
            this.model.setVStartIndex(startIndex | 0);
            this.model.setRootCategoryName(rootCategoryName);
            this.model.setJumpCategoryID(currentCategoryID);
            //@Comment 리스트를 8개 그려놓기 위한 꼼수
            this.model.setSize(VERTICAL_VISIBLE_LIST_COUNT, 1, 0, 1);
            this.model.setDetailIconType(detailIconType);

            if(jumpType == JumpType.ONTHE_CATEGORY) {
                jumpToCategory(currentCategoryID);
            } else {
                getCurrentCategory(currentCategoryID);
            }
        };

        function setCurrentCategory(currentCategory) {
            //@Todo 링크카테고리의 카테고리들은 parent가 0 임으로 별도 처리 필요
            if(needRootCategoryName(currentCategory)) {
                currentCategory.setCategoryName(_this.model.getRootCategoryName());
            } else {
                //_this.model.setRootCategoryName(currentCategory.getCategoryName());
            }

            _this.model.setCurrentCategory(currentCategory);
        }

        function needRootCategoryName(currentCategory) {
            if(isMyTVMenu(currentCategory)) {
                return true;
            } else if(currentCategory != null && (currentCategory.getParentCategoryID() == '-1') && _this.model.getRootCategoryName().length > 0) {
                return true;
            } else {
                return false;
            }
        }

        function isLinkCategory(category) {
            return category.getLinkInterfaceId().length > 0;
        }


        function isMyTVMenu(currentCategory) {
            return currentCategory.getDescription() == "MyTV";
        }

        function getParentCategory() {
            var parentCategoryID = _this.model.getCurrentCategory().getParentCategoryID();
            CategoryManager.getCategory(parentCategoryID, callBackForRequestParentCategory);
        }

        function callBackForRequestParentCategory(parentCategory) {
            _this.model.setParentCategory(parentCategory);
            jumpByViewType();
            _this.drawer.onUpdate();
            _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
            _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
        }

        function getCurrentCategory(currentCategoryID) {
            CategoryManager.getCategory(currentCategoryID, callBackForRequestCategory);
        }

        function jumpToCategory(currentCategoryID) {
            CategoryManager.getCategoryForJump(currentCategoryID, callBackForJumpToCategory);
        }

        function callBackForRequestCategory(currentCategory) {
            if(currentCategory != null) {
                setCurrentCategory(currentCategory);
                setData(currentCategory.getSubCategoryList());

                var parentCategoryID = currentCategory.getParentCategoryID();
                //@Comment Parent카테고리가 존재하면 parent를 획득한뒤 rendering. 그렇지 않으면 바로 rendering
                if(parentCategoryID != '0' && parentCategoryID != '-1') {
                    getParentCategory();
                } else {
                    jumpByViewType();
                    _this.drawer.onUpdate();
                    _this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);

                    _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
                }
            } else {

            }
        }

        function jumpByViewType() {
            var categoryList = _this.model.getData();
            for(var i = 0; i < categoryList.length; i++) {
                var viewerType = categoryList[i].getViewerType();
                if(viewerType == viewerTypeForJump) {
                    break;
                } else {
                    _this.keyNavigator.keyDown();
                }
            }
            viewerTypeForJump = null;
        }

        function callBackForJumpToCategory(currentCategory) {
            if(currentCategory != null) {
                setCurrentCategory(currentCategory);
                setData(currentCategory.getSubCategoryList());
                setIndexForJump();
                var parentCategoryID = currentCategory.getParentCategoryID();
                //@Comment Parent카테고리가 존재하면 parent를 획득한뒤 rendering. 그렇지 않으면 바로 rendering
                if(parentCategoryID != '0' && parentCategoryID != '-1') {
                    getParentCategory();
                } else {
                    _this.drawer.onStart();
                    _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, getEventParamObject());
                }
            } else {

            }
        }

        function setIndexForJump() {
            var categoryList = _this.model.getData();
            var targetCategoryID = _this.model.getJumpCategoryID();
            for(var i = 0; i < categoryList.length; i++) {
                if(categoryList[i].getCategoryID() == targetCategoryID) {
                    break;
                } else {
                    _this.keyNavigator.keyDown();
                }
            }
        }

        function setData(categoryList) {
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
        _this.yellowKeyCount = 0;
        CategoryListView.prototype.onKeyDown = function(event, param) {
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
                        // if(_this.model.getVFocusedItem().getPresentationType() == "MODPage") { // 몽키3뮤직
                        //     runMonkey3();
                        // } else {
                        //     _this.sendEvent(CCAEvent.CHANGE_VIEW, getEventParamObject());    
                        // }
                        _this.sendEvent(CCAEvent.CHANGE_VIEW, getEventParamObject());
                    }
                    break;
                case tvKey.KEY_0:
                case tvKey.KEY_1:
                case tvKey.KEY_2:
                case tvKey.KEY_3:
                case tvKey.KEY_4:
                case tvKey.KEY_5:
                case tvKey.KEY_6:
                case tvKey.KEY_7:
                case tvKey.KEY_8:
                case tvKey.KEY_9:
                    // 숫자키 처리를 위해 key event를 view group으로 send.
                    if(!isBlockTime()) {
                        _this.sendEvent(CCAEvent.SEND_KEYEVENT, param);
                    }
                    break;
                default:
                    break;
            }
            // hidden menu 진입 체크
            if(keyCode == tvKey.KEY_YELLOW || keyCode == tvKey.KEY_Y)	{
            	_this.yellowKeyCount ++;
            	if(_this.yellowKeyCount >= 3){
            		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            		_this.yellowKeyCount = 0;
            	}
            	
            }
            else	{
            	_this.yellowKeyCount = 0;
            }
        };

        function runMonkey3() {
            Communicator.requestSetExtSvcSource(function(result){
                if(Communicator.isSuccessResponseFromHAS(result) == true) {
                    CSSHandler.runThirdApp(CSSHandler.APP_ID_MONKEY3);
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                }
            }, 'MK3', 0, 0, 'content');
        }

        function getEventParamObject() {
            var model = _this.model;
            var param = {};
            param.index = model.getVIndex();
            param.startIndex = model.getVStartIndex();
            param.focusedCategory = model.getVFocusedItem();
            param.currentCategoryID = model.getCurrentCategory().getCategoryID();
            param.rootCategoryName = model.getRootCategoryName();
            param.detailIconType = model.getDetailIconType();

            return param;
        }

        this.onInit();
	};
    CategoryListView.prototype = Object.create(View.prototype);

	return CategoryListView;
});
