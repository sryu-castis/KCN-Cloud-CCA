define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack", "cca/PopupValues", "cca/DefineView"
		,"ui/popupViewGroup/dialogPopupView/DialogPopupView"
		,"ui/popupViewGroup/choicePopupView/ChoicePopupView"
		,"ui/popupViewGroup/alertPopupView/AlertPopupView"
		,"ui/popupViewGroup/noButtonPopupView/NoButtonPopupView"
		,"ui/popupViewGroup/ratingPopupView/RatingPopupView"
		,"ui/popupViewGroup/adultAuthPopupView/AdultAuthPopupView"
		,"ui/popupViewGroup/smartPhonePopupView/SmartPhonePopupView"
		,"ui/popupViewGroup/rcpUnjoinPopupView/RcpUnjoinPopupView"
		,"ui/popupViewGroup/eventDetailPopupView/EventDetailPopupView"
		,"ui/popupViewGroup/eventWinnerPopupView/EventWinnerPopupView"
        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, PopupValues, DefineView
		, DialogPopupView
		, ChoicePopupView
		, AlertPopupView
		, NoButtonPopupView
		, RatingPopupView
		, AdultAuthPopupView
		, SmartPhonePopupView
		, RcpUnjoinPopupView
		, EventDetailPopupView
		, EventWinnerPopupView
		) {

    var PopupViewGroupManager = function(id) {
        ViewGroup.call(this, id);

        this.popupViews = {};

		var dialogPopupView = new DialogPopupView();
		var choicePopupView = new ChoicePopupView();
		var alertPopupView = new AlertPopupView();
		var noButtonPopupView = new NoButtonPopupView();
		var ratingPopupView = new RatingPopupView();
		var adultAuthPopupView = new AdultAuthPopupView();
		var smartPhonePopupView = new SmartPhonePopupView();
		var rcpUnjoinPopupView = new RcpUnjoinPopupView();
		var eventDetailPopupView = new EventDetailPopupView();
		var eventWinnerPopupView = new EventWinnerPopupView();
		
		
		this.popupViews[dialogPopupView.getID()] = dialogPopupView;
		this.popupViews[choicePopupView.getID()] = choicePopupView;
		this.popupViews[alertPopupView.getID()] = alertPopupView;
		this.popupViews[noButtonPopupView.getID()] = noButtonPopupView;
		this.popupViews[ratingPopupView.getID()] = ratingPopupView;
		this.popupViews[adultAuthPopupView.getID()] = adultAuthPopupView;
		this.popupViews[smartPhonePopupView.getID()] = smartPhonePopupView;
		this.popupViews[rcpUnjoinPopupView.getID()] = rcpUnjoinPopupView;
		this.popupViews[eventDetailPopupView.getID()] = eventDetailPopupView;
		this.popupViews[eventWinnerPopupView.getID()] = eventWinnerPopupView;
        
        var currentPopup = null;
        var historyStack = null;
		var _this = this;

		PopupViewGroupManager.prototype.onInit = function() {
            addEventListener();
		};

		PopupViewGroupManager.prototype.onStart = function(param) {
			ViewGroup.prototype.onStart.call(this);
            historyStack = new ViewHistoryStack();

			startViewGroup(param);
		};
        PopupViewGroupManager.prototype.onStop = function() {
        	 if(currentPopup != null) {
				 //currentPopup.onDeActive();
        		 currentPopup.onStop();
             }
        }
		PopupViewGroupManager.prototype.onHide = function() {
			if(currentPopup != null) {
				currentPopup.onHide();
            }

		};

		PopupViewGroupManager.prototype.onShow = function() {
			if(currentPopup != null) {
				currentPopup.onShow();
				sendCompleteDrawEvent();
            }
		};

		PopupViewGroupManager.prototype.onUpdate = function() {
			if(currentPopup != null) {
				currentPopup.onUpdate();
            }
		};

        function startViewGroup(param) {
			if(param.popupType == null || param.popupType == undefined) {
				var popupValue = PopupValues[param.id];
				param.popupType = popupValue.popupType;
			}

			if(param.popupType == PopupValues.PopupType.DIALOG || param.popupType == PopupValues.PopupType.DIALOG_XLARGE || param.popupType == PopupValues.PopupType.DIALOG_LARGE_03)	{
				currentPopup = dialogPopupView;
			}
			else if(param.popupType == PopupValues.PopupType.CHOICE)	{
				currentPopup = choicePopupView;
			}
			else if(param.popupType == PopupValues.PopupType.ALERT || param.popupType == PopupValues.PopupType.ALERT_XLARGE || param.popupType == PopupValues.PopupType.ERROR || param.popupType == PopupValues.PopupType.ERROR_PLAY || param.popupType == PopupValues.PopupType.ALERT_LARGE_03) {
				currentPopup = alertPopupView;
			}
			else if(param.popupType == PopupValues.PopupType.NO_BUTTON || param.popupType == PopupValues.PopupType.NO_BUTTON_MEDIUM) {
				currentPopup = noButtonPopupView;
			}
			else if(param.popupType == PopupValues.PopupType.RATING)	{
				currentPopup = ratingPopupView;
			}
			else if(param.popupType == PopupValues.PopupType.ADULT_AUTH)	{
				currentPopup = adultAuthPopupView;
			}
			else if(param.popupType == PopupValues.PopupType.SMART_PHONE)	{
				currentPopup = smartPhonePopupView;
			}
			else if(param.popupType == PopupValues.PopupType.UNJOIN_RCP)	{
				currentPopup = rcpUnjoinPopupView;
			}
			else if(param.popupType == PopupValues.PopupType.EVENT_DETAIL)	{
				currentPopup = eventDetailPopupView;
			}
			else if(param.popupType == PopupValues.PopupType.EVENT_WINNER)	{
				currentPopup = eventWinnerPopupView;
			}
			
        	if(currentPopup != null)	{
        		currentPopup.onStart(param);
            	currentPopup.onActive();	
        	}
        }


		function addEventListener() {
			removeEventListener();
			for (var view in _this.popupViews) {
            	$(_this.popupViews[view]).bind(CCAEvent.CHANGE_VIEW, changeViewListener);
            	$(_this.popupViews[view]).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, changeFocusListener);
            	$(_this.popupViews[view]).bind(CCAEvent.FINISH_VIEW, finishViewListener);
            	$(_this.popupViews[view]).bind(CCAEvent.FINISH_VIEWGROUP, finishViewGroupListener);
				$(_this.popupViews[view]).bind(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, finishViewGroupWithResultListener);
				//$(_this.popupViews[view]).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
            }

		}

		function removeEventListener() {
			for (var view in _this.popupViews) {
            	$(_this.popupViews[view]).unbind();
            }
		}
		function sendCompleteDrawEvent() {
			_this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
		}

        function changeViewListener(event, param) {
            // if(param.targetView == DefineView.EVENT_WINNER_POPUP_VIEW) {
            // 	currentPopup.onHide();
            // 	currentPopup = eventWinnerPopupView;
            // 	currentPopup.onStart(param);
            // 	currentPopup.onActive();
            // };
            currentPopup.onHide();
            if(param.targetView == DefineView.EVENT_WINNER_POPUP_VIEW) {
            	currentPopup = eventWinnerPopupView;
            } else if(param.popupType == PopupValues.PopupType.ERROR) {
            	currentPopup = alertPopupView;
            };
            currentPopup.onStart(param);
            currentPopup.onActive();
        }

        function finishViewListener(event, param) {
        	if(currentPopup == eventWinnerPopupView) {
        		currentPopup.onStop();
        		currentPopup = eventDetailPopupView;
        		currentPopup.onShow();
        		currentPopup.onActive();
        	};
        }
        
        function finishViewGroupListener(event, param) {
        	_this.sendEvent(event, param);
        }

		function finishViewGroupWithResultListener(event, param) {
			_this.sendEvent(event, param);
		}

        function changeFocusListener(event, param) {
            console.log("changeFocusListener")
        }

        this.onInit();
	};
	PopupViewGroupManager.prototype = Object.create(ViewGroup.prototype);
//  PopupViewGroupManager.prototype = new ViewGroup();


    return PopupViewGroupManager;
});