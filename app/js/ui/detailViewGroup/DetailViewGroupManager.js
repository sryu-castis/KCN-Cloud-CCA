define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack", 'cca/DefineView', 'cca/type/SortType', 'cca/PopupValues',
		"ui/detailViewGroup/detailView/DetailView", "ui/menuViewGroup/coinBalanceView/CoinBalanceView",
		"ui/detailViewGroup/relativeListView/RelativeListView", "ui/detailViewGroup/episodePeerListView/EpisodePeerListView",
		"ui/detailViewGroup/bundleProductView/BundleProductView", 'main/CSSHandler', 'service/CCAStateManager', 'service/Communicator',
		'service/CCAInfoManager', 'service/STBInfoManager', "helper/UIHelper"
        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, DefineView, SortType, PopupValues, DetailView, CoinBalanceView, RelativeListView, EpisodePeerListView, BundleProductView, CSSHandler,
             CCAStateManager, Communicator, CCAInfoManager, STBInfoManager, UIHelper) {

    var DetailViewGroupManager = function(id) {
        ViewGroup.call(this, id);
        var historyStack = null;
		var detailView = new DetailView();
		var coinBalanceView = new CoinBalanceView();
		var relativeListView = new RelativeListView();
		var episodePeerListView = new EpisodePeerListView();
		var bundleProductView = new BundleProductView();
		var currentView = null;

		var _this = this;
		var isAuthorized = false;

		DetailViewGroupManager.prototype.onInit = function() {
            addEventListener();
			historyStack = new ViewHistoryStack();
		};

		DetailViewGroupManager.prototype.onStart = function(param) {
			ViewGroup.prototype.onStart.call(this);
			stopAllView();
			addCompleteToDrawEventListener();
			preprocessStartViewGroup(param);
		};
		DetailViewGroupManager.prototype.onStop = function() {
			stopAllView();
			historyStack.pop();
        }
		DetailViewGroupManager.prototype.onHide = function() {
			detailView.onHide();
			relativeListView.onHide();
			episodePeerListView.onHide();
			bundleProductView.onHide();
		};
		DetailViewGroupManager.prototype.onPause = function() {
			// detailView.onDeActive();
			currentView.onDeActive();
		}
		DetailViewGroupManager.prototype.onShow = function() {
			detailView.onShow();
			relativeListView.onShow();
			episodePeerListView.onShow();
			// bundleProductView.onShow();

			//relativeListView.onActive();
			currentView.onActive();
			coinBalanceView.onUpdate();
			sendCompleteDrawEvent();
		};

		DetailViewGroupManager.prototype.onRestore = function() {
			var param = historyStack.pop();
			stopAllView();
			preprocessStartViewGroup(param);
		};

		DetailViewGroupManager.prototype.onPopupResult = function(param) {
			if(param.id == PopupValues.ID.CONFIRM_ADULT_AUTH) {
				if(currentView == bundleProductView) {
					currentView.onPopupResult(param);
					currentView.onActive();
				} else if(param.result == CCABase.StringSources.ButtonLabel.CONFIRM) {
					isAuthorized = true;
					startViewGroup();
				} else {
					sendFinishViewGroupEvent();
				};
			} else if(param.id == PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY || param.id == PopupValues.ID.MOD_ALERT_COMPLETE || isFromEventPopup(param)){
				if(currentView != null) {
					currentView.onPopupResult(param);
					currentView.onActive();
	            }
			} else if (param.popupType != undefined && param.popupType == PopupValues.PopupType.ERROR) {
                sendFinishViewGroupEvent();
            } else if(currentView != null) {
                currentView.onStart(param);
            }
		}

		function isFromEventPopup(param) {
			return param.popupType == PopupValues.PopupType.EVENT_DETAIL;;
		}

		function stopAllView() {
			detailView.onStop();
			relativeListView.onStop();
			episodePeerListView.onStop();
			bundleProductView.onStop();
		}


        function startViewGroup() {
        	var param = _this.tempParam;

			currentView.onStart(param);
			currentView.onActive();

			CSSHandler.pushHistory(_this.getID(), currentView.getID(), getHistoryParamForPush(param));
			CSSHandler.sendHistoryToSettopBox();

		}

		function preprocessStartViewGroup(param) {
			_this.tempParam = param;
			historyStack.push(param);
			setCurrentViewByTargetView(param);
			requestInfo(param);

        	// if(CCAInfoManager.isAdultConfirm() == false) {
			/*if(isAuthorized == false) {
				var isChecked = false;
        		checkAdultGrade(param, isChecked);
        	} else {
        		var isChecked = true;
        		checkAdultGrade(param, isChecked);
        		// startViewGroup();
        	};*/
		}

		function setCurrentViewByTargetView(param) {
			if(param.targetView == DefineView.EPISODE_PEER_LIST_VIEW){
				currentView = episodePeerListView;
			} else if(param.targetView == DefineView.DETAIL_VIEW) {
				currentView = detailView;
			} else if(param.targetView == DefineView.BUNDLE_PRODUCT_VIEW || param.bundleProduct != null) {
				historyStack.pop();
				currentView = bundleProductView;
			} else {
				if(param.episodePeer) {
					currentView = episodePeerListView;
				} else {
					currentView = detailView;
				}
			}
		}

		function requestInfo(param) {
			if(param.targetView == DefineView.EPISODE_PEER_LIST_VIEW || param.contentGroupID != undefined) {
				requestContentGroupInfo(callBackForRequestContentGroupInfo, param.contentGroupID);
			} else if(param.assetID) {
				requestAssetInfo(callBackForRequestAssetInfo, param.assetID);
			} else {
				startViewGroup();
			}
		}

        function requestContentGroupInfo(callback, contentGroupID) {
			var contentGroupProfile = 2;
			Communicator.requestContentGroupInfo(callback, contentGroupProfile, contentGroupID);
		}

		function callBackForRequestContentGroupInfo (response) {
			if(Communicator.isSuccessResponseFromHAS(response)) {
				var contentGroup = response.contentGroup;
				_this.tempParam.contentGroup = contentGroup;
				var rating = UIHelper.getNormalizationRating(contentGroup.getRating());
				checkAdultGrade(rating);
			} else {
				sendEventToChangeErrorPopup(response);
			}
		}

		function needToConfirmPassword(rating) {
			return STBInfoManager.needRatingLimit(rating) && !CCAInfoManager.isAdultConfirm();
		}

		function checkAdultGrade(rating) {
			if (needToConfirmPassword(rating)) {
				sendChangeViewToPasswordViewEvent();
			} else {
				startViewGroup();
			}
		}

		function sendEventToChangeErrorPopup(response) {
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
		}

		function  callBackForRequestAssetInfo(response) {
			if(Communicator.isSuccessResponseFromHAS(response)) {
				var asset = response.asset;
				_this.tempParam.asset = asset;
				var rating = UIHelper.getNormalizationRating(asset.getRating());
				checkAdultGrade(rating);
			} else {
				console.log('callBackForRequestAssetInfo', response);
				if(_this.tempParam.originView == DefineView.BUNDLE_PRODUCT_VIEW) {
					currentView = bundleProductView;
					currentView.onActive();
				} else {
					sendEventToChangeErrorPopup(response);
				}
			}
		}

		function requestAssetInfo(callback, assetID) {
			var assetProfile = 9;
			Communicator.requestAssetInfo(callback, assetID, assetProfile);
		}

		function sendChangeViewToPasswordViewEvent() {
			var param = {};
			param.id = PopupValues.ID.CONFIRM_ADULT_AUTH
			// param.popupType = PopupValues.PopupType.ADULT_AUTH;
			param.targetGroup = DefineView.POPUP_VIEWGROUP;
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}

		function getHistoryParamForPush(param) {
			var historyParam = {};

			if(param.contentGroupID) {
				historyParam.contentGroupID = param.contentGroupID;
			} else if(param.assetID) {
				historyParam.assetID = param.assetID;
			} else if(param.contentGroup) {
				historyParam.contentGroupID = param.contentGroup.getContentGroupID();
			} else if(param.asset) {
				historyParam.assetID = param.asset.getAssetID();
			} else if(param.bundleProduct) {
				historyParam.bundleProduct = param.bundleProduct;
			}
			if(param.isFirstTime) {
				//historyParam.isFirstTime = param.isFirstTime;
			}
			if(param.episodePeer) {
				historyParam.episodePeer = param.episodePeer;
			}

			if(param.startItemIndex) {
				historyParam.startItemIndex = param.startItemIndex;
			}
			if(param.vIndex) {
				historyParam.vIndex = param.vIndex;
			}
			if(param.targetView) {
				historyParam.targetView = param.targetView;
			}

            var tempParam = _this.tempParam;

            if(tempParam.uiDomainID) {
                historyParam.uiDomainID = tempParam.uiDomainID;
            }
            if(tempParam.uiComponentID) {
                historyParam.uiComponentID = tempParam.uiComponentID;
            }

			return historyParam;
		}


		function addEventListener() {
			removeEventListener();
			$(detailView).bind(CCAEvent.FINISH_VIEW, detailViewFinishViewListener);
			$(detailView).bind(CCAEvent.CHANGE_VIEW, detailViewChangeViewListener);
			$(detailView).bind(CCAEvent.CHANGE_VIEWGROUP, detailViewChangeViewGroupListener);
			$(detailView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, detailViewChangeFocusListener);


			$(relativeListView).bind(CCAEvent.FINISH_VIEW, detailViewFinishViewListener);
			$(relativeListView).bind(CCAEvent.CHANGE_VIEW, relativeListViewChangeViewListener);
			$(relativeListView).bind(CCAEvent.CHANGE_VIEWGROUP, relativeListViewChangeViewGroupListener);

			$(episodePeerListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, episodePeerListViewChangeFocusListener);
			$(episodePeerListView).bind(CCAEvent.CHANGE_VIEW, episodePeerListViewChangeViewListener);
			$(episodePeerListView).bind(CCAEvent.CHANGE_VIEWGROUP, episodePeerListViewChangeViewGroupListener);
			$(episodePeerListView).bind(CCAEvent.FINISH_VIEW, episodePeerListViewFinishViewListener);

			$(bundleProductView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, bundleListViewChangeFocusViewListener);
			$(bundleProductView).bind(CCAEvent.CHANGE_VIEW, bundleListViewChangeViewListener);
			$(bundleProductView).bind(CCAEvent.CHANGE_VIEWGROUP, detailViewChangeViewGroupListener);
			$(bundleProductView).bind(CCAEvent.FINISH_VIEWGROUP, detailViewFinishViewListener);

		}

		function addCompleteToDrawEventListener() {
			$(detailView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
			$(bundleProductView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
		}

		function sendCompleteDrawEvent() {
			//@Comment coinBalance를 그릴 타이밍에 아직 값이 들어 오지 않아 setTimer 로 임시 처리 (이벤트 받아 처리해야할 듯)
			setTimeout(function() {
				coinBalanceView.onStart();
			},100);
			_this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		}

		function detailViewChangeFocusListener(event, param) {
			relativeListView.onStart(param);
		}

		function removeEventListener() {
			$(detailView).unbind();
			$(relativeListView).unbind();
			$(episodePeerListView).unbind();
		}

		function detailViewFinishViewListener(event, param) {
			var historyParam = historyStack.getLast();

			if(historyParam != null && historyParam.startView == DefineView.BUNDLE_LIST_VIEW) {
				historyStack.pop();
				detailView.onStop();
				currentView = bundleProductView
				currentView.onActive();
				currentView.onShow();
			} else if(historyParam != null && currentView == bundleProductView && historyParam.targetView == DefineView.DETAIL_VIEW) {
				historyStack.pop();
				currentView.onStop();
				currentView = detailView;
				currentView.onStart(historyParam);
				currentView.onActive();
			} else if(episodePeerListView.model.getData() != null) {
				detailView.onDeActive();
				relativeListView.onDeActive();
				episodePeerListView.onActive();
				currentView = episodePeerListView;
			} else {
				CSSHandler.popHistory();
                sendFinishViewGroupEvent(param);
			}
		}

		function sendFinishViewGroupEvent(param) {
			CSSHandler.sendHistoryToSettopBox();
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP, param);
		}

		function detailViewChangeViewListener() {
			detailView.onDeActive();
			relativeListView.onActive();
			currentView = relativeListView;
		}

		function bundleListViewChangeFocusViewListener(event, param) {
			console.log('bundleListViewChangeFocusViewListener', param);
			CSSHandler.updateHistory(_this.getID(), currentView.getID(), param);
		}

		function bundleListViewChangeViewListener(event, param) {
			console.log('bundleListViewChangeViewListener', param);
			currentView.onHide();
			//param.view = bundleProductView;
			preprocessStartViewGroup(param);
		}

		function relativeListViewChangeViewListener() {
			relativeListView.onDeActive();
			detailView.onActive();
			currentView = detailView;
		}

		function detailViewChangeViewGroupListener(event, param) {
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}

		function relativeListViewChangeViewGroupListener(event, param) {
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);

			if(DefineView.DETAIL_VIEW == param.targetView || DefineView.EPISODE_PEER_LIST_VIEW == param.targetView) {
				CSSHandler.popHistory();
			}
			CSSHandler.sendHistoryToSettopBox();
		}

		function episodePeerListViewChangeFocusListener(event, param) {
			detailView.onStart(param);
			CSSHandler.updateHistory(_this.getID(), currentView.getID(), getHistoryParamForPush(param));
		}

		function episodePeerListViewChangeViewListener(event, param) {
			episodePeerListView.onDeActive();
			detailView.onActive();

			currentView = detailView;	
		}

		function episodePeerListViewChangeViewGroupListener(event, param) {
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}

		function episodePeerListViewFinishViewListener() {
			CSSHandler.popHistory();
			sendFinishViewGroupEvent();
		}

        this.onInit();
	};
	DetailViewGroupManager.prototype = Object.create(ViewGroup.prototype);
//  DetailViewGroupManager.prototype = new ViewGroup();


    return DetailViewGroupManager;
});