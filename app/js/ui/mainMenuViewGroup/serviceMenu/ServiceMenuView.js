define(["framework/View", "framework/event/CCAEvent", "service/Communicator", "cca/DefineView",
        "ui/mainMenuViewGroup/serviceMenu/ServiceMenuDrawer","ui/mainMenuViewGroup/serviceMenu/ServiceMenuModel",
        'service/CCAInfoManager', 'main/CSSHandler', 'cca/type/FunctionMenuExternalSourceType'
    ],
		function(View, CCAEvent, Communicator, DefineView, ServiceMenuDrawer, ServiceMenuModel, CCAInfoManager, CSSHandler, FunctionMenuExternalSourceType) {

	var ServiceMenuView = function(id) {
        View.call(this, id);

		this.model = null;
		this.drawer = null;
        var _this = this;

        ServiceMenuView.prototype.onInitialize = function() {
            this.model = new ServiceMenuModel();
            this.drawer = new ServiceMenuDrawer(this.getID(), this.model);
        };

        ServiceMenuView.prototype.onBeforeStart = function(param) {
            initializeModel(param.getFunctionMenuList());
            setServiceMenuIndex(param);

            //_this.startDrawer();
        };

        ServiceMenuView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            switch (keyCode) {
                case tvKey.KEY_UP:
                    sendChangeViewEvent(DefineView.VOD_MENU_VIEW);
                    break;
                case tvKey.KEY_DOWN:
                    sendChangeViewEvent(DefineView.RECOMMEND_CONTENTS_VIEW);
                    break;
                case tvKey.KEY_RIGHT:
                    _this.keyNavigator.keyRight();
                    _this.drawer.onRepaint();
                    sendChangeFocus();
                    break;
                case tvKey.KEY_LEFT:
                    _this.keyNavigator.keyLeft();
                    _this.drawer.onRepaint();
                    sendChangeFocus();
                    break;
                case tvKey.KEY_BACK:
                case tvKey.KEY_ESC:
                case tvKey.KEY_EXIT:
                    sendFinishViewGroupEvent();
                    break;
                case tvKey.KEY_ENTER:
                case tvKey.KEY_OK:
                    selectService();
                    //sendChangeViewGroupEvent();
                    break;
                default:
                    break;
            }
        };

        function setServiceMenuIndex(param) {
            var appKey = param[CSSHandler.MAIN_MENU_APPTYPE];
            var menuKey = param[CSSHandler.MAIN_MENU_MENUTYPE];
            var serviceMenuIndex = param['serviceMenuIndex'];

            if(appKey) {
                var serviceMenuList = _this.model.getData();
                for(var i = 0; i < serviceMenuList.length; i++) {
                    if(isTargetServiceMenuByAppKey(appKey, serviceMenuList[i])) {
                        _this.model.setHIndex(i);
                        break;
                    }
                }
            } else if(menuKey) {
                var targetIndex = getTargetServiceIndexByMenuKey(menuKey);
                _this.model.setHIndex(targetIndex);
            } else if(serviceMenuIndex) {
                _this.model.setHIndex(serviceMenuIndex);
            } else {
                _this.model.setHIndex(0);
            }
        }

        function getTargetServiceIndexByMenuKey(menuKey) {
            try {
                var targetExternalSourceType = getExternalSourTypeByMenuKey(menuKey);
                var serviceMenuList = _this.model.getData();
                for(var i = 0; i < serviceMenuList.length; i++) {
                    var externalSourceType = serviceMenuList[i].getExternalSourceType();
                    if(externalSourceType == targetExternalSourceType) {
                        return i;
                    }
                }
                return 0;
            } catch (e) {
                return 0;
            }
        }

        function getExternalSourTypeByMenuKey(menuKey) {
            switch(menuKey) {
                case CSSHandler.MENU_CHANNEL_GUIDE:
                    return FunctionMenuExternalSourceType.CHANNEL_GUIDE;
                case CSSHandler.MENU_NOTIFICATION:
                    return FunctionMenuExternalSourceType.NOTICE;
                case CSSHandler.MENU_SETUP:
                    return FunctionMenuExternalSourceType.CONFIGURATION;
                case CSSHandler.MENU_JOYNLIFE:
                    return FunctionMenuExternalSourceType.JOY_N_LIFE;
                default :
                    throw "undefined menuKey exception";
            }
        }

        function isTargetServiceMenuByAppKey(appKey, serviceMenu) {
            return FunctionMenuExternalSourceType.CLOUD_APP == serviceMenu.getExternalSourceType() && appKey == serviceMenu.getExternalSourceId();
        }

        function sendFinishViewGroupEvent() {
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
        }

        function sendChangeViewGroupEvent(param) {
            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
        }

        function sendChangeViewEvent(targetView) {
            _this.sendEvent(CCAEvent.CHANGE_VIEW, targetView);
        }

        function sendChangeFocus() {
            var model = _this.model;
            var param = {};
            param.serviceMenuIndex = model.getHIndex();
            _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
        }

        function initializeModel(serviceMenuList) {
            var model = _this.model;

            var verticalVisibleSize = 1;
            var horizonVisibleSize = 9;
            var verticalMaximumSize = verticalVisibleSize;
            var horizonMaximumSize = serviceMenuList.length;

            model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
            model.setRotate(false, true);
            model.setData(serviceMenuList);
        }

        function selectService() {
            var focusedItem = _this.model.getHFocusedItem();

            switch (focusedItem.getExternalSourceType()) {
                case FunctionMenuExternalSourceType.CHANNEL_GUIDE:
                    CSSHandler.runThirdMenu(CSSHandler.MENU_CHANNEL_GUIDE);
                    break;
                case FunctionMenuExternalSourceType.SEARCH:
                    var param = {
                        targetViewGroup: DefineView.SEARCH_VIEWGROUP
                    };
                    sendChangeViewGroupEvent(param);
                    break;
                case FunctionMenuExternalSourceType.MY_TV:
                    var param = {
                        targetViewGroup: DefineView.MY_TV_VIEWGROUP,
                        categoryId: "713232"
                    };
                    sendChangeViewGroupEvent(param);
                    break;
                case FunctionMenuExternalSourceType.NOTICE:
                    CSSHandler.runThirdMenu(CSSHandler.MENU_NOTIFICATION);

                    break;
                case FunctionMenuExternalSourceType.CONFIGURATION:
                    CSSHandler.runThirdMenu(CSSHandler.MENU_SETUP);
                    break;
                case FunctionMenuExternalSourceType.JOY_N_LIFE:
                    CSSHandler.runThirdMenu(CSSHandler.MENU_JOYNLIFE);
                    break;
                case FunctionMenuExternalSourceType.BOUND_APPLICATION:
                    CSSHandler.runThirdApp(focusedItem.getExternalSourceId());
                    break;
                case FunctionMenuExternalSourceType.CLOUD_APP:
                    CSSHandler.runCSApp(focusedItem.getExternalSourceId());
                    break;
            }
        }

        this.onInitialize();

    };
    ServiceMenuView.prototype = Object.create(View.prototype);

	return ServiceMenuView;
});
