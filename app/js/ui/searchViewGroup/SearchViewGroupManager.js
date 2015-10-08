define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack",
		"cca/type/ViewerType", "cca/SubEvent",
		"ui/searchViewGroup/searchView/SearchView",
		"ui/searchViewGroup/dailyPopularityChartView/DailyPopularityChartView",
		"ui/searchViewGroup/weeklyPopularityChartView/WeeklyPopularityChartView",
		"ui/searchViewGroup/subscriberBasedRecommandAssetView/SubscriberBasedRecommandAssetView",
		"ui/searchViewGroup/keypadView/KeypadView",
		"ui/searchViewGroup/searchWordView/SearchWordView",
		"main/CSSHandler",
        "helper/UIComponentHelper",
		"cca/DefineView"
        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, ViewerType, SubEvent, SearchView, 
    	DailyPopularityChartView, WeeklyPopularityChartView, SubscriberBasedRecommandAssetView, KeypadView, SearchWordView, CSSHandler, UIComponentHelper, DefineView) {

    var SearchViewGroupManager = function(id) {
        ViewGroup.call(this, id);
        var searchView = new SearchView();
        var dailyPopularityChartView = new DailyPopularityChartView();
        var weeklyPopularityChartView = new WeeklyPopularityChartView();
        var subscriberBasedRecommandAssetView = new SubscriberBasedRecommandAssetView();
        var keypadView = new KeypadView();
        var searchWordView = new SearchWordView();

        var historyStack = null;
        var currentView = null;
        var expandSearch = false;

		var _this = this;

		SearchViewGroupManager.prototype.onInit = function() {
            addEventListener();
		};

		SearchViewGroupManager.prototype.onStart = function(param) {
			ViewGroup.prototype.onStart.call(this);
            historyStack = new ViewHistoryStack();
			addCompleteToDrawEventListener();
			startViewGroup(param);
		};
        SearchViewGroupManager.prototype.onStop = function() {
        	searchView.onStop();
        	dailyPopularityChartView.onStop();
        	weeklyPopularityChartView.onStop();
        	subscriberBasedRecommandAssetView.onStop();
        	keypadView.onStop();
        	searchWordView.onStop();
        }
		SearchViewGroupManager.prototype.onHide = function() {
			searchView.onHide();
			dailyPopularityChartView.onHide();
			weeklyPopularityChartView.onHide();
			subscriberBasedRecommandAssetView.onHide();
		};
		SearchViewGroupManager.prototype.onShow = function() {
			searchView.onShow();
			dailyPopularityChartView.onShow();
			weeklyPopularityChartView.onShow();
			subscriberBasedRecommandAssetView.onShow();
			keypadView.onStop();

            // 상세 페이지로 간 후에 back하면 searchWordView나 keypadView는 닫히기 때문에 search view를 active 해야함.
            if( currentView == searchWordView || currentView == keypadView ) {
                currentView = searchView;
            }

			if(currentView != undefined) {
				currentView.onActive();
			}
			sendCompleteDrawEvent();
		};

		SearchViewGroupManager.prototype.onUpdate = function() {

		};

        SearchViewGroupManager.prototype.onPopupResult = function(param) {
            //categoryListView.onShow();
            if(currentView != null) {
                currentView.onPopupResult(param);
                if(currentView == keypadView){
                	currentView.onActive();
                }
            }
        };

        function startViewGroup(param) {
        	searchView.onStart();

			startTargetView(dailyPopularityChartView, param);
			startTargetView(weeklyPopularityChartView, param);
			startTargetView(subscriberBasedRecommandAssetView, param);

			setCurrentView(param);
        	currentView.onActive();
        	var CCAHistory = {};
        	CSSHandler.pushHistory(_this.getID(), currentView.getID(), CCAHistory);
			CSSHandler.sendHistoryToSettopBox();
        }

		function startTargetView(targetView, restoreParam) {
			var startParam = getParamByRestoreTargetView(targetView, restoreParam);
			targetView.onStart(startParam);
		}

		function getParamByRestoreTargetView(targetView, restoreParam) {
			var returnParam = {};
			if ( needRestoreTargetViewID(restoreParam.restoreTargetViewID) && restoreParam.restoreTargetViewID == targetView.getID()) {
				returnParam = restoreParam;
			}
			return returnParam;
		}

		function setCurrentView(restoreParam) {
			if ( needRestoreTargetViewID(restoreParam.restoreTargetViewID) ) {
				currentView = getCurrentViewByRestoreTargetViewID(restoreParam.restoreTargetViewID);
			} else {
				currentView = searchView;
			}
		}

		function getCurrentViewByRestoreTargetViewID(restoreTargetViewID) {
			if ( restoreTargetViewID == dailyPopularityChartView.getID() ) {
				return dailyPopularityChartView;
			} else if ( restoreTargetViewID == weeklyPopularityChartView.getID() ) {
				return weeklyPopularityChartView;
			} else if ( restoreTargetViewID == subscriberBasedRecommandAssetView.getID() ) {
				return subscriberBasedRecommandAssetView;
			}
		}

		function needRestoreTargetViewID(restoreTargetViewID) {
			return restoreTargetViewID != null && restoreTargetViewID != DefineView.SEARCH_VIEW && restoreTargetViewID != DefineView.SEARCH_WORD_VIEW && restoreTargetViewID != DefineView.KEYPAD_VIEW;
		}

		function addEventListener() {
			removeEventListener();
			$(searchView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupEventListener);
			$(searchView).bind(CCAEvent.CHANGE_VIEW, changeViewEventListener);
			$(searchView).bind(CCAEvent.SHOW_VIRTUAL_KEYPAD, showKeypadEventListener);
			$(searchView).bind(CCAEvent.FINISH_VIEW, finishViewEventListener);

			$(dailyPopularityChartView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupEventListener);
			$(dailyPopularityChartView).bind(CCAEvent.CHANGE_VIEW, changeViewEventListener);
			$(dailyPopularityChartView).bind(CCAEvent.FINISH_VIEW, finishViewEventListener);
			$(dailyPopularityChartView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, focusChangeListener);

			$(weeklyPopularityChartView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupEventListener);
			$(weeklyPopularityChartView).bind(CCAEvent.CHANGE_VIEW, changeViewEventListener);
			$(weeklyPopularityChartView).bind(CCAEvent.FINISH_VIEW, finishViewEventListener);
			$(weeklyPopularityChartView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, focusChangeListener);
			
			$(subscriberBasedRecommandAssetView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupEventListener);
			$(subscriberBasedRecommandAssetView).bind(CCAEvent.CHANGE_VIEW, changeViewEventListener);
			$(subscriberBasedRecommandAssetView).bind(CCAEvent.FINISH_VIEW, finishViewEventListener);
			$(subscriberBasedRecommandAssetView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, focusChangeListener);
			

			$(keypadView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupEventListener);
			$(keypadView).bind(CCAEvent.CHANGE_VIEW, changeViewEventListener);
			$(keypadView).bind(CCAEvent.UPDATE_VIEW, updateViewEventListener);
			$(keypadView).bind(CCAEvent.FINISH_VIEW, finishViewEventListener);

			$(searchWordView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupEventListener);
			$(searchWordView).bind(CCAEvent.CHANGE_VIEW, changeViewEventListener);
			$(searchWordView).bind(CCAEvent.UPDATE_VIEW, updateViewEventListener);
			$(searchWordView).bind(CCAEvent.FINISH_VIEW, finishViewEventListener);
		}

		function removeEventListener() {
			$(searchView).unbind();
			$(dailyPopularityChartView).unbind();
			$(weeklyPopularityChartView).unbind();
			$(subscriberBasedRecommandAssetView).unbind();
			$(keypadView).unbind();
			$(searchWordView).unbind();
		}

		function addCompleteToDrawEventListener() {
			$(subscriberBasedRecommandAssetView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
		}

		function sendCompleteDrawEvent() {
			_this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		}

		function showKeypadEventListener(event, param) {
			currentView.onDeActive();
			currentView = keypadView;
			currentView.onStart({'expandSearch': expandSearch});
			currentView.onActive();
			searchWordView.onStart(param);
		}

		function changeViewGroupEventListener(event, param) {
			_this.sendEvent(event, param);
		}

		function focusChangeListener(event, param){
			updateViewHistory(param);
		}
		
		function changeViewEventListener(event, param) {
//			console.log('changeViewEventListener:'+param.targetView);
			currentView.onDeActive();
			switch(param.targetView) {
				case DefineView.SEARCH_VIEW:
					currentView = searchView;
					break;
				case DefineView.SEARCH_DAILY_POPULARITY_CHART_VIEW:
					currentView = dailyPopularityChartView;
					break;
				case DefineView.SEARCH_WEEKLY_POPULARITY_CHART_VIEW:
					currentView = weeklyPopularityChartView;
					break;
				case DefineView.SEARCH_SUBSCRIBER_BASED_RECOMMANDATION_VIEW:
					currentView = subscriberBasedRecommandAssetView;
					break;
				case DefineView.KEYPAD_VIEW:
					currentView = keypadView;
					break;
				case DefineView.SEARCH_WORD_VIEW:
					currentView = searchWordView;
					break;
				default:
					break;
			}
			currentView.onActive(param);
            updateViewHistory(param);
		}

		function updateViewEventListener(event, param) {
			switch(param.targetView) {
				case DefineView.KEYPAD_VIEW:
					keypadView.onUpdate(param);
					break;
				case DefineView.SEARCH_WORD_VIEW:
					searchWordView.onUpdate(param);
					break;
			}
		}

		function finishViewEventListener(event, param) {
//			console.log('finishViewEventListener', event.target);
			// event.target.onDeActive();
			if(param != null) {
				expandSearch = param.expandSearch;
			}

			if(event.target == searchWordView || event.target == keypadView) {
				keypadView.onDeActive();
				keypadView.onStop();
				searchWordView.onDeActive();
				searchWordView.onStop();
				currentView = searchView;
				currentView.onActive();
			} else {
				CSSHandler.popHistory();
				CSSHandler.sendHistoryToSettopBox();
				sendFinishViewGroupEvent();
			}
			// event.target.onStop();
			// searchView.onActive();
		}

		function sendFinishViewGroupEvent() {
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
		}
		function updateViewHistory(param) {
            var CCAHistory = {};
            CCAHistory.vIndex = param.vIndex;
            CCAHistory.vStartIndex = param.vStartIndex;
            CCAHistory.hIndex = param.hIndex;
//            console.log(currentView.getID());
//            console.log(CSAHistory.vIndex);
//            console.log(CSAHistory.vStartIndex);
//            console.log(CSAHistory.hIndex);

            CCAHistory.uiDomainID = UIComponentHelper.UIDomainID.SEARCH;
            CCAHistory.uiComponentID = UIComponentHelper.UIComponentID.SEARCH_WINDOW;

            CSSHandler.updateHistory(_this.getID(), currentView.getID(), CCAHistory);
        }
		
        this.onInit();
	};
	SearchViewGroupManager.prototype = Object.create(ViewGroup.prototype);
//  SearchViewGroupManager.prototype = new ViewGroup();


    return SearchViewGroupManager;
});
