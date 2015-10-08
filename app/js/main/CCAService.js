define(["framework/utils/TaskManager", "framework/event/CCAEvent", 'cca/SubEvent',
        'service/CCAStateManager',
        'main/CSSHandler',
        "service/CCAInfoManager", "service/Communicator", "service/CouponManager", "service/CategoryManager",
        "cca/type/JumpType", "cca/DefineView", "cca/PopupValues", 'cca/type/PlayType',
        'service/PurchaseManager', 'helper/UIHelper', 'helper/DateHelper',
        "ui/menuViewGroup/MenuViewGroupManager", "ui/mytvViewGroup/MyTVViewGroupManager",
        "ui/couponGuideDetailViewGroup/CouponGuideDetailViewGroupManager", "ui/couponPopupViewGroup/CouponPopupViewGroupManager",
        "ui/detailViewGroup/DetailViewGroupManager",
        "ui/searchViewGroup/SearchViewGroupManager",
        "ui/popupViewGroup/PopupViewGroupManager",
        'ui/relativeViewGroup/RelativeViewGroupManager',
        'ui/searchResultViewGroup/SearchResultViewGroupManager',
        'ui/playerViewGroup/PlayerViewGroupManager',
        'ui/purchaseViewGroup/PurchaseViewGroupManager',
        'ui/modViewGroup/ModViewGroupManager',
        "ui/mainMenuViewGroup/MainMenuViewGroupManager",
        "ui/promotionBannerPopupViewGroup/PromotionBannerPopupViewGroupManager",
        'service/STBInfoManager',
        'helper/DrawerHelper',
        "helper/SessionHistoryHelper", "cca/type/EntryType",
        "helper/UIComponentHelper",
        "cca/type/PromoWindowLinkType"
    ],
    function (TaskManager, CCAEvent, SubEvent, CCAStateManager, CSSHandler, CCAInfoManager, Communicator, CouponManager, CategoryManager, JumpType, DefineView, PopupValues, PlayType,
              PurchaseManager, UIHelper, DateHelper,
              MenuViewGroupManager, MyTVViewGroupManager,
              CouponGuideDetailViewGroupManager, CouponPopupViewGroupManager,
              DetailViewGroupManager, SearchViewGroupManager, PopupViewGroupManager, RelativeViewGroupManager, SearchResultViewGroupManager, PlayerViewGroupManager, PurchaseViewGroupManager,
              ModViewGroupManager, MainMenuViewGroupManager, PromotionBannerPopupViewGroupManager,
              STBInfoManager, DrawerHelper, SessionHistoryHelper, EntryType, UIComponentHelper, PromoWindowLinkType) {
        //@ 객체를 생성하여 사용할 객체는 function 으로 정의함. this로 내부 메소드 접근


        var CCAService = function () {

            var menuViewGroupManager = null;
            var detailViewGroupManager = null;
            var popupViewGroupManager = null;
            var mytvViewGroupManager = null;
            var searchViewGroupManager = null;
            var couponGuideDetailViewGroupManager = null;
            var couponPopupViewGroupManager = null;
            var searchResultViewGroupManager = null;
            var relativeViewGroupManager = null;
            var playerViewGroupManager = null;
            var purchaseViewGroupManager = null;
            var modViewGroupManager = null;
            var mainMenuViewGroupManager = null;
            var promotionBannerPopupViewGroupManager = null;

            var _this = this;

            this.initialize = function () {
                console.info("CCAService, initialize");
                console.info("CCAService, Version " + CCAInfoManager.getVersion());
                console.info("JQuery version : " + ($().jquery)); //1.9.1

                //뷰 초기화
                menuViewGroupManager = new MenuViewGroupManager("MenuViewGroupManager");
                mytvViewGroupManager = new MyTVViewGroupManager("MyTVViewGroupManager");
                couponGuideDetailViewGroupManager = new CouponGuideDetailViewGroupManager("CouponGuideDetailViewGroupManager");
                couponPopupViewGroupManager = new CouponPopupViewGroupManager("CouponPopupViewGroupManager");
                detailViewGroupManager = new DetailViewGroupManager("DetailViewGroupManager");
                searchViewGroupManager = new SearchViewGroupManager("SearchViewGroupManager");
                popupViewGroupManager = new PopupViewGroupManager("PopupViewGroupManager");
                searchResultViewGroupManager = new SearchResultViewGroupManager('SearchResultViewGroupManager');
                relativeViewGroupManager = new RelativeViewGroupManager('RelativeViewGroupManager');
                playerViewGroupManager = new PlayerViewGroupManager('PlayerViewGroupManager');
                purchaseViewGroupManager = new PurchaseViewGroupManager('PurchaseViewGroupManager');
                modViewGroupManager = new ModViewGroupManager('ModViewGroupManager');
                mainMenuViewGroupManager = new MainMenuViewGroupManager(DefineView.MAIN_MENU_VIEWGROUP_MANAGER);
                promotionBannerPopupViewGroupManager = new PromotionBannerPopupViewGroupManager(DefineView.PROMOTION_BANNER_POPUP_VIEWGROUP_MANAGER);
                addEventListener();
                preload();
                //@ CSS 에 어플리케이션 로드 완료됨을 알림
                CSSHandler.notifyCCALoadComplete();
            };

            function beforeStart() {
                initAdultConfirmToSTB();
                //clearTask();
            }

            function callbackForRequestCheckAdultOption(response) {
                if (Communicator.isSuccessResponseFromHAS(response)) {
                    if (response.checkAdultOption == 1) {
                        var ageLimit = 19;
                        STBInfoManager.setAgeLimit(ageLimit);
                    }
                }
            }

            var retryOpenPromotionPushCount = 0;

            function openPromotionPushPopup() {
                if (retryOpenPromotionPushCount > 10) {
                    retryOpenPromotionPushCount = 0;
                    return;
                }

                if (CouponManager.isCompletedRequestForBalances()) {
                    retryOpenPromotionPushCount = 0;

                    var currentManager = TaskManager.getLastHistory();
                    if (currentManager != menuViewGroupManager && currentManager != mytvViewGroupManager) {
                        return;
                    }

                    var checkPromotionCouponIssued = CouponManager.checkPromotionCouponIssued();
                    var promotionDiscountCoupon = CouponManager.getPromotionDiscountCoupon();

                    if (checkPromotionCouponIssued) {
                        TaskManager.addHistory(popupViewGroupManager);
                        popupViewGroupManager.onStart({id: PopupValues.ID.CONFIRM_PUSH_COUPON});

                    } else if (promotionDiscountCoupon != null) {
                        var id = PopupValues.ID.ALERT_PUSH_DISCOUNT_COUPON;
                        var popupValue = PopupValues[id];
                        if (promotionDiscountCoupon.getCouponClassName() != null && promotionDiscountCoupon.getCouponClassName() != "") {
                            popupValue.title = promotionDiscountCoupon.getCouponClassName();
                        } else {
                            popupValue.title = CCABase.StringSources.confirmPushDiscountCouponTitle;
                        }
                        popupValue.headText = promotionDiscountCoupon.getCouponName();
                        popupValue.subText = CCABase.StringSources.confirmPushDiscountCouponSubText.replace('_PRICE_', UIHelper.addThousandSeparatorCommas(promotionDiscountCoupon.getDiscountAmount()));
                        TaskManager.addHistory(popupViewGroupManager);
                        popupViewGroupManager.onStart({id: id});
                    }
                } else {
                    setTimeout(function () {
                        retryOpenPromotionPushCount++;
                        openPromotionPushPopup();
                    }, 200);
                }
            }

            this.startMenuGroup = function (param, entryPoint) {
                if(EntryType.OTHERS == entryPoint){
                    beforeStart();
                }
                if (hasTerminalKey()) {
                    var category = readRootCategory(param.currentCategoryID);
                    if (category != null) {
                        if (EntryType.OTHERS == entryPoint) {
                            CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_SUCCESS);
                        }
                        if (category.getDescription() == "couponShop" && CCAInfoManager.isMobileUser()) {
                            clearTask();
                            TaskManager.addHistory(popupViewGroupManager);
                            popupViewGroupManager.onStart({
                                popupType: PopupValues.PopupType.ERROR,
                                id: PopupValues.ID.ALERT_LIMITED_MENU
                            });
                        } else {
                            goToStartMenuGroup(param, category);
                            if(!STBInfoManager.isB2B()) {
                                openPromotionPushPopup();
                            }
                        }
                    } else {
                        startAbsenceCategoryPopup();
                    }
                } else {
                    if (EntryType.OTHERS == entryPoint) {
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_FAIL_WITH_POPUP);
                    }
                    failToRequestTerminalkey();
                }
            }

            function goToStartMenuGroup(param, category) {
                var startViewGroup = findViewGroupByCategory(category);
                TaskManager.addHistory(startViewGroup);
                //@Comment 첫진입시와 서브진입시 타이머컨테이너를 다르게 하기 위한 부분
                param.isFirstDepth = true;
                startViewGroup.onStart(param);
            }

            function initAdultConfirmToSTB() {
                CCAInfoManager.setAdultConfirm(false);
                CCAInfoManager.setAdultConfirmToSTB()
            }

            this.startDetailGroup = function (param, entryPoint) {
                if(EntryType.OTHERS == entryPoint){
                    beforeStart();
                }
                if (hasTerminalKey()) {
                    if (EntryType.OTHERS == entryPoint) {
                        param.uiDomainID = UIComponentHelper.UIDomainID.EXT;
                        param.uiComponentID = UIComponentHelper.getUIComponentId(param.callerID);
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_SUCCESS);
                    }

                    TaskManager.addHistory(detailViewGroupManager);
                    detailViewGroupManager.onStart(param);
                } else {
                    if (EntryType.OTHERS == entryPoint) {
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_FAIL_WITH_POPUP);
                    }
                    failToRequestTerminalkey();
                }
            }

            this.startSearchViewGroup = function (param, entryPoint) {
                beforeStart();
                if (hasTerminalKey()) {
                    if (EntryType.OTHERS == entryPoint) {
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_SUCCESS);
                    }

                    TaskManager.addHistory(searchViewGroupManager);
                    searchViewGroupManager.onStart(param);
                    //CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_SUCCESS);
                } else {
                    if (EntryType.OTHERS == entryPoint) {
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_FAIL_WITH_POPUP);
                    }
                    failToRequestTerminalkey();
                }
            }

            this.startMODTrigger = function (param, entryPoint) {
                beforeStart();
                if (hasTerminalKey()) {
                    param.uiDomainID = UIComponentHelper.UIDomainID.PLAYING;
                    param.uiComponentID = UIComponentHelper.UIComponentID.PLAYING_MOD;

                    if (EntryType.OTHERS == entryPoint) {
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_SUCCESS);
                    }

                    TaskManager.addHistory(modViewGroupManager);
                    modViewGroupManager.onStart(param);
                    CCAStateManager.setPlay(true);
                    //CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_SUCCESS);
                } else {
                    if (EntryType.OTHERS == entryPoint) {
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_FAIL_WITH_POPUP);
                    }
                    failToRequestTerminalkey();
                }
            }

            this.startPlayerClosePopup = function (param, entryPoint) {
                //@Comment 기존에 move 가 올떄 clearTask 만들어서 상세로 가도록 만들었는데 status 에서 cleartask 를 해서 문제가 생김.
                //해결을위해 close move 시에 clearTask 처리
                clearTask();
                if (hasTerminalKey()) {
                    if (EntryType.OTHERS == entryPoint) {
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_SUCCESS);
                    }
                    TaskManager.addHistory(playerViewGroupManager);
                    param.targetView = DefineView.CLOSE_PLAYER_VIEW;
                    playerViewGroupManager.onStart(param);
                } else {
                    if (EntryType.OTHERS == entryPoint) {
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_FAIL_WITH_POPUP);
                    }
                    failToRequestTerminalkey();
                }
            }

            this.startPromotionViewGroup = function (param, entryPoint) {
                if (hasTerminalKey()) {
                    TaskManager.addHistory(promotionBannerPopupViewGroupManager);
                    promotionBannerPopupViewGroupManager.onStart(param);
                } else {
                    failToRequestTerminalkey();
                }
            }

            this.startListView = function (param, entryPoint) {
                if(EntryType.OTHERS == entryPoint){
                    beforeStart();
                }
                if (hasTerminalKey()) {
                    if (EntryType.OTHERS == entryPoint) {
                        param.uiDomainID = UIComponentHelper.UIDomainID.EXT;
                        param.uiComponentID = UIComponentHelper.getUIComponentId(param.callerID);
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_SUCCESS);
                    }

                    var transactionId = param.assetID;
                    var assetID = param.assetID;
                    var contentGroupProfile = 0;
                    Communicator.requestContentGroupInfoByAssetID(function (response) {
                        calbackForRequestContentGroupInfoByAssetID(response, param);
                    }, transactionId, assetID, contentGroupProfile);
                } else {
                    if (EntryType.OTHERS == entryPoint) {
                        CSSHandler.sendResponseForMove(CSSHandler.RESPONSE_FAIL_WITH_POPUP);
                    }
                    failToRequestTerminalkey();
                }
            }

            function calbackForRequestContentGroupInfoByAssetID(response, param) {
                if (Communicator.isSuccessResponseFromHAS(response)) {
                    var contentGroup = response.contentGroup;
                    var targetViewGroup = null;
                    var currentViewGroup = TaskManager.getLastHistory();
                    if (contentGroup.isEpisodePeerContent()) {
                        var param = {};
                        param.targetView = DefineView.EPISODE_PEER_LIST_VIEW;
                        param.contentGroupID = contentGroup.getContentGroupID();

                        TaskManager.addHistory(detailViewGroupManager);

                        detailViewGroupManager.onStart(param);
                        targetViewGroup = detailViewGroupManager;
                    } else {
                        var param = {
                            'currentCategoryID': contentGroup.getCategoryID(),
                            'rootCategoryName': '',
                            'index': 0,
                            'startIndex': 0,
                            'jumpType': JumpType.ONTHE_CATEGORY
                        };
                        _this.startMenuGroup(param)
                        targetViewGroup = menuViewGroupManager;
                    }

                    DrawerHelper.hidePreviousViewAfterCompleteDrawEvent(currentViewGroup, targetViewGroup);
                }
            }

            function panelLog(text) {
                /*var last = $("#debuger").html();
                 last += "<br>" + text;

                 $("#debuger").html(last);
                 window.cssWrapper.log(text);*/
            }

            window.panelLog = panelLog;
            this.restoreHistory = function (subViewParam) {
                if (hasTerminalKey()) {
                    CategoryManager.cleanCategory();
                    var lastHistory = CSSHandler.popHistory().history;
                    var viewGroup = getViewGroupByID(lastHistory.entryDomain);
                    var viewID = lastHistory.entryPointID;
                    var param = JSON.parse(lastHistory.entryContext);
                    param.restoreTargetViewID = viewID;

                    if (subViewParam != null) {
                        param.subViewParam = subViewParam;
                    }

                    if (isSubViewHistory(viewGroup, viewID)) {
                        this.restoreHistory(param);
                    } else if(isPromotionBannerPopupView(viewGroup)) {
                        this.restoreHistory();
                    } else {
                        TaskManager.addHistory(viewGroup);
                        viewGroup.onStart(param);
                    }
                } else {
                    clearTask();
                    failToRequestTerminalkey();
                }
            }

            function isDetailViewGroupWithOutEpisode(viewGroup, viewID) {
                return (viewGroup == detailViewGroupManager && 'detailView' == viewID);
            }

            function isPromotionBannerPopupView(viewGroup) {
                return viewGroup == promotionBannerPopupViewGroupManager;
            }

            function isSubViewHistory(viewGroup, viewID) {
                if (viewGroup == menuViewGroupManager && DefineView.CATEGORY_LIST_VIEW != viewID) {
                    return true;
                } else if (viewGroup == mytvViewGroupManager && DefineView.CATEGORY_LIST_VIEW != viewID) {
                    return true;
                } else if (viewGroup == relativeViewGroupManager && DefineView.RESULT_CATEGORY_LIST_VIEW != viewID) {
                    return true;
                } else if (viewGroup == searchResultViewGroupManager && DefineView.SEARCH_RESULT_CATEGORY_LIST_VIEW != viewID) {
                    return true;
                } else {
                    return false;
                }
            }


            this.notifyToHASAboutStartPlay = function (data) {
                var playType = PurchaseManager.getPlayType();
                if (PlayType.NORMAL == playType) {
                    if (!UIHelper.isPurchasedProduct(PurchaseManager.getPlayProduct())) {
                        PurchaseManager.purchase(callbackForPurchase);
                    } else {
                        requestNotifyStartPlay();
                    }
                } else {
                    callbackForNotifyStartPlay();
                }
            }

            this.prepareStartApp = function () {
                this.requestTerminalKey();
                clearTask();
                Communicator.requestAvailablePaymentType(function (result) {
                    if (Communicator.isSuccessResponseFromHAS(result) == true) {
                        CCAInfoManager.setAvailablePaymentTypeList(result.paymentTypeList);
                    }
                    CouponManager.requestCouponBalance();
                });

                CSSHandler.requestTimeout(CSSHandler.TIME_OF_TIMEOUT_NORMAL);

                if (STBInfoManager.AGE_LIMIT_NONE == STBInfoManager.getAgeLimit()) {
                    Communicator.requestCheckAdultOption(callbackForRequestCheckAdultOption);
                }
                CCAInfoManager.setAdultConfirm(false);
                CCAInfoManager.getCCAInfoAll();
            }

            this.requestTerminalKey = function () {
                CCAInfoManager.initTerminalKey();
                Communicator.requestTerminalKey(function (response) {
                    //response.resultCode = 202;
                    if (Communicator.isSuccessResponseFromHAS(response)) {
                        CCAInfoManager.setTerminalKey(response.terminalKey);
                    } else {
                        CCAInfoManager.setTerminalKeyResultCode(response.resultCode);
                    }
                });
                return hasTerminalKey();
            }

            this.exitKeyPressedHandler = function () {
                if (CCAStateManager.isShowEOSPopup()) {
                    CCAStateManager.setShowEOSPopup(false);
                    clearTask();
                    TaskManager.addHistory(playerViewGroupManager);
                    playerViewGroupManager.onRequestStopPlayer();
                } else {
                    CSSHandler.notifyHideUI(CSSHandler.HIDE_TYPE_EXIT);
                }
            }

            this.forcedStopVOD = function () {
                playerViewGroupManager.onRequestStopPlayer();
            }

            function hasTerminalKey() {
                return CCAInfoManager.hasTerminalKey();
            }

            function requestNotifyStartPlay() {
                var asset = PurchaseManager.getPlayAsset();
                var product = PurchaseManager.getPlayProduct();
                Communicator.requestNotifyStartPlay(callbackForNotifyStartPlay, asset.getAssetID(), asset.getCategoryID(), product.getProductID(), product.getGoodId());
            }

            function callbackForPurchase(response) {
                if (Communicator.isSuccessResponseFromHAS(response)) {
                    requestNotifyStartPlay();
                } else {
                    callbackForNotifyStartPlay();
                }
            }

            function callbackForNotifyStartPlay(response) {
                var data = {};

                if (Communicator.isSuccessResponseFromHAS(response)) {
                    data.playEventId = response.playEventId;
                    data.result = true;
                } else {
                    data.playEventId = '';
                    data.result = false;
                }
                CSSHandler.sendResponseForStartPlay(data);
            }

            function getViewGroupByID(viewGroupID) {
                switch (viewGroupID) {
                    case menuViewGroupManager.getID() :
                        return menuViewGroupManager;
                    case detailViewGroupManager.getID() :
                        return detailViewGroupManager;
                    case mytvViewGroupManager.getID() :
                        return mytvViewGroupManager;
                    case searchViewGroupManager.getID() :
                        return searchViewGroupManager;
                    case couponGuideDetailViewGroupManager.getID() :
                        return couponGuideDetailViewGroupManager;
                    case couponPopupViewGroupManager.getID() :
                        return couponPopupViewGroupManager;
                    case searchResultViewGroupManager.getID() :
                        return searchResultViewGroupManager;
                    case relativeViewGroupManager.getID() :
                        return relativeViewGroupManager;
                    case playerViewGroupManager.getID() :
                        return playerViewGroupManager;
                    case purchaseViewGroupManager.getID() :
                        return purchaseViewGroupManager;
                    case mainMenuViewGroupManager.getID() :
                        return mainMenuViewGroupManager;
                    case promotionBannerPopupViewGroupManager.getID():
                        return promotionBannerPopupViewGroupManager;
                }

            }

            function preload() {
                var imageFileNameList = 'resources/imageList.json';
                $.getJSON(imageFileNameList, callBackForLoadImageFileNameList);
            }

            function callBackForLoadImageFileNameList(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].filename != null) {
                        var url = 'resources/images/' + data[i].filename;
                        preloadImage(url);
                    }
                }
            }

            function preloadImage(url) {
                try {
                    var _img = new Image();
                    _img.src = url;
                } catch (e) {
                    //console.error(e)
                }
            }

            function readRootCategory(currentCategoryID) {
                var response = CategoryManager.getRootCategory(currentCategoryID);

                if (Communicator.isSuccessResponseFromHAS(response) && response.categoryList[0] != null) {
                    return response.categoryList[0];
                } else {
                    return null;
                }
            }

            function findViewGroupByCategory(category) {
                if (isMyTVMenu(category)) {
                    return mytvViewGroupManager;
                } else {
                    return menuViewGroupManager;
                }
            }

            function isMyTVMenu(currentCategory) {
                return currentCategory.getDescription() == "MyTV" || currentCategory.getDescription() == "couponShop" || currentCategory.getDescription() == "myList" ||
                    currentCategory.getDescription() == "mobileChoice" || currentCategory.getDescription() == "help";
            }

            function failToRequestTerminalkey() {
                //clearTask();
                TaskManager.addHistory(popupViewGroupManager);
                var popupId;

                if(STBInfoManager.hasSTBInfo()) {
                    popupId = CCAInfoManager.getTerminalKeyResultCode();
                } else {
                    popupId = PopupValues.ID.STB_INFO_IS_NULL;
                }
                popupViewGroupManager.onStart({popupType: PopupValues.PopupType.ERROR, id: popupId});
            }

            function startAbsenceCategoryPopup() {
                TaskManager.addHistory(popupViewGroupManager);
                popupViewGroupManager.onStart({popupType: PopupValues.PopupType.ERROR, id:  PopupValues.ID.ABSENCE_CATEGORY});
            }

            //@Comment 외부로 부터 키이벤트를 받아서 분배
            this.onKeyDown = function (event) {
                if (!isKeyBlock(event)) {
                    //console.info("CCAService, onKeyDown : " + event.keyCode);
                    $(window).trigger(CCAEvent.SEND_KEYEVENT, event);
                    if (CCAInfoManager.needBlockToEnterKeyRepetition() && isEnterKey(event)) {
                        keyEventTimer = new Date();
                    }
                }
            };

            var keyEventTimer = null;

            function isKeyBlock(event) {
                if (CCAInfoManager.needBlockToEnterKeyRepetition() && isEnterKey(event) && keyEventTimer != null) {
                    var lastEventTime = keyEventTimer.getTime();
                    var currentEventTime = new Date().getTime();
                    return (currentEventTime - lastEventTime) < CCAInfoManager.getRepetitionEnterKeyBlockTime();
                } else {
                    return false;
                }
            }

            function isEnterKey(event) {
                return event.keyCode == window.TVKeyValue.KEY_ENTER;
            }

            function addEventListener() {
                $(mainMenuViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(mainMenuViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, mainMenuViewGroupChangeListener);

                $(promotionBannerPopupViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(promotionBannerPopupViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, promotionBannerPopupViewGroupChangeListener);

                $(menuViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(menuViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, menuViewGroupChangeListener);
                $(menuViewGroupManager).bind(SubEvent.JUMP_OTHER_CATEGORY, jumpCategoryListener);


                $(mytvViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(mytvViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, mytvViewGroupChangeListener);
                $(mytvViewGroupManager).bind(SubEvent.JUMP_OTHER_CATEGORY, jumpCategoryListener);

                $(couponGuideDetailViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(couponGuideDetailViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, couponGuideDetailViewGroupChangeListener);
                $(couponPopupViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(couponPopupViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, couponPopupViewGroupChangeListener);
                $(couponPopupViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, popupViewGroupFinishWithResultListener);

                $(detailViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(detailViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, detailViewGroupChangeViewGroupListener);

                $(popupViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(popupViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, popupViewGroupFinishWithResultListener);

                $(relativeViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(relativeViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, menuViewGroupChangeListener);

                $(purchaseViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(purchaseViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, purchaseViewGroupFinishWithResultListener);
                $(purchaseViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, purchaseViewGroupChangeListener);

                $(searchViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(searchViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, searchGroupChangeViewGroupListener);

                $(searchResultViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(searchResultViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, searchGroupChangeViewGroupListener);

                $(playerViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, viewGroupFinishListener);
                $(playerViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, playerViewGroupChangeViewGroupListener);

                $(modViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP, modViewGroupFinishListener);
                $(modViewGroupManager).bind(CCAEvent.CHANGE_VIEWGROUP, modViewGroupChangeListener);
                $(modViewGroupManager).bind(CCAEvent.FINISH_VIEWGROUP_WITH_RESULT, modViewGroupFinishWithResultChangeListener);
            }

            function purchaseViewGroupFinishWithResultListener(event, param) {
                var currentViewGroup = TaskManager.getLastHistoryWithRemove();
                currentViewGroup.onStop();
                var lastViewGroup = TaskManager.getLastHistory();
                console.log('currentViewGroup id : ' + currentViewGroup.getID());
                console.log('lastViewGroup id : ' + lastViewGroup.getID());
                //currentViewGroup.onStop();
                DrawerHelper.stopPreviousViewAfterCompleteDrawEvent(currentViewGroup, lastViewGroup);

                lastViewGroup.onShow();
                lastViewGroup.onPopupResult(param);
            }

            function viewGroupFinishListener(event, param) {
                var currentViewGroup = TaskManager.getLastHistoryWithRemove();
                var lastViewGroup = TaskManager.getLastHistory();

                if (lastViewGroup) {
                    console.log('currentViewGroup id : ' + currentViewGroup.getID());
                    console.log('lastViewGroup id : ' + lastViewGroup.getID());
                    //currentViewGroup.onStop();
                    DrawerHelper.stopPreviousViewAfterCompleteDrawEvent(currentViewGroup, lastViewGroup)

                    if (lastViewGroup == menuViewGroupManager && param && param.needReloadHistory == true) {
                        lastViewGroup.onRestore(param);
                    } else if (currentViewGroup == relativeViewGroupManager && lastViewGroup == detailViewGroupManager) {
                        lastViewGroup.onRestore();
                    } else {
                        lastViewGroup.onResume();
                        lastViewGroup.onShow();
                    }

                } else if (lastViewGroup == null && CCAStateManager.hasRestoreData()) {
                    currentViewGroup.onStop();
                    _this.restoreHistory();
                } else {
                    console.info("backToEpgMode : ");
                    currentViewGroup.onStop();

                    if (CCAStateManager.isPlay()) {
                        CSSHandler.notifyHideUI(CSSHandler.HIDE_TYPE_EXIT);
                    } else {
                        CSSHandler.gotoEPGState(callbackForGotoEPG);
                    }
                }
            }

            function popupViewGroupFinishWithResultListener(event, param) {
                var currentViewGroup = TaskManager.getLastHistoryWithRemove();
                console.log('currentViewGroup id : ' + currentViewGroup.getID());
                currentViewGroup.onStop();
                var lastViewGroup = TaskManager.getLastHistory();

                if (lastViewGroup) {
                    console.log('lastViewGroup id : ' + lastViewGroup.getID());

                    switch (lastViewGroup) {
                        case modViewGroupManager:
                        case purchaseViewGroupManager:
                            break;
                        case menuViewGroupManager:
                            if (param != undefined && param.id == PopupValues.ID.CONFIRM_PUSH_COUPON && param.result == CCABase.StringSources.ButtonLabel.COUPON_VIEW) {
                                console.log("Go to MyTV Coupon used history menu");

                            }
                            else if (param != undefined && param.id == PopupValues.ID.HIDDEN) {
                                // do nothing
                            }
                            else if (param != undefined && param.id == PopupValues.ID.ALERT_REGISTER_MONTHLY_COUPON_COMPLETED) {
                                lastViewGroup.onShow();
                            }
                            break;
                        case mytvViewGroupManager:
                            if (param != undefined &&
                                (!(param.id == PopupValues.ID.CONFIRM_PUSH_COUPON && param.result == CCABase.StringSources.ButtonLabel.COUPON_VIEW)
                                && param.id != PopupValues.ID.HIDDEN)) {
                                lastViewGroup.onShow();
                            }
                            break;
                        case playerViewGroupManager:
                            if (param.popupType != undefined &&
                                (param.popupType == PopupValues.PopupType.NO_BUTTON && param.id == PopupValues.ID.ALERT_RATING_SUCCEEDED)
                                || (param.popupType == PopupValues.PopupType.RATING && param.result == CCABase.StringSources.ButtonLabel.CONFIRM)) {

                            }
                            else {
                                lastViewGroup.onShow();
                            }
                            break;
                        case searchViewGroupManager:
                            if (currentViewGroup != popupViewGroupManager) {
                                lastViewGroup.onShow();
                            }
                            break;
                        default :
                            lastViewGroup.onShow();
                            lastViewGroup.onResume();

                            break;
                    }

                    lastViewGroup.onPopupResult(param);
                } else {
                    console.info("backToEpgMode : ");
                    if (CCAStateManager.isPlay() || isSTBInfoNullPopup(param)) {
                        CSSHandler.notifyHideUI(CSSHandler.HIDE_TYPE_EXIT);
                    } else {
                        CSSHandler.gotoEPGState(callbackForGotoEPG);
                    }
                }
            }

            function isSTBInfoNullPopup(param) {
                return PopupValues.PopupType.ERROR == param.popupType && PopupValues.ID.STB_INFO_IS_NULL == param.id;
            }

            function getTargetViewGroup(targetViewGroup) {
                if (DefineView.MY_TV_VIEWGROUP == targetViewGroup) {
                    return mytvViewGroupManager;
                } else if (DefineView.MENU_VIEWGROUP == targetViewGroup) {
                    return menuViewGroupManager
                }
            }

            function mainMenuViewGroupChangeListener(event, param) {
                var currentViewGroup = TaskManager.getLastHistory();
                var targetViewGroupId = param.targetViewGroup;
                var targetViewGroup = null;

                switch (targetViewGroupId) {
                    case DefineView.MY_TV_VIEWGROUP:
                        var info = {
                            'currentCategoryID': param.categoryId,
                            'rootCategoryName': "마이 TV",
                            'index': 0,
                            'startIndex': 0
                        };
                        _this.startMenuGroup(info);
                        targetViewGroup = mytvViewGroupManager;
                        break;
                    case DefineView.SEARCH_VIEWGROUP:
                        _this.startSearchViewGroup({});
                        targetViewGroup = searchViewGroupManager;
                        break;
                    case DefineView.MENU_VIEWGROUP:
                        _this.startMenuGroup(param);
                        targetViewGroup = menuViewGroupManager;
                        break;
                    case DefineView.DETAIL_VIEWGROUP_MANAGER:
                        _this.startDetailGroup(param);
                        targetViewGroup = detailViewGroupManager;
                        break;
                    case DefineView.PROMOTION_BANNER_POPUP_VIEWGROUP_MANAGER:
                        _this.startPromotionViewGroup(param);
                        targetViewGroup = promotionBannerPopupViewGroupManager;
                        break;
                    case DefineView.LIST_VIEW_GROUP:
                        _this.startListView(param);
                        break;
                    case DefineView.POPUP_VIEWGROUP:
                        TaskManager.addHistory(popupViewGroupManager);
                        popupViewGroupManager.onStart(param);
                        break;
                }
                //currentViewGroup.onHide();
                DrawerHelper.hidePreviousViewAfterCompleteDrawEvent(currentViewGroup, targetViewGroup);
            }

            function menuViewGroupChangeListener(event, param) {
                if (DefineView.DETAIL_VIEW == param['targetView']
                    || DefineView.EPISODE_PEER_LIST_VIEW == param['targetView']
                    || DefineView.BUNDLE_PRODUCT_VIEW == param['targetView']) {

                    var currentViewGroup = TaskManager.getLastHistory();
                    DrawerHelper.hidePreviousViewAfterCompleteDrawEvent(currentViewGroup, detailViewGroupManager);
                    //currentViewGroup.onHide();

                    TaskManager.addHistory(detailViewGroupManager);

                    detailViewGroupManager.onStart(param);
                } else if (DefineView.POPUP_VIEWGROUP == param.targetGroup || PopupValues.PopupType.EVENT_DETAIL == param.popupType) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    // currentViewGroup.onHide();
                    TaskManager.addHistory(popupViewGroupManager);

                    popupViewGroupManager.onStart(param);
                }
                ;
            }

            function jumpCategoryListener(event, param) {
                clearTask();
                CCAStateManager.clearHistory();
                var category = readRootCategory(param.currentCategoryID);
                if (category != null) {
                    var startViewGroup = findViewGroupByCategory(category);
                    TaskManager.addHistory(startViewGroup);
                    startViewGroup.onStart(param);
                } else {
                    //TODO 카테고리 획득 실패에 대한 통신에러 팝업
                }

            }

            function callbackForGotoEPG() {

            }

            function mytvViewGroupChangeListener(event, param) {
                if (param.targetGroup == DefineView.COUPON_GUIDE_DETAIL_VIEWGROUP && couponGuideDetailViewGroupManager != null) {
                    TaskManager.addHistory(couponGuideDetailViewGroupManager);
                    couponGuideDetailViewGroupManager.onStart(param);
                }
                else if (param.targetGroup == DefineView.POPUP_VIEWGROUP && popupViewGroupManager != null) {
                    TaskManager.addHistory(popupViewGroupManager);
                    popupViewGroupManager.onStart(param);
                }
                else if (param.targetGroup == DefineView.COUPON_POPUP_VIEWGROUP && couponPopupViewGroupManager != null) {
                    TaskManager.addHistory(couponPopupViewGroupManager);
                    couponPopupViewGroupManager.onStart(param);

                } else if (DefineView.BUNDLE_PRODUCT_VIEW == param.targetView || DefineView.DETAIL_VIEW == param.targetView) {
                    DrawerHelper.hidePreviousViewAfterCompleteDrawEvent(mytvViewGroupManager, detailViewGroupManager);
                    TaskManager.addHistory(detailViewGroupManager);

                    detailViewGroupManager.onStart(param);
                }
                else if (param.targetGroup == DefineView.PURCHASE_VIEWGROUP) {
                    TaskManager.addHistory(purchaseViewGroupManager);
                    purchaseViewGroupManager.onStart(param);
                }
                else if (param.targetGroup == DefineView.MOD_VIEWGROUP) {
                    TaskManager.addHistory(modViewGroupManager);
                    modViewGroupManager.onStart(param);
                }
                else if (param.targetView == DefineView.PLAYER_VIEW) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onHide();
                    TaskManager.addHistory(playerViewGroupManager);

                    playerViewGroupManager.onStart(param);
                }
            }

            function detailViewGroupChangeViewGroupListener(event, param) {
                var targetView = param['targetView'];
                if (DefineView.DETAIL_VIEW == targetView || DefineView.EPISODE_PEER_LIST_VIEW == targetView) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onStop();

                    detailViewGroupManager.onStart(param);
                } else if (DefineView.SEARCH_VIEW == targetView) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onHide();
                    clearTask();
                    CCAStateManager.clearHistory();
                    TaskManager.addHistory(searchViewGroupManager);
                    searchViewGroupManager.onStart(param);
                } else if (DefineView.RELATIVE_VIEW == targetView) {
                    if (hasRelativeViewGroup()) {
                        removeRelativeViewGroup();
                    }
                    var currentViewGroup = TaskManager.getLastHistory();
                    DrawerHelper.hidePreviousViewAfterCompleteDrawEvent(currentViewGroup, relativeViewGroupManager);
                    TaskManager.addHistory(relativeViewGroupManager);

                    relativeViewGroupManager.onStart(param);
                } else if (DefineView.PLAYER_VIEW == targetView) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onHide();
                    TaskManager.addHistory(playerViewGroupManager);

                    playerViewGroupManager.onStart(param);
                } else if (DefineView.SELECT_PRODUCT_VIEW == targetView
                    || DefineView.SELECT_PAYMENT_VIEW == targetView) {

                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onPause();

                    TaskManager.addHistory(purchaseViewGroupManager);

                    purchaseViewGroupManager.onStart(param);
                } else if (DefineView.POPUP_VIEWGROUP == param.targetGroup) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onPause();

                    TaskManager.addHistory(popupViewGroupManager);

                    popupViewGroupManager.onStart(param);
                } else if (DefineView.MOD_VIEWGROUP == param.targetGroup) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onPause();
                    TaskManager.addHistory(modViewGroupManager);
                    modViewGroupManager.onStart(param);

                } else {

                }
            }

            function searchGroupChangeViewGroupListener(event, param) {
                if (param.targetGroup == DefineView.POPUP_VIEWGROUP && popupViewGroupManager != null) {
                    TaskManager.addHistory(popupViewGroupManager);
                    popupViewGroupManager.onStart(param);
                } else if (DefineView.DETAIL_VIEW == param.targetView || DefineView.EPISODE_PEER_LIST_VIEW == param.targetView) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    DrawerHelper.hidePreviousViewAfterCompleteDrawEvent(currentViewGroup, detailViewGroupManager);
                    TaskManager.addHistory(detailViewGroupManager);

                    detailViewGroupManager.onStart(param);
                } else if (DefineView.SEARCH_RESULT_VIEWGROUP == param.targetGroup) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    DrawerHelper.hidePreviousViewAfterCompleteDrawEvent(currentViewGroup, searchResultViewGroupManager);
                    TaskManager.addHistory(searchResultViewGroupManager);

                    searchResultViewGroupManager.onStart(param);
                }
            }

            function playerViewGroupChangeViewGroupListener(event, param) {
                if (DefineView.DETAIL_VIEW == param.targetView || DefineView.EPISODE_PEER_LIST_VIEW == param['targetView']) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    //currentViewGroup.onHide();
                    DrawerHelper.hidePreviousViewAfterCompleteDrawEvent(currentViewGroup, detailViewGroupManager);

                    TaskManager.addHistory(detailViewGroupManager);

                    detailViewGroupManager.onStart(param);
                } else if (DefineView.SELECT_PRODUCT_VIEW == param.targetView) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onHide();

                    TaskManager.addHistory(purchaseViewGroupManager);

                    purchaseViewGroupManager.onStart(param);

                } else if (DefineView.POPUP_VIEWGROUP == param.targetGroup) {
                    TaskManager.addHistory(popupViewGroupManager);
                    popupViewGroupManager.onStart(param);

                } else if (DefineView.MOD_VIEWGROUP == param.targetGroup) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onHide();
                    TaskManager.addHistory(modViewGroupManager);
                    modViewGroupManager.onStart(param);
                } else if (DefineView.PLAYER_VIEW == param.targetView) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onHide();

                    playerViewGroupManager.onStart(param);
                } else {

                }
            }

            function modViewGroupChangeListener(event, param) {
                if (param.targetGroup == DefineView.POPUP_VIEWGROUP && popupViewGroupManager != null) {
                    TaskManager.addHistory(popupViewGroupManager);
                    popupViewGroupManager.onStart(param);
                }
            }

            function modViewGroupFinishListener(event, param) {
                var currentViewGroup = TaskManager.getLastHistoryWithRemove();
                currentViewGroup.onStop();
                var lastViewGroup = TaskManager.getLastHistory();
                if (lastViewGroup) {
                    console.log('currentViewGroup id : ' + currentViewGroup.getID());
                    console.log('lastViewGroup id : ' + lastViewGroup.getID());

                    if (currentViewGroup == relativeViewGroupManager && lastViewGroup == detailViewGroupManager) {
                        lastViewGroup.onRestore();
                    } else {
                        lastViewGroup.onShow();
                    }
                } else if (lastViewGroup == null && CCAStateManager.hasRestoreData()) {
                    _this.restoreHistory();
                } else {
                    console.info("[modViewGroupFinishListener]requestStopPlayer");
                    CSSHandler.notifyHideUI(CSSHandler.HIDE_TYPE_EXIT);
                }
            }

            function modViewGroupFinishWithResultChangeListener(event, param) {
                modViewGroupFinishListener(event, param)
                var lastViewGroup = TaskManager.getLastHistory();
                if (lastViewGroup != null) {
                    lastViewGroup.onPopupResult(param);
                }
            }

            function purchaseViewGroupChangeListener(event, param) {
                if (DefineView.POPUP_VIEWGROUP == param.targetGroup) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onHide();

                    TaskManager.addHistory(popupViewGroupManager);
                    popupViewGroupManager.onStart(param);
                } else if (param.targetGroup == DefineView.COUPON_POPUP_VIEWGROUP && couponPopupViewGroupManager != null) {
                    var currentViewGroup = TaskManager.getLastHistory();
                    currentViewGroup.onHide();
                    TaskManager.addHistory(couponPopupViewGroupManager);
                    couponPopupViewGroupManager.onStart(param);
                } else if (DefineView.PLAYER_VIEW == param.targetView) {
                    var currentViewGroup = TaskManager.getLastHistoryWithRemove();
                    currentViewGroup.onStop();
                    //@Comment LastView 는 Detail
                    var lastViewGroup = TaskManager.getLastHistory();
                    if (lastViewGroup) {
                        lastViewGroup.onHide();
                    }

                    TaskManager.addHistory(playerViewGroupManager);

                    playerViewGroupManager.onStart(param);
                } else if (param.targetView == DefineView.BUNDLE_PRODUCT_VIEW) {
                    var currentViewGroup = TaskManager.getLastHistoryWithRemove();
                    currentViewGroup.onStop();

                    var lastViewGroup = TaskManager.getLastHistory();
                    if (lastViewGroup) {
                        lastViewGroup.onHide();
                    }

                    // TaskManager.addHistory(detailViewGroupManager);

                    detailViewGroupManager.onStart(param);
                }
            }

            this.clearTask = function() {
                clearTask();
            }

            function clearTask() {
                while (TaskManager.getLastHistory()) {
                    TaskManager.getLastHistory().onStop();
                    TaskManager.getLastHistoryWithRemove();
                }
                TaskManager.clearTask();
            }

            function hasRelativeViewGroup() {
                return TaskManager.findHistory(relativeViewGroupManager);
            }

            function removeRelativeViewGroup() {
                var currentViewGroup = TaskManager.getLastHistory();
                while (currentViewGroup != null) {
                    TaskManager.getLastHistoryWithRemove();
                    currentViewGroup.onStop();
                    if (currentViewGroup == relativeViewGroupManager) {
                        break;
                    }
                    currentViewGroup = TaskManager.getLastHistory();
                }


            }

            function couponGuideDetailViewGroupChangeListener(event, param) {
                console.log("couponGuideDetailViewGroupChangeListener :" + param.targetGroup);
            }

            function couponPopupViewGroupChangeListener(event, param) {
                //console.log("couponPopupViewGroupChangeListener :"+param.targetGroup);
                if (DefineView.POPUP_VIEWGROUP == param.targetGroup) {
                    var currentViewGroup = TaskManager.getLastHistoryWithRemove();
                    currentViewGroup.onHide();
                    //DrawerHelper.hidePreviousViewAfterCompleteDrawEvent(currentViewGroup, detailViewGroupManager);

                    TaskManager.addHistory(popupViewGroupManager);

                    popupViewGroupManager.onStart(param);
                }
            }

            /*this.testCommunicator = function() {
             var isSuccess = this.requestTerminalKey();
             if(isSuccess) {
             //if(hasTerminalKey()) {
             //Communicator.requestPurchasedProductListForRecommendation(bar, "2");

             } else {
             //failToRequestTerminalkey(response);
             }
             }*/

            function promotionBannerPopupViewGroupChangeListener(event, param) {
                var currentViewGroup = TaskManager.getLastHistory();
                var targetViewGroupId = param.targetViewGroup;
                var targetViewGroup = null;
                switch (targetViewGroupId) {
                    case DefineView.DETAIL_VIEWGROUP_MANAGER:
                        _this.startDetailGroup(param);
                        targetViewGroup = detailViewGroupManager;
                        break;
                    case DefineView.LIST_VIEW_GROUP:
                        _this.startListView(param);
                        break;
                }
                //currentViewGroup.onHide();
                DrawerHelper.hidePreviousViewAfterCompleteDrawEvent(currentViewGroup, targetViewGroup);
            }
        };

        return CCAService;
    });
