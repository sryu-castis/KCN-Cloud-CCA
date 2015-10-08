define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack",
		"ui/relativeViewGroup/resultCategoryListView/ResultCategoryListView",
		"ui/menuViewGroup/coinBalanceView/CoinBalanceView",
		"ui/menuViewGroup/posterListView/PosterListView",
		"ui/menuViewGroup/textListView/TextListView",
		'main/CSSHandler', "helper/DrawerHelper", 'helper/SessionHistoryHelper', "helper/UIComponentHelper"
        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, ResultCategoryListView, CoinBalanceView, PosterListView, TextListView, CSSHandler, DrawerHelper, SessionHistoryHelper, UIComponentHelper) {

    var RelativeViewGroupManager = function(id) {
        ViewGroup.call(this, id);
        var historyStack = null;
		var resultCategoryListView = new ResultCategoryListView();
		var posterListView = new PosterListView(PosterListView.TYPE_RESULT_CATEGORY);
		var textListView = new TextListView(TextListView.TYPE_RESULT_CATEGORY);
		var currentSubView = null;
		var coinBalanceView = new CoinBalanceView();

		var _this = this;
		var subViewParam = null;

		RelativeViewGroupManager.prototype.onInit = function() {
            addEventListener();
		};

		RelativeViewGroupManager.prototype.onStart = function(param) {
			subViewParam = param.subViewParam;
			currentSubView = null
			addCompleteToDrawEventListener();
			startViewGroup(param);
			pushCategoryViewHistory(param.assetID);
		};
		RelativeViewGroupManager.prototype.onStop = function() {
			resultCategoryListView.onStop();
			if(currentSubView) currentSubView.onStop();
			//coinBalanceView.onStop();
		}
		RelativeViewGroupManager.prototype.onHide = function() {
			resultCategoryListView.onHide();
			currentSubView.onHide();
			//coinBalanceView.onHide();
		};

		RelativeViewGroupManager.prototype.onShow = function() {
			resultCategoryListView.onShow();
			currentSubView.onShow();
			coinBalanceView.onShow();
			currentSubView.onActive();
			sendCompleteDrawEvent();
		};

		RelativeViewGroupManager.prototype.onUpdate = function() {

		};

        function startViewGroup(param) {
			resultCategoryListView.onStart(param);
			resultCategoryListView.onActive();
			coinBalanceView.onStart();
        }


		function addEventListener() {
			removeEventListener();
			$(resultCategoryListView).bind(CCAEvent.CHANGE_VIEW, resultCategoryListViewChangeViewListener);
			$(resultCategoryListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, resultCategoryListViewChangeFocusListener);
			$(resultCategoryListView).bind(CCAEvent.FINISH_VIEW, resultCategoryListViewFinishViewListener);

			$(posterListView).bind(CCAEvent.CHANGE_VIEW, subViewChangeListener);
			$(posterListView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
			$(posterListView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
			$(posterListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, subViewFocusChangeListener);

			$(textListView).bind(CCAEvent.CHANGE_VIEW, subViewChangeListener);
			$(textListView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
			$(textListView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
			$(textListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, subViewFocusChangeListener);
		}

		function removeEventListener() {
			$(resultCategoryListView).unbind();
		}

		function addCompleteToDrawEventListener() {
			$(posterListView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);

		}

		function sendCompleteDrawEvent() {
			_this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		}

		function pushCategoryViewHistory(assetID) {
			var CCAHistory = {'assetID' : assetID};

			CSSHandler.pushHistory(_this.getID(), resultCategoryListView.getID(), CCAHistory);
			CSSHandler.sendHistoryToSettopBox();

		}

		function updateCategoryViewHistory(param) {
			var CCAHistory = {};
			CCAHistory.vIndex = param.index;
			CCAHistory.vStartIndex = param.startIndex
			CCAHistory.assetID = param.assetID

			if(currentSubView) {
				CCAHistory.currentSubViewType = currentSubView.getID();
			}

            CCAHistory.uiDomainID = UIComponentHelper.UIDomainID.RECOMMEND;
            var uiComponentID = UIComponentHelper.UIComponentID.RECOMMEND_FIELD;
            if(param.focusedCategory.getCategoryID() == "contentsCF") {
                uiComponentID = UIComponentHelper.UIComponentID.RECOMMEND_ALL;
            }
            CCAHistory.uiComponentID = uiComponentID;

			CSSHandler.updateHistory(_this.getID(), resultCategoryListView.getID(), CCAHistory);
		}

		function pushSubViewHistory() {
			var CCAHistory = {};

			CSSHandler.pushHistory(_this.getID(), currentSubView.getID(), CCAHistory);
		}

		function updateSubViewHistory(param) {
			var CCAHistory = {};
			CCAHistory.vIndex = currentSubView.model.getVIndex();
			CCAHistory.vStartIndex = currentSubView.model.getVStartIndex();
			CCAHistory.hIndex = currentSubView.model.getHIndex();
			CCAHistory.hStartIndex = currentSubView.model.getHStartIndex();

			CSSHandler.updateHistory(_this.getID(), currentSubView.getID(), CCAHistory);
		}

		function popHistory() {
			CSSHandler.popHistory();
		}

		function subViewChangeListener(event, param) {
			currentSubView.onDeActive();
			var previousViewContainer = null;
			if(currentSubView != null) {
				previousViewContainer = currentSubView.drawer.getContainer();
			}


			if(param.targetView == "textListView") {
				currentSubView = textListView;
			} else if(param.targetView == "posterListView") {
				currentSubView = posterListView;
			};
			currentSubView.onStart(param);
			currentSubView.onActive();
			bindHideViewAfterCompleteDrawEvent(previousViewContainer, currentSubView.drawer.getContainer(), currentSubView);
		}

		function subViewFinishListener(event, param) {
			currentSubView.onDeActive();
			resultCategoryListView.onActive();
			popHistory();
		}

		function subViewFocusChangeListener(event, param) {
			updateSubViewHistory(param);
		}

		function changeViewGroupListener(event, param) {
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}

		function resultCategoryListViewChangeFocusListener(event, param) {
			//closeSubView();
			startSubView(SessionHistoryHelper.mergeParameter(param, subViewParam));

			updateCategoryViewHistory(param);
			if(subViewParam != null) {
				activateSubview();
				subViewParam = null;
			}
		}

		function startSubView(param) {
			var previousViewContainer = null;
			if(currentSubView != null) {
				previousViewContainer = currentSubView.drawer.getContainer();
			}
			currentSubView = posterListView;
			param = SessionHistoryHelper.mergeParameter(param, subViewParam);
			currentSubView.onStart(param);
			coinBalanceView.onUpdate();
			bindHideViewAfterCompleteDrawEvent(previousViewContainer, currentSubView.drawer.getContainer(), currentSubView);
		}

		function bindHideViewAfterCompleteDrawEvent(previousViewContainer, nextViewContainer, currentSubView) {
			if(previousViewContainer != null) {
				DrawerHelper.stopPreviousSubViewAfterCompleteDrawEvent(previousViewContainer, nextViewContainer, currentSubView);
			}
		}

		function activateSubview() {

			if(currentSubView != null) {
				resultCategoryListView.onDeActive();
				currentSubView.onActive();
				pushSubViewHistory();
			}
		}

		function closeSubView() {
			if (currentSubView) {
				currentSubView.onStop();
			}
		}

		function resultCategoryListViewChangeViewListener() {
			activateSubview();
		}

		function resultCategoryListViewFinishViewListener() {
			popHistory();
			CSSHandler.sendHistoryToSettopBox();
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
		}

        this.onInit();
	};
	RelativeViewGroupManager.prototype = Object.create(ViewGroup.prototype);


    return RelativeViewGroupManager;
});