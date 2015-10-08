define([ "framework/ViewGroup", "framework/event/CCAEvent", "cca/DefineView", "main/CSSHandler",
        "ui/mainMenuViewGroup/layout/LayoutView", "ui/mainMenuViewGroup/serviceMenu/ServiceMenuView",
        "ui/mainMenuViewGroup/vodMenu/VodMenuView", "ui/mainMenuViewGroup/recommendContents/RecommendContentsView",
        "ui/mainMenuViewGroup/currentInfo/CurrentInfoView",
        'helper/SessionHistoryHelper', "cca/type/VisibleTimeType",
        "service/CCAInfoManager"
    ],
    function(ViewGroup, CCAEvent, DefineView, CSSHandler, LayoutView, ServiceMenuView, VodMenuView, RecommendContentsView, CurrentInfoView, SessionHistoryHelper, VisibleTimeType, CCAInfoManager) {

    var MainMenuViewGroupManager = function(id) {
        ViewGroup.call(this, id);
		var currentView = null;
        var layoutView = null;
        var serviceMenuView = null;
        var vodMenuView = null;
        var recommendContentsView = null;
        var currentInfoView = null;
        var _this = this;

        var startParam = null;

		MainMenuViewGroupManager.prototype.onInitialize = function() {
            layoutView = new LayoutView(DefineView.LAYOUT_VIEW);
            serviceMenuView = new ServiceMenuView(DefineView.SERVICE_MENU_VIEW);
            vodMenuView = new VodMenuView(DefineView.VOD_MENU_VIEW);
            recommendContentsView = new RecommendContentsView(DefineView.RECOMMEND_CONTENTS_VIEW);
            currentInfoView = new CurrentInfoView(DefineView.CURRENT_INFO_VIEW);

            addEventListener();
		};

		MainMenuViewGroupManager.prototype.onStart = function(param) {
            startParam = param;
            deactiveAllViewWhenStartViewGroup();
			startViewGroup();
            //pushResultCategoryViewHistory();
		};
		MainMenuViewGroupManager.prototype.onStop = function() {
            layoutView.onStop();
		};
		MainMenuViewGroupManager.prototype.onHide = function() {
            layoutView.onHide();
		};

		MainMenuViewGroupManager.prototype.onShow = function() {
            layoutView.onShow();
            if (currentView) {
                currentView.onActive();
            }
            sendCompleteDrawEvent();
        };

		MainMenuViewGroupManager.prototype.onUpdate = function() {

		};

        MainMenuViewGroupManager.prototype.onResume = function (param) {
            currentInfoView.onUpdate();
        }

        function startViewGroup() {
            layoutView.onStart(startParam);
        }

        function pushViewHistory() {
            var CCAHistory = {};
            CCAHistory.vodMenuIndex = vodMenuView.model.getHIndex();
            CSSHandler.pushHistory(_this.getID(), currentView.getID(), CCAHistory);
            CSSHandler.sendHistoryToSettopBox();
        }

        function updateViewHistory(event, param) {
            var CCAHistory = {};
            CCAHistory.vodMenuIndex = vodMenuView.model.getHIndex();
            CCAHistory.externalMappingId = param.externalMappingId;
            CCAHistory.selectedItemIndex = param.selectedItemIndex
            //param.promoWindow = {};
            CSSHandler.updateHistory(_this.getID(), currentView.getID(), CCAHistory);
        }

        function popHistory() {
            CSSHandler.popHistory();
        }

        function removeEventListener() {
            $(layoutView).unbind();
            $(serviceMenuView).unbind();
            $(vodMenuView).unbind();
            $(recommendContentsView).unbind();
        }

		function addEventListener() {
			removeEventListener();
            //$(layoutView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
            $(layoutView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, layoutViewCompleteDrawListener);

            //$(serviceMenuView).bind();
            $(recommendContentsView).bind(CCAEvent.CHANGE_VIEW, mainMenuChangeViewListener);
            $(recommendContentsView).bind(CCAEvent.FINISH_VIEWGROUP, mainMenuFinishViewGroupListener);
            $(recommendContentsView).bind(CCAEvent.CHANGE_VIEWGROUP, mainMenuChangeViewGroupListener);
            $(recommendContentsView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateViewHistory);

            $(vodMenuView).bind(CCAEvent.CHANGE_VIEW, mainMenuChangeViewListener);
            $(vodMenuView).bind(CCAEvent.FINISH_VIEWGROUP, mainMenuFinishViewGroupListener);
            $(vodMenuView).bind(CCAEvent.CHANGE_VIEWGROUP, mainMenuChangeViewGroupListener);
            $(vodMenuView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, vodMenuChangeFocusListener);

            $(serviceMenuView).bind(CCAEvent.CHANGE_VIEW, mainMenuChangeViewListener);
            $(serviceMenuView).bind(CCAEvent.CHANGE_VIEWGROUP, mainMenuChangeViewGroupListener);
            $(serviceMenuView).bind(CCAEvent.FINISH_VIEWGROUP, mainMenuFinishViewGroupListener);
            $(serviceMenuView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateViewHistory);
        }

        function deactiveAllViewWhenStartViewGroup() {
            recommendContentsView.onDeActive();
            vodMenuView.onDeActive();
            serviceMenuView.onDeActive();
        }

        function layoutViewCompleteDrawListener(event, param) {
            startNormalMode();
            if(!CCAInfoManager.hasTerminalKey()) {
                currentView = serviceMenuView;
            }
            currentView.onActive();
            pushViewHistory();
            setTimeout(function() {
                layoutView.onShow();
                showSubView();
            }, VisibleTimeType.POSTER_LIST_TYPE);
        }

        function startNormalMode() {
            layoutView.onHide();
            vodMenuView.onStart(startParam);
            serviceMenuView.onStart(startParam);
            recommendContentsView.onStart(startParam);
            currentInfoView.onStart(startParam);
            //hideSubView();
            if(startParam.targetView) {
                getTargetView(startParam.targetView);
            } else if(startParam.restoreTargetViewID) {
                getTargetView(startParam.restoreTargetViewID);
                //@Comment 시나리오변경. 추천영역에서 재생후 복원하면 카테고리 첫번째로 포커스하도록 수정
                if(currentView == recommendContentsView) {
                    currentView = vodMenuView;
                    vodMenuView.reset();
                }
            } else {
                currentView = vodMenuView;
            }
        }

        function hideSubView() {
            vodMenuView.onHide();
            serviceMenuView.onHide();
            recommendContentsView.onHide();
            currentInfoView.onHide();
        }

        function showSubView() {
            vodMenuView.onShow();
            serviceMenuView.onShow();
            recommendContentsView.onShow();
            currentInfoView.onShow();
        }

        function sendCompleteDrawEvent() {
            _this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
        }

        function mainMenuChangeViewListener(event, param) {
            currentView.onDeActive();
            getTargetView(param);
            currentView.onActive();
        }

        function mainMenuChangeViewGroupListener(event, param) {
            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
        }

        function mainMenuFinishViewGroupListener(event, param) {
            popHistory();
            CSSHandler.sendHistoryToSettopBox();
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP, param);
        }

        function getTargetView(param) {
            switch (param) {
                case DefineView.RECOMMEND_CONTENTS_VIEW:
                    currentView = recommendContentsView;
                    break;
                case DefineView.VOD_MENU_VIEW:
                    currentView = vodMenuView;
                    break;
                case DefineView.SERVICE_MENU_VIEW:
                    currentView = serviceMenuView;
                    break;
                default:
                    break;
            }
        }

        function vodMenuChangeFocusListener(event, param) {
            updateViewHistory(event, param);
            recommendContentsView.onUpdate(param);
        }

        this.onInitialize();
	};
	MainMenuViewGroupManager.prototype = Object.create(ViewGroup.prototype);

    return MainMenuViewGroupManager;
});