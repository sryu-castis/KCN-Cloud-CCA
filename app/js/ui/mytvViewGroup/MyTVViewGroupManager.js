define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack",
        "cca/type/ViewerType", "cca/SubEvent", "cca/DefineView",
        "ui/menuViewGroup/categoryListView/CategoryListView","ui/menuViewGroup/previewView/PreviewListView", "ui/menuViewGroup/coinBalanceView/CoinBalanceView",
        "ui/mytvViewGroup/purchaseMonthlyCouponView/PurchaseMonthlyCouponView",
        "ui/mytvViewGroup/purchaseCouponView/PurchaseCouponView",
        "ui/mytvViewGroup/registrationCouponView/RegistrationCouponView",
        "ui/mytvViewGroup/usedCouponListView/UsedCouponListView",
        "ui/mytvViewGroup/discountCouponUsedListView/DiscountCouponUsedListView",
        "ui/mytvViewGroup/couponGuideView/CouponGuideView",
        "ui/mytvViewGroup/purchasedListView/PurchasedListView",
        "ui/mytvViewGroup/watchedListView/WatchedListView",
        "ui/mytvViewGroup/purchasedSVODListView/PurchasedSVODListView",
        "ui/mytvViewGroup/wishListView/WishListView",
        "ui/mytvViewGroup/registrationMobileView/RegistrationMobileView",
        "ui/mytvViewGroup/helpMenuView/HelpMenuView",
        "ui/menuViewGroup/passwordView/PasswordView", "service/CouponManager",
        "service/STBInfoManager", "service/CCAInfoManager", 'cca/PopupValues',
        'main/CSSHandler', 'helper/DrawerHelper', 'helper/SessionHistoryHelper', "helper/UIComponentHelper"
        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, ViewerType, SubEvent, DefineView, CategoryListView, PreviewCategoryListView, CoinBalanceView
    		, PurchaseMonthlyCouponView ,PurchaseCouponView, RegistrationCouponView, UsedCouponListView, DiscountCouponUsedListView, CouponGuideView 
    		, PurchasedListView, WatchedListView, PurchasedSVODListView, WishListView, RegistrationMobileView, HelpMenuView
    		, PasswordView, CouponManager
    		,STBInfoManager, CCAInfoManager, PopupValues, CSSHandler, DrawerHelper, SessionHistoryHelper, UIComponentHelper) {

    var MyTVViewGroupManager = function(id) {
        ViewGroup.call(this, id);
        
		var categoryListView = new CategoryListView();
        var previewListView = new PreviewCategoryListView();
        var coinBalanceView = new CoinBalanceView();
        
        // 쿠폰 & 할인권 sub menu 
        this.couponviews = {};
        var purchaseMonthlyCouponView = new PurchaseMonthlyCouponView();
        var purchaseCouponView = new PurchaseCouponView();
        var registrationCouponView = new RegistrationCouponView();
        var usedCouponListView = new UsedCouponListView();
        var discountCouponUsedListView = new DiscountCouponUsedListView();
        var couponGuideView = new CouponGuideView();
        
        
        this.couponviews[purchaseMonthlyCouponView.getID()] = purchaseMonthlyCouponView;
        this.couponviews[purchaseCouponView.getID()] = purchaseCouponView;
        this.couponviews[registrationCouponView.getID()] = registrationCouponView;
        this.couponviews[usedCouponListView.getID()] = usedCouponListView;
        this.couponviews[discountCouponUsedListView.getID()] = discountCouponUsedListView;
        this.couponviews[couponGuideView.getID()] = couponGuideView;
        
        
        // vod sub menu 
        var purchasedListView = new PurchasedListView();
        var watchedListView = new WatchedListView();
        var purchasedSVODListView = new PurchasedSVODListView();
        var wishListView = new WishListView();
        var registrationMobileView = new RegistrationMobileView();
        var helpMenuView = new HelpMenuView();
        
        this.vodViews = {};
        this.vodViews[purchasedListView.getID()] = purchasedListView;
        this.vodViews[watchedListView.getID()] = watchedListView;
        this.vodViews[purchasedSVODListView.getID()] = purchasedSVODListView;
        this.vodViews[wishListView.getID()] = wishListView;
        this.vodViews[registrationMobileView.getID()] = registrationMobileView;
        this.vodViews[helpMenuView.getID()] = helpMenuView;
        
        var passwordView = new PasswordView();

        var currentSubView = null;
        var historyStack = null;
        var subViewParam = null;

		var _this = this;

		MyTVViewGroupManager.prototype.onInit = function() {
            addEventListener();
		};

		MyTVViewGroupManager.prototype.onStart = function(param) {
			ViewGroup.prototype.onStart.call(this);
            historyStack = new ViewHistoryStack();
            subViewParam = param.subViewParam;
            currentSubView = null;

			startViewGroup(param);
            pushCategoryViewHistory(param.currentCategoryID, param.rootCategoryName);
		};
        MyTVViewGroupManager.prototype.onStop = function() {
            categoryListView.onStop();
            if(currentSubView != null) {
                currentSubView.onStop();
            }
        }
		MyTVViewGroupManager.prototype.onHide = function() {
			categoryListView.onHide();
			if(currentSubView != null) {
                currentSubView.onHide();
            }
		};
		function sendCompleteDrawEvent() {
            _this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
        }
		MyTVViewGroupManager.prototype.onShow = function() {
//			console.log("mytvViewgroup onShow");
			categoryListView.onShow();
			if(currentSubView != null) {
                if(currentSubView == previewListView) {
                    categoryListView.onActive()
                } else {
                    currentSubView.onActive();
                }
                currentSubView.onShow();
            }
			sendCompleteDrawEvent();
		};

        MyTVViewGroupManager.prototype.onResult = function(param) {
            //categoryListView.onShow();
            if(currentSubView != null) {
                currentSubView.onResult(param);
            }
//            coinBalanceView.onStart(); // 쿠폰 요금제 진입시 버튼 찌그러지는 문제 방지를 위해 막음 
        };

        MyTVViewGroupManager.prototype.onPopupResult = function(param) {
            if(param.id != undefined) {
                switch (param.id) {
                    case PopupValues.ID.CONFIRM_PUSH_COUPON:
                    case PopupValues.ID.ALERT_PUSH_DISCOUNT_COUPON:
                        if (currentSubView != null)  {
                            currentSubView.onDeActive();
                        }
                        categoryListView.onActive();
                        if(param.result == CCABase.StringSources.ButtonLabel.COUPON_VIEW) {
                            jumpToCouponShowMenu(param);
                        }
                        break;
                    case PopupValues.ID.ALERT_REGISTER_COUPON_COMPLETED:
                    case PopupValues.ID.ALERT_REGISTER_MONTHLY_COUPON_COMPLETED:
                    	resetUpdateCoinBalanceTryCount();
                    	CouponManager.requestCouponBalance();
                    	updateCoinBalance();
                    	break;
                    case PopupValues.ID.HIDDEN:
                    	categoryListView.onActive();
                    	break;
                }
            } 
            if(currentSubView != null) {
                currentSubView.onPopupResult(param);
            }
            if(param.targetView != null)	{
            	if(DefineView.PURCHASE_COUPON_POPUP_VIEW == param.targetView || DefineView.PURCHASE_MONTHLY_COUPON_POPUP_VIEW == param.targetView){
                	if(param.resultCode == 100){
                		resetUpdateCoinBalanceTryCount();
                    	CouponManager.requestCouponBalance();
                    	updateCoinBalance();
                	}
                }
            }
        };

        function jumpToCouponShowMenu() {
            var param = {};
            param.currentCategoryID = STBInfoManager.getCouponShopCategoryId();
            param.viewerTypeForJump = ViewerType.USED_COUPON_LIST;
            _this.sendEvent(SubEvent.JUMP_OTHER_CATEGORY, param);
        }

		MyTVViewGroupManager.prototype.onUpdate = function() {

		};



        function pushCategoryViewHistory(currentCategoryID, rootCategoryName) {
            var CCAHistory = {'currentCategoryID':currentCategoryID, 'rootCategoryName':rootCategoryName};

            CSSHandler.pushHistory(_this.getID(), categoryListView.getID(), CCAHistory);
            CSSHandler.sendHistoryToSettopBox();
        }

        function updateCategoryViewHistory(param) {
            var CCAHistory = {};

            CCAHistory.currentCategoryID = categoryListView.model.getCurrentCategory().getCategoryID();
            CCAHistory.rootCategoryName = categoryListView.model.getRootCategoryName();
            CCAHistory.vIndex = categoryListView.model.getVIndex();
            CCAHistory.vStartIndex = categoryListView.model.getVStartIndex();
            if(currentSubView) {
                CCAHistory.currentSubViewType = currentSubView.getID();
            }

            CCAHistory.uiDomainID = UIComponentHelper.UIDomainID.MYTV;
            CCAHistory.uiComponentID = getUiComponentID(param);

            CSSHandler.updateHistory(_this.getID(), categoryListView.getID(), CCAHistory);
        }

        function getUiComponentID(param) {
            var uiComponentID = 0;
            var focusedCategory = param.focusedCategory;
            switch (focusedCategory.getViewerType()) {
                case ViewerType.PURCHASED_LIST:	//구매목록
                    uiComponentID = UIComponentHelper.UIComponentID.MYTV_BOUGHT;
                    break;
                case ViewerType.WATCHED_LIST:	//시청목록
                    uiComponentID = UIComponentHelper.UIComponentID.MYTV_WATCHED;
                    break;
                case ViewerType.WISH_LIST:	//찜목록
                    uiComponentID = UIComponentHelper.UIComponentID.MYTV_WISH;
                    break;
            }
            return uiComponentID;
        }

        function pushSubViewHistory() {
            var CCAHistory = {};
            CSSHandler.pushHistory(_this.getID(), currentSubView.getID(), CCAHistory);
        }

        function updateSubViewHistory(param) {
            /*var CSAHistory = {};
            CSAHistory.vIndex = currentSubView.model.getVIndex();
            CSAHistory.vStartIndex = currentSubView.model.getVStartIndex();
            CSAHistory.hIndex = currentSubView.model.getHIndex();
            CSAHistory.hStartIndex = currentSubView.model.getHStartIndex();
*/
            CSSHandler.updateHistory(_this.getID(), currentSubView.getID(), param);
        }

        function popHistory() {
            CSSHandler.popHistory();
        }

		this.tryCount = 0;
		var MAX_TRY_COUNT = 10;
		function resetUpdateCoinBalanceTryCount()	{
			this.tryCount = 0;
		}
		function updateCoinBalance() {
			if(this.tryCount < MAX_TRY_COUNT){
				if(CouponManager.isCompletedRequestForBalances()){
	            	coinBalanceView.onUpdate();
	            	resetUpdateCoinBalanceTryCount();
	 
	            } else {
	                setTimeout(function(){
	                	updateCoinBalance();
	                	this.tryCount++;
	                }, 100);
	            }
	 	
			}
			else	{
				resetUpdateCoinBalanceTryCount();
			}
		}
        function startViewGroup(param) {
            categoryListView.onStart(param);
            categoryListView.onActive();
        }


		function addEventListener() {
			removeEventListener();
			$(categoryListView).bind(CCAEvent.CHANGE_VIEW, categoryListChangeViewListener);
			$(categoryListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, categoryListChangeFocusListener);
			$(categoryListView).bind(CCAEvent.FINISH_VIEW, categoryListFinishViewListener);
            $(categoryListView).bind(CCAEvent.SEND_KEYEVENT, categoryListSendKeyEventListener);
            $(categoryListView).bind(CCAEvent.CHANGE_VIEWGROUP, categoryListSendHiddenEventListener);
            
			
			for (var view in _this.couponviews) {
            	$(_this.couponviews[view]).bind(CCAEvent.CHANGE_VIEW, couponChangeViewListener);
            	$(_this.couponviews[view]).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, couponChangeFocusListener);
            	$(_this.couponviews[view]).bind(CCAEvent.FINISH_VIEW, couponFinishViewListener);
            	$(_this.couponviews[view]).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
            }
			
			for (var view in _this.vodViews) {
            	$(_this.vodViews[view]).bind(CCAEvent.CHANGE_VIEW, vodChangeViewListener);
            	$(_this.vodViews[view]).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, vodChangeFocusListener);
            	$(_this.vodViews[view]).bind(CCAEvent.FINISH_VIEW, vodFinishViewListener);
            	$(_this.vodViews[view]).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
            }
			
			$(passwordView).bind(CCAEvent.FINISH_VIEW, passwordFinishViewListener);
            $(passwordView).bind(CCAEvent.CHANGE_VIEW, passwordChangeViewListener);
		}

		function removeEventListener() {
			$(categoryListView).unbind();
			for (var view in _this.couponviews) {
            	$(_this.couponviews[view]).unbind();
            }
			for (var view in _this.vodViews) {
            	$(_this.vodViews[view]).unbind();
            }
			$(passwordView).unbind();
		}

		// category event listener
        function categoryListChangeViewListener(event, param) {
//            console.log("categoryListChangeViewListener")
            if(param.focusedCategory != null) {
                if (currentSubView == previewListView) {
                    if (param.focusedCategory.getDescription() == "couponShop" && CCAInfoManager.isMobileUser()) {
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType: PopupValues.PopupType.ERROR, id:PopupValues.ID.ALERT_LIMITED_MENU});
                    } else {
                        saveDepthHistory(param);
                        pushCategoryViewHistory(param.focusedCategory.getCategoryID(), param.rootCategoryName);
                        startViewGroup({'currentCategoryID':param.focusedCategory.getCategoryID(), 'index':0, 'startIndex':0, 'rootCategoryName': param.rootCategoryName});
                    }
                } else {
                    activateSubview();
                }
            }
        }

        function saveDepthHistory(param) {
            historyStack.push({
                'currentCategoryID' : param.currentCategoryID,
                'rootCategoryName': param.rootCategoryName,
                'index' : param.index,
                'startIndex' : param.startIndex
            });
        }

        function categoryListSendKeyEventListener(event, param) {
            if( isCurrentSubviewNeedNumberKey() ) {
                activateSubview();
                $(window).trigger(CCAEvent.SEND_KEYEVENT, param);
            }
        }
        function categoryListSendHiddenEventListener(event, param)	{
//        	console.log("categoryListSendHiddenEventListener");
        	PopupValues[PopupValues.ID.HIDDEN].subText =
        		CCABase.StringSources.CCAVersionText + CCAInfoManager.getVersion() +"<br>"
	            +CCABase.StringSources.MACText + STBInfoManager.getMacAddress() +"<br>"
	            +CCABase.StringSources.HWModelText + STBInfoManager.getModelName() +"<br>"
	            +CCABase.StringSources.HASIPText + CCAInfoManager.getHASIP() +"<br>"
	            +CCABase.StringSources.SmartCardIDText + STBInfoManager.getSmartCardId() +"<br>"
                +CCABase.StringSources.SOCodeText + STBInfoManager.getSOCode() +"<br>"
                //+CCABase.StringSources.STBIDText + STBInfoManager.getSTBID() +"<br>"

                +CCABase.StringSources.PaymentText + CCAInfoManager.getAvailablePaymentTypeList() +"<br><br>"
                +CCABase.StringSources.CSCVersion + STBInfoManager.getCscVersion() +"<br>"
                +CCABase.StringSources.CSSIP + STBInfoManager.getCssIp() +"<br>"
                //+CCABase.StringSources.HOSTIDText + STBInfoManager.getHostId() +"<br>"
                +CCABase.StringSources.TSIDListText + STBInfoManager.getTSIDList();


        	_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, id:PopupValues.ID.HIDDEN});
        }

        function isCurrentSubviewNeedNumberKey() {
            switch(currentSubView) {
                case registrationCouponView:
                case passwordView:
                    return true;
            }
            return false;
        }

        function categoryListFinishViewListener() {
            popHistory();
            CSSHandler.sendHistoryToSettopBox();

            if(historyStack.getSize() > 0) {
                var data = historyStack.pop();
                startViewGroup({'currentCategoryID':data.currentCategoryID, 'rootCategoryName':data.rootCategoryName, 'vIndex': data.index, 'vStartIndex': data.startIndex});
            } else {
                sendFinishViewEvent();
            }
        }


        function categoryListChangeFocusListener(event, param) {
            //@Comment 재생후 복원하여 진입할경우에는 STB에 저장한 값을 이용(리스트로 복원을 위해)
            if(subViewParam) {
                CCAInfoManager.setAdultConfirm(true);
            } else {
                CCAInfoManager.setAdultConfirm(false);
            }

            var mergeParam = SessionHistoryHelper.mergeParameter(param, subViewParam);
            startSubView(mergeParam);
            updateCategoryViewHistory(mergeParam);
            if(subViewParam) {
                // 이용안내일 경우 history back했을 때 focus를 category에 두어야 함.
                if (subViewParam.restoreTargetViewID != 'helpMenuView') {
                    activateSubview();
                }
                subViewParam = null;
            }
        }

        function activateSubview() {
            if(currentSubView != null) {
                if(!isNodataView() || subViewParam != null) {
                    categoryListView.onDeActive();
                    currentSubView.onActive();
                    pushSubViewHistory();
                }
            }
        }

        function isNodataView() {
            switch(currentSubView) {
                case purchasedListView:
                case watchedListView:
                case purchasedSVODListView:
                case wishListView:
                case usedCouponListView:
                case discountCouponUsedListView:
                case purchaseCouponView:
                case purchaseMonthlyCouponView:
                    if(currentSubView.model.data == null || currentSubView.model.data.length == 0) {
                        return true;
                    }
            }

            return false;
        }

        // coupon event listener +++
        function couponChangeViewListener(event, param) {
//            console.log("couponChangeViewListener:"+param.targetView);
            if(param.targetView == DefineView.CATEGORY_LIST_VIEW) 	{
                currentSubView.onDeActive();
            	categoryListView.onActive();
            	popHistory();
            }
        }

        function couponFinishViewListener(event, param) {
        	currentSubView.onDeActive();
            categoryListView.onActive();
            popHistory();
        }

        function couponChangeFocusListener(event, param) {
//            console.log("couponChangeFocusListener")
            updateSubViewHistory(param);
        }
        // coupon event listener ---
        
        // vod event listener +++
        function vodChangeViewListener(event, param) {
//            console.log("vodChangeViewListener:"+param.targetView);
            if(param.targetView == DefineView.CATEGORY_LIST_VIEW) 	{
                currentSubView.onDeActive();
            	categoryListView.onActive();
            	popHistory();
            }
        }
        
        function changeViewGroupListener(event, param) {
//            console.log("changeViewGroupListener:"+param);
        	if(param.targetView == DefineView.PLAYER_VIEW && currentSubView.getID() == DefineView.HELP_MENU_VIEW) 	{
                currentSubView.onDeActive();
            	categoryListView.onActive();
            	popHistory();
            }
            _this.sendEvent(event, param);
        }

        function vodFinishViewListener(event, param) {
//        	console.log("vodFinishViewListener:"+param);
        	currentSubView.onDeActive();
            categoryListView.onActive();
            popHistory();
        }

        function vodChangeFocusListener(event, param) {
            updateSubViewHistory(param);
        }
        
        function passwordFinishViewListener(event, param) {
//            console.log("passwordViewFinishListener");
            currentSubView.onDeActive();
            categoryListView.onActive();
            popHistory();
        };
        
        function passwordChangeViewListener(event, param) {
            //@currentSubView == passwordView
            currentSubView.onDeActive();
            startSubView(param);
            setTimeout(function() {
                if (currentSubView == previewListView) {
                    categoryListView.onActive();
                } else {
                    currentSubView.onActive();
                }
            }, 10);
        }

        function sendFinishViewEvent() {
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
        }
        // vod event listener ---

        function startSubView(param) {
            var previousViewContainer = null;
            if(currentSubView != null) {
                previousViewContainer = currentSubView.drawer.getContainer();
            }
            //closeSubView();
            findNextSubView(param);

            if(currentSubView != null) {
                if(currentSubView == passwordView) {
                    param.type = PasswordView.TYPE_USER_PASSWORD;
                } else {
                    CCAInfoManager.setAdultConfirm(false);
                }
                currentSubView.onStart(param);
            }
            coinBalanceView.onUpdate();
            bindHideViewAfterCompleteDrawEvent(previousViewContainer, currentSubView.drawer.getContainer(), currentSubView);
        }


        function bindHideViewAfterCompleteDrawEvent(previousViewContainer, nextViewContainer, currentSubView) {
            if(previousViewContainer != null) {
                DrawerHelper.stopPreviousSubViewAfterCompleteDrawEvent(previousViewContainer, nextViewContainer, currentSubView);
            } else {
                if(currentSubView) {
                    $(currentSubView).unbind(CCAEvent.COMPLETE_TO_DRAW_VIEW);
                    $(currentSubView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, function() {
                        sendCompleteDrawEvent();
                    });
                }
            }
        }

        function closeSubView() {
            if (currentSubView != null) {
                currentSubView.onStop();
            }
        }

        function findNextSubView(param) {
            var focusedCategory = param.focusedCategory;
//            console.log("focusedCategory.viewerType="+focusedCategory.getViewerType());
            if (needShowPasswordView(focusedCategory)) {
                currentSubView = passwordView;
            } else {
                switch (focusedCategory.getViewerType()) {
                    case ViewerType.PROMOTION_BANNER:
                        //currentSubView = promotionListView;
                        currentSubView = null;
                        break;
                    // coupon 관련 subview ++++
                    case ViewerType.PURCHASE_MONTHLY_COUPON: 	// vod 쿠폰 요금제
                    	currentSubView = purchaseMonthlyCouponView;
                    	break;
                    case ViewerType.PURCHASE_COUPON:	// 쿠폰 구매
                    	currentSubView = purchaseCouponView;
                    	break;
                    case ViewerType.REGISTRATION_COUPON: // 쿠폰 등록
                    	currentSubView = registrationCouponView;
                    	break;
                    case ViewerType.USED_COUPON_LIST:	// 쿠폰 사용 내역
                        currentSubView = usedCouponListView;
                        break;
                    case ViewerType.DISCOUNT_COUPON_USED_LIST:	// 할인권 사용 내역
                        currentSubView = discountCouponUsedListView;
                        break;
                    case ViewerType.COUPON_GUIDE:	// 이용 안내
                        currentSubView = couponGuideView;
                        break;
                    // coupon 관련 subview ----
                    case ViewerType.PURCHASED_LIST:	//구매목록
                    	currentSubView = purchasedListView;
                    	break;
                    case ViewerType.WATCHED_LIST:	//시청목록
                    	currentSubView = watchedListView;
                    	break;
                    case ViewerType.PURCHASED_SVOD_LIST:	//월정액 사용내역
                    	currentSubView = purchasedSVODListView;
                    	break;
                    case ViewerType.REGISTRATION_MOBILE:	//스마트폰 등록
                    	currentSubView = registrationMobileView;
                    	break;
                    case ViewerType.WISH_LIST:	//찜목록
                    	currentSubView = wishListView;
                    	break;
                    case ViewerType.HELP_MENU:	//이용자 가이드
                    	currentSubView = helpMenuView;
                    	break;
                    case ViewerType.CONTENTGROUP_LIST:
                    case ViewerType.DEFAULT:
                    default:
                        getDefaultSubView(focusedCategory);
                        break;
                }
            }
        }

        function getDefaultSubView(focusedCategory) {
            if (focusedCategory.isLeafCategory()) {
                currentSubView = null;
                /*if(focusedCategory.subCategoryPresentationType == 'P'){
                 currentSubView = posterListView;
                 } else {
                 currentSubView = contentListView;
                 }*/
            } else {
                currentSubView = previewListView;
            }
        }

        function needShowPasswordView(focusedCategory) {
        	if(!CCAInfoManager.isAdultConfirm()) {
	        	switch (focusedCategory.getViewerType()) {
		            case ViewerType.PURCHASED_LIST:	//구매목록
		            case ViewerType.WATCHED_LIST:	//시청목록
		            case ViewerType.PURCHASED_SVOD_LIST:	//월정액 사용내역
		            case ViewerType.WISH_LIST:	//찜목록
		            	return true;
		            default:
		               return false;
		        }
        	} else {
        		return false;
        	}
        }


        this.onInit();
	};
	MyTVViewGroupManager.prototype = Object.create(ViewGroup.prototype);
//  MyTVViewGroupManager.prototype = new ViewGroup();


    return MyTVViewGroupManager;
});
