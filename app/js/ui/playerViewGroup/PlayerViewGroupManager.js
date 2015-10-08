define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack",
		'main/CSSHandler',
		'cca/DefineView',
		'ui/playerViewGroup/playerView/PlayerView',
		"ui/playerViewGroup/exitPopupView/ExitPopupView",
		"ui/playerViewGroup/nextWatchPopupView/NextWatchPopupView",
		'helper/UIHelper',
		'cca/PopupValues',
		'service/Communicator',
		'cca/type/PlayType',
		'service/PurchaseManager', 'service/CCAStateManager', "helper/UIComponentHelper",
		"service/CCAInfoManager"
        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, CSSHandler, DefineView, PlayerView, ExitPopupView, NextWatchPopupView,
			 UIHelper, PopupValues, Communicator, PlayType, PurchaseManager, CCAStateManager, UIComponentHelper, CCAInfoManager) {
    var PlayerViewGroupManager = function(id) {
        ViewGroup.call(this, id);
        var historyStack = null;
		var playerView = new PlayerView();
		var exitPopupView = new ExitPopupView();
		var nextWatchPopupView = new NextWatchPopupView();
		var currentView = null;
		var _this = this;
		var exitPopupParam = null;
		var exitpopupAction = '';

		PlayerViewGroupManager.prototype.onInit = function() {
            addEventListener();
		};

		PlayerViewGroupManager.prototype.onStart = function(param) {
			ViewGroup.prototype.onStart.call(this);
            historyStack = new ViewHistoryStack();
			exitpopupAction = '';
			if(DefineView.PLAYER_VIEW == param.targetView) {
				if(isAlreadyPlay()) {
					startPlayerWithStop(param);
				} else {
					startPlayer(param);
					CSSHandler.sendAllHistory();
					CCAInfoManager.initializeCountOfNextWatch();
				}
			} else if(DefineView.CLOSE_PLAYER_VIEW == param.targetView) {
				startClosePlayerView(param);
			} else {

			}
		};
        PlayerViewGroupManager.prototype.onStop = function() {
        	if(currentView != null){
        		currentView.onStop();
        	}
        }
		PlayerViewGroupManager.prototype.onHide = function() {
			if(currentView != null){
				currentView.onHide();
			}
		};

		PlayerViewGroupManager.prototype.onShow = function() {
			if(currentView != null){
				currentView.onShow();
				currentView.onActive();
				sendCompleteDrawEvent();
			}
		};

		PlayerViewGroupManager.prototype.onUpdate = function() {

		};

		PlayerViewGroupManager.prototype.onPopupResult = function(param) {
			if (param.popupType != undefined && param.popupType == PopupValues.PopupType.ERROR_PLAY) {
				//@재생중 이전컨텐츠를 종료시키고 다른 컨텐츠를 재생하다 실패한 경우(다음회차 재생, 추가컨텐츠 재생등)
				if(isAlreadyPlay()) {
					CSSHandler.gotoEPGState(function() {
						//TODO live 전환후 해야할 작업이 있다면 여기서
					});
				} else {
					_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
				}
            } else if (param.popupType != undefined && param.popupType == PopupValues.PopupType.RATING) {
				if(param.result == CCABase.StringSources.ButtonLabel.CONFIRM)	{
					var id = PopupValues.ID.ALERT_RATING_SUCCEEDED;
            		_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:id});
				}
				else	{
//					console.error(" do something with popup result:"+param.rating+", "+param.result);	
				}
            } 
			else if(param.popupType != undefined && param.popupType == PopupValues.PopupType.NO_BUTTON && param.id == PopupValues.ID.ALERT_RATING_SUCCEEDED) {
				if(currentView != null){
					currentView.onHide();		
				}
				exitpopupAction = 'stop';
				CSSHandler.requestStopPlayer(exitpopupAction, false, requestStopCallback);

			} else if(param.id == PopupValues.ID.CHOICE_CONTINUE_VOD_PLAY || isFromEventDetailPopup(param)) {
				if (currentView != null) {
					currentView.onPopupResult(param);
					currentView.onActive();
				}
			}
		};

		PlayerViewGroupManager.prototype.onRequestStopPlayer = function() {
			exitpopupAction = 'stop';
			CSSHandler.requestStopPlayer(exitpopupAction, false, requestStopCallback);
		};

		function isAlreadyPlay() {
			return CCAStateManager.hasEXITPopup() || CCAStateManager.isPlay();
		}


		function startPlayerWithStop(param) {
			exitpopupAction = 'stop';
			var isNextVodPlay = true;
			//@Comment 재생을 위한 데이터 (param)을 멤버로 저장하기  싫어서 noname 함수를 만들어 사용
			CSSHandler.requestStopPlayer(exitpopupAction, isNextVodPlay, function(data) {
				if(data.result) {
					if(isEOS(exitPopupParam.ratio)) {
						data.offset = 0;
					}
					Communicator.requestNotifyStopPlay(function() {
						if (currentView == null || currentView == nextWatchPopupView) {
							startPlayer(param);
						} else if(currentView != null && currentView == exitPopupView) {
							startPlayer(param);
							var nextPlayAsset = param.asset;
							if(!isPreviewAsset(nextPlayAsset) && !isTrailerAsset(nextPlayAsset)) {
								CSSHandler.sendAllHistory();
							}
						}
					}, data.assetId, data.playEventId, data.offset);
				}
			});
		}

		function isPreviewAsset(nextPlayAsset) {
			var isPreviewAsset = false;
			var popupID = currentView.model.getPopupId();
			if(PopupValues.ID.EXIT_PREVIEW == popupID) {
				var previewAssetID = currentView.model.getAsset().getAssetID();
				var targetAssetID = nextPlayAsset.getAssetID();
				isPreviewAsset = (previewAssetID == targetAssetID);
			}
			return isPreviewAsset
		}

		function isTrailerAsset(nextPlayAsset) {
			var isTrailerAsset = false;
			var popupID = currentView.model.getPopupId();
			if(PopupValues.ID.EXIT_TRAILER == popupID) {
				var previewAssetID = currentView.model.getAsset().getAssetID();
				var targetAssetID = nextPlayAsset.getAssetID();
				isTrailerAsset = (previewAssetID == targetAssetID);
			}
			return isTrailerAsset
		}

		function isFromEventDetailPopup(param) {
			return param.popupType == PopupValues.PopupType.EVENT_DETAIL;
		}

		function startPlayer(param) {
			var offset = param.offset;
			var asset = param.asset;
			var playType = param.playType;
			var product = param.product;//UIHelper.getDisplayProduct(asset.getProductList());
			var isMOD = UIHelper.isHaveOST(asset);
			var isAgreeForEvent = param.isAgreeForEvent != null ? param.isAgreeForEvent : false;
			var needRetryPurchase = true;

			PurchaseManager.setPlayInfo(asset, product, playType, param.paymentType, param.coupon, isAgreeForEvent, needRetryPurchase);
			CSSHandler.requestStartPlayer(asset, product, playType, offset, isMOD, callbackForStartPlay);
			//@Comment 상세뷰를 비롯한 이전뷰가 키를 더이상 동작하지 않도록 하기 위한 조치
			playerView.onActive();
			//$("#vod_container").html("");
		}

		var SUCCESS_UMP_API = 0;
		function callbackForStartPlay(response) {
			if(SUCCESS_UMP_API != response.result)	{
				CCAStateManager.setPlay(false);
				Communicator.requestReportClientPlayError(function(){}, response.result, PurchaseManager.getPlayAsset().getCategoryID());
				_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR_PLAY, id:response.result});
			}
		}

		function startClosePlayerView(param) {
			exitPopupParam = param;
			CCAStateManager.setPlay(true);

			if (isPauseTimeOut(param.ratio)) {
				exitpopupAction = 'stop';
				CSSHandler.requestStopPlayer(exitpopupAction, false, requestStopCallback);
			} else {
				requestAssetInfo(param.assetID, callbackAfterRequestCurrentAssetInfo);
			}
		}

		function requestNextAssetInfo() {
			var currentAsset = exitPopupParam.asset;
			var nextAssetID = currentAsset.getNextWatchAssetId();
			requestAssetInfo(nextAssetID, callbackAfterRequestNextAssetInfo);
		}

		function callbackAfterRequestNextAssetInfo(response) {

			if(Communicator.isSuccessResponseFromHAS(response)) {
				if (isAlreadyPurchaseContent(response.asset)) {
					CSSHandler.notifyHideUI(CSSHandler.HIDE_TYPE_CLOSE);
					requestAutoPlayNextAsset(response.asset);
				} else {
					CCAStateManager.setShowEOSPopup(true);
					openExitPopup(exitPopupParam.assetID, exitPopupParam.asset);
				}
			} else {
				//openExitPopup(exitPopupParam.assetID, exitPopupParam.asset);
				CSSHandler.requestStopPlayer(exitpopupAction, false, requestStopCallback);
			}
		}

		function requestAutoPlayNextAsset(asset) {

			var param = {};
			param.asset = asset;
			param.product = UIHelper.getDisplayProduct(asset.getProductList());
			param.coupon = null;
			param.offset = 0;
			param.playType = PlayType.NORMAL;
			param.targetView = DefineView.PLAYER_VIEW;
			param.isNextPlay = true;

			exitViewChangeViewGroupListener(null, param);
		}

		function isAlreadyPurchaseContent(asset) {
			var product = UIHelper.getDisplayProduct(asset.getProductList());
			return UIHelper.isPurchasedProduct(product);
		}

		function isEOS(ratio) {
			return ratio == 1 || ratio == "1";
		}

		function isPauseTimeOut(ratio) {
			return ratio == "p";
		}

		function requestAssetInfo(assetID, callback) {
			var assetProfile = 9;
			Communicator.requestAssetInfo(callback, assetID, assetProfile);
        }

		function callbackAfterRequestCurrentAssetInfo (response) {

			var asset = null;
			if(Communicator.isSuccessResponseFromHAS(response)) {
				exitPopupParam.asset = response.asset;
				asset = exitPopupParam.asset;
				if (isEOS(exitPopupParam.ratio)) {
					exitpopupAction = 'stop';
					if (isExistNextWatchAsset(asset)) {
						requestNextAssetInfo();
					} else {
						CSSHandler.requestStopPlayer(exitpopupAction, false, requestStopCallback);
					}
				} else {
					openExitPopup(exitPopupParam.assetID, asset);
				}
			} else {
				openExitPopup(exitPopupParam.assetID, asset);
			}
		}

		function isExistNextWatchAsset(asset){
			return (asset == null)? false: asset.isNextWatch();
		}

		function openExitPopup(assetID, asset) {

            var param = exitPopupParam;
            param.popupID = getClosePopupValue(param);
            param.isEOS = isEOS(exitPopupParam.ratio);
            param.assetID = assetID;
			param.asset = asset;

			var isNextWatch = isExistNextWatchAsset(param.asset);
            currentView = getTypeofCloseView(param.playType, isNextWatch, param.ratio);

            var uiComponentID = 0;
            if(isNextWatch) {
                uiComponentID = UIComponentHelper.UIComponentID.PLAYING_NEXT;
            } else if(param.popupID == PopupValues.ID.EXIT_TRAILER) {
                uiComponentID = UIComponentHelper.UIComponentID.PLAYING_TRAILER;
            } else if(param.popupID == PopupValues.ID.EXIT_PREVIEW) {
                uiComponentID = UIComponentHelper.UIComponentID.PLAYING_PREVIEW;
            }

            if(uiComponentID) {
                param.uiDomainID = UIComponentHelper.UIDomainID.PLAYING;
                param.uiComponentID = uiComponentID;
            }

            currentView.onStart(param);
            currentView.onActive();

            CSSHandler.pushHistory(_this.getID(), currentView.getID(), param);
		}

		function getTypeofCloseView(playType, isNextWatch, ratio) {
			if(PlayType.NORMAL == playType) {
				if(isNextWatch){
					if(ratio >= 0.3) {
						return nextWatchPopupView;
					} else {
						return exitPopupView;
					}
				}
				else	{
					return exitPopupView;
				}
			} else if(PlayType.TRAILER == playType) {
				return exitPopupView;
			} else if(PlayType.PREVIEW == playType) {
				return exitPopupView;
			} else if(PlayType.HELP == playType) {
				return exitPopupView;
			}
		}

		function getClosePopupValue(param) {
			if(PlayType.NORMAL == param.playType) {
				return PopupValues.ID.EXIT_NORMAL_PLAY;
			} else if(PlayType.TRAILER == param.playType) {
				return PopupValues.ID.EXIT_TRAILER;
			} else if(PlayType.PREVIEW == param.playType) {
				return PopupValues.ID.EXIT_PREVIEW;
			} else if(PlayType.HELP == param.playType) {
				return PopupValues.ID.EXIT_NORMAL_PLAY;
			}
		}

        function startViewGroup(param) {
			//playerView.onStart(param);

        }


		function addEventListener() {
			removeEventListener();
			$(exitPopupView).bind(CCAEvent.FINISH_VIEW, exitPopupViewFinishViewListener);
			$(exitPopupView).bind(CCAEvent.CHANGE_VIEW);
			$(exitPopupView).bind(CCAEvent.CHANGE_VIEWGROUP, exitViewChangeViewGroupListener);
			
			$(nextWatchPopupView).bind(CCAEvent.FINISH_VIEW, exitPopupViewFinishViewListener);
            $(nextWatchPopupView).bind(CCAEvent.CHANGE_VIEW, exitViewChangeViewListener);
			$(nextWatchPopupView).bind(CCAEvent.CHANGE_VIEWGROUP, exitViewChangeViewGroupListener);
			//$(exitPopupView).bind(CCAEvent.FINISH_VIEWGROUP, exitPopupViewFinishViewGroupListener);
		}

		function removeEventListener() {
			$(exitPopupView).unbind();
		}

        function exitViewChangeViewListener(event, param) {
            if(param.targetView == DefineView.EXIT_POPUP_VIEW) 	{
                CSSHandler.popHistory();
				var asset = null;
                //openExitPopup(null, param.assetID);
				openExitPopup(param.assetID, asset);
            }
        }


		function sendCompleteDrawEvent() {
			_this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		}

		function exitPopupViewFinishViewListener(event, param) {
			exitpopupAction = param.action;

			CSSHandler.requestStopPlayer(param.action, false, requestStopCallback);
		}
		function requestStopCallback (data) {
			CSSHandler.popHistory();
			if(data.result && exitpopupAction == 'stop') {
				if(isEOS(exitPopupParam.ratio)) {
					data.offset = 0;
				} else if(isPauseTimeOut(exitPopupParam.ratio)) {

				}
				Communicator.requestNotifyStopPlay(callbackForRequestNotifyStopPlay, data.assetId, data.playEventId, data.offset);
				exitpopupAction = '';
			}
		}

		function callbackForRequestNotifyStopPlay(response) {
			CSSHandler.requestAllHistory(exitPopupViewFinishViewGroupListener);
		}
		function exitPopupViewFinishViewGroupListener(event, param) {
			_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
		}

		function exitViewChangeViewGroupListener(event, param) {
			//if(param.targetGroup != null && DefineView.POPUP_VIEWGROUP == param.targetGroup && param.id==PopupValues.ID.RATING)	{
			//	currentView.onHide();
			//} else
			if (currentView != null) {
				currentView.onHide();
			}

            if(param.isNextPlay && DefineView.PLAYER_VIEW == param.targetView) {
				var countOfNextWatch = CCAInfoManager.getCountOfNextWatch() + 1;
				CCAInfoManager.setCountOfNextWatch(countOfNextWatch);
				CCAInfoManager.setCountOfNextWatchToSTB();
			}
			CSSHandler.sendHistoryToSettopBox();
			_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
		}



        this.onInit();
	};
	PlayerViewGroupManager.prototype = Object.create(ViewGroup.prototype);
//  PlayerViewGroupManager.prototype = new ViewGroup();


    return PlayerViewGroupManager;
});