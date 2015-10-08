define(["framework/View", "framework/event/CCAEvent", "cca/DefineView", "service/Communicator", "service/CategoryManager",
        "ui/mainMenuViewGroup/vodMenu/VodMenuModel", "ui/mainMenuViewGroup/vodMenu/VodMenuDrawer", "service/CCAInfoManager"
    ],
    function(View, CCAEvent, DefineView, Communicator, CategoryManager, VodMenuModel, VodMenuDrawer, CCAInfoManager) {

        var VodMenuView = function(id) {
            View.call(this, id);
            this.model = null;
            this.drawer = null;

            var changeFocusEventTimer = null;

            var _this = this;
            var HORIZON_VISIBLE_LIST_COUNT = 6;

            VodMenuView.prototype.onInitialize = function() {
                this.model = new VodMenuModel();
                this.drawer = new VodMenuDrawer(this.getID(), this.model);
            };

            VodMenuView.prototype.onBeforeStart = function(param) {
                initializeModel(param.getCategoryList());
                if(param.getPromoWindow()){
                    this.model.setPromoWindow(param.getPromoWindow());
                }
                if(param.vodMenuIndex) {
                    this.model.setHIndex(param.vodMenuIndex);
                    sendChangeFocus({recommendContentIndex : param.recommendContentIndex});
                }
            };

            VodMenuView.prototype.reset = function() {
                this.model.setHIndex(0);
                //@메인화면에서 uicomponent List 를 호출할때 사용하는 random 값이 동일 시간에 들어와 같은값으로 나오는 이슈로 인해 강제 딜레이
                setTimeout(function() {
                    sendChangeFocus();
                },1);
            }

            function cancelToLastChangeFocusEvent() {
                if(isBlockTime()) {
                    clearTimeout(changeFocusEventTimer);
                    changeFocusEventTimer = null;
                }
            }

            function isBlockTime() {
                return changeFocusEventTimer != null;
            }

            VodMenuView.prototype.onKeyDown = function(event, param) {
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
                switch (keyCode) {
                    case tvKey.KEY_UP:
                        sendChangeView(DefineView.RECOMMEND_CONTENTS_VIEW);
                        break;
                    case tvKey.KEY_DOWN:
                        sendChangeView(DefineView.SERVICE_MENU_VIEW);
                        break;
                    case tvKey.KEY_LEFT:
                        _this.keyNavigator.keyLeft();
                        _this.drawer.onRepaint();
                        vodMenuBlockTime();

                        break;
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_ESC:
                    case tvKey.KEY_EXIT:
                        _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                        break;
                    case tvKey.KEY_RIGHT:
                        _this.keyNavigator.keyRight();
                        _this.drawer.onRepaint();

                        vodMenuBlockTime();

                        break;
                    case tvKey.KEY_ENTER:
                    case tvKey.KEY_OK:
                        cancelToLastChangeFocusEvent();
                        sendChangeFocus();
                        sendChangeViewGroup();
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
                        break;
                    default:
                        break;
                }
            };

            function vodMenuBlockTime(){
                cancelToLastChangeFocusEvent();
                changeFocusEventTimer = setTimeout(function() {
                    sendChangeFocus();
                    changeFocusEventTimer = null;
                }, CCAInfoManager.getCategoryKeyBlockTime());
            };

            function initializeModel(categoryList) {
                var model = _this.model;

                var verticalVisibleSize = 1;
                var horizonVisibleSize = HORIZON_VISIBLE_LIST_COUNT;
                var verticalMaximumSize = verticalVisibleSize;
                var horizonMaximumSize = categoryList.length;

                model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                model.setRotate(false, true);
                model.setData(categoryList);
            }

            function sendChangeViewGroup() {
                var model = _this.model;
                var selectedItemIndex = model.getHIndex();
                var selectedItem = model.getData()[selectedItemIndex];
                var param = {'currentCategoryID' : selectedItem.getCategoryID(), 'rootCategoryName' : selectedItem.getPresentationName(), 'index':0, 'startIndex': 0, 'detailIconType' : selectedItem.getDetailIconType()};
                param.targetViewGroup = DefineView.MENU_VIEWGROUP;
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            }

            function sendChangeFocus(param) {
                var model = _this.model;
                if(param == null) {
                    param = {};
                }
                param.externalMappingId = model.getHFocusedItem().getMenuExternalId();
                param.promoWindow = model.getPromoWindow();
                param.selectedItemIndex = model.getHIndex();

                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
            }

            function sendChangeViewGroupEvent(param) {
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            }


            function sendChangeView(targetView) {
                _this.sendEvent(CCAEvent.CHANGE_VIEW, targetView);
            }

            this.onInitialize();
        };
        VodMenuView.prototype = Object.create(View.prototype);

        return VodMenuView;
});