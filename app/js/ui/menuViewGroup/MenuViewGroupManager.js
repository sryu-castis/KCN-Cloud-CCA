define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack",
        "cca/type/ViewerType", "cca/SubEvent",
        "ui/menuViewGroup/categoryListView/CategoryListView","ui/menuViewGroup/previewView/PreviewListView",
        "ui/menuViewGroup/coinBalanceView/CoinBalanceView",
        "ui/menuViewGroup/posterListView/PosterListView",
        "ui/menuViewGroup/textListView/TextListView",
        "ui/menuViewGroup/dailyPopularityChartView/DailyPopularityChartView",
        "ui/menuViewGroup/weeklyPopularityChartView/WeeklyPopularityChartView",
        "ui/menuViewGroup/purchaseBasedRecommendationView/PurchaseBasedRecommendationView",
        "ui/menuViewGroup/recommendContentGroupView/RecommendContentGroupView",
        "ui/menuViewGroup/subscriberBasedRecommendationView/SubscriberBasedRecommendationView",
        "ui/menuViewGroup/assetListView/AssetListView",
        "ui/menuViewGroup/passwordView/PasswordView",
        "ui/menuViewGroup/eventListView/EventListView",
        "ui/menuViewGroup/noDataView/NoDataView",
        "ui/menuViewGroup/modView/ModView",
        "service/STBInfoManager", "service/CCAInfoManager", 'main/CSSHandler', 'cca/PopupValues',
        'helper/DrawerHelper',
        'helper/SessionHistoryHelper',
        "helper/UIComponentHelper",
        "cca/DefineView"

        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, ViewerType, SubEvent
        , CategoryListView, PreviewCategoryListView, CoinBalanceView
        , PosterListView, TextListView 
        , DailyPopularityChartView, WeeklyPopularityChartView
        , PurchaseBasedRecommendationView, RecommendContentGroupView
        , SubscriberBasedRecommendationView
        , AssetListView
        , PasswordView
        , EventListView
        , NoDataView
        , ModView
        , STBInfoManager, CCAInfoManager, CSSHandler, PopupValues, DrawerHelper, SessionHistoryHelper, UIComponentHelper, DefineView) {

    var MenuViewGroupManager = function(id) {
        ViewGroup.call(this, id);
        var categoryListView = new CategoryListView();
        var previewListView = new PreviewCategoryListView();
        var coinBalanceView = new CoinBalanceView();
        var posterListView = new PosterListView();
        var textListView = new TextListView();
        var weeklyPopularityChartView = new WeeklyPopularityChartView();
        var dailyPopularityChartView = new DailyPopularityChartView(weeklyPopularityChartView);
        var purchaseBasedRecommendationView = new PurchaseBasedRecommendationView();
        var recommendContentGroupView = new RecommendContentGroupView();
        var subscriberBasedRecommendationView = new SubscriberBasedRecommendationView();
        var assetListView = new AssetListView();
        var passwordView = new PasswordView();
        var eventListView = new EventListView();
        var finishedEventListView = new EventListView();
        var noDataView = new NoDataView();
        var modView = new ModView();
        var currentSubView = null;
        // currentSubView = posterListView;
        var historyStack = null;

        var _this = this;
        var subViewParam = null;

        MenuViewGroupManager.prototype.onInit = function() {
            addEventListener();
        };

        MenuViewGroupManager.prototype.onStart = function(param) {
            ViewGroup.prototype.onStart.call(this);
            historyStack = new ViewHistoryStack();
            currentSubView = null;
            subViewParam = param.subViewParam;
            startViewGroup(param);
            pushCategoryViewHistory(param.currentCategoryID);
        };
        MenuViewGroupManager.prototype.onStop = function() {
            categoryListView.onStop();
            if(currentSubView) {
                currentSubView.onStop();
            }
            coinBalanceView.onStop();
        }
        MenuViewGroupManager.prototype.onHide = function() {
            categoryListView.onHide();
            if(currentSubView) {
                currentSubView.onHide();
            }
            coinBalanceView.onHide();
        };

        MenuViewGroupManager.prototype.onRestore = function(param) {
            if(currentSubView == subscriberBasedRecommendationView && param && param.needReloadHistory == true) {
                subscriberBasedRecommendationView.onRetore(param);
            }
            _this.onShow();
        };

        MenuViewGroupManager.prototype.onShow = function() {
            categoryListView.onShow();
            coinBalanceView.onShow();
            if(currentSubView != null) {
                currentSubView.onShow();
                if (currentSubView == previewListView) {
                    categoryListView.onActive();
                } else {
                    currentSubView.onActive();
                }
            } else {
                categoryListView.onActive();
            }
            sendCompleteDrawEvent();
        };

        MenuViewGroupManager.prototype.onUpdate = function() {

        };

        MenuViewGroupManager.prototype.onPopupResult = function(param) {
            if(param.id != undefined) {
                switch (param.id) {
                    case PopupValues.ID.CONFIRM_PUSH_COUPON:
                    case PopupValues.ID.ALERT_PUSH_DISCOUNT_COUPON:
                        if (currentSubView != null)  {
                            currentSubView.onDeActive();
                        }
                        categoryListView.onActive();
                        if(param.result == CCABase.StringSources.ButtonLabel.COUPON_VIEW) {
                            jumpToCouponShowMenu();
                        }
                        break;
                    default :
                        this.onShow();
                        break;
                }
            } else {
                this.onShow();
            }
            if(currentSubView != null) {
                currentSubView.onPopupResult(param);
            }
        }

        function sendCompleteDrawEvent() {
            _this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
        }

        function jumpToCouponShowMenu() {
            var param = {};
            param.currentCategoryID = STBInfoManager.getCouponShopCategoryId();
            param.viewerTypeForJump = ViewerType.USED_COUPON_LIST;
            _this.sendEvent(SubEvent.JUMP_OTHER_CATEGORY, param);
        }


        function startViewGroup(param) {
            categoryListView.onStart(param);
            categoryListView.onActive();
            coinBalanceView.onStart();
            // posterListView.onStart(param);
            // posterListView.onActive();
            // textListView.onStart(param);
            // textListView.onActive();
            //foo(param);
        }

        function pushCategoryViewHistory(currentCategoryID) {
            var CCAHistory = {'currentCategoryID':currentCategoryID};
            CSSHandler.pushHistory(_this.getID(), categoryListView.getID(), CCAHistory);
            CSSHandler.sendHistoryToSettopBox();
        }

        function updateCategoryViewHistory() {
            var CCAHistory = {};

            CCAHistory.currentCategoryID = categoryListView.model.getCurrentCategory().getCategoryID();
            CCAHistory.rootCategoryName = categoryListView.model.getRootCategoryName();
            CCAHistory.detailIconType = categoryListView.model.getDetailIconType();
            CCAHistory.vIndex = categoryListView.model.getVIndex();
            CCAHistory.vStartIndex = categoryListView.model.getVStartIndex();
            if(currentSubView) {
                CCAHistory.currentSubViewType = currentSubView.getID();
            }

            CCAHistory.uiDomainID = UIComponentHelper.UIDomainID.CATEGORY;
            CCAHistory.uiComponentID = categoryListView.model.getVFocusedItem().getCategoryID();

            CSSHandler.updateHistory(_this.getID(), categoryListView.getID(), CCAHistory);
        }

        function pushSubViewHistory() {
            var CCAHistory = {};

            CSSHandler.pushHistory(_this.getID(), currentSubView.getID(), CCAHistory);
        }

        function updateSubViewHistory(event, param) {
            if(isPopularityChartView()) {
                param = getHistoryParamForPupularityChartView();
            }

            CSSHandler.updateHistory(_this.getID(), currentSubView.getID(), param);
        }

        function isPopularityChartView() {
            return (currentSubView == weeklyPopularityChartView || currentSubView == dailyPopularityChartView);
        }

        function getHistoryParamForPupularityChartView() {
            var param = {'weeklyChart':{}, 'dailyChart':{}};
            param.weeklyChart.vIndex = weeklyPopularityChartView.model.getVIndex();
            param.weeklyChart.vStartIndex = weeklyPopularityChartView.model.getVStartIndex();
            param.dailyChart.vIndex = dailyPopularityChartView.model.getVIndex();
            param.dailyChart.vStartIndex = dailyPopularityChartView.model.getVStartIndex();
            return param;
        }

        function popHistory() {
            CSSHandler.popHistory();
        }


        function addEventListener() {
            removeEventListener();
            $(categoryListView).bind(CCAEvent.CHANGE_VIEW, categoryListChangeViewListener);
            $(categoryListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, categoryListChangeFocusListener);
            $(categoryListView).bind(CCAEvent.FINISH_VIEW, categoryListFinishViewListener);
            $(categoryListView).bind(CCAEvent.SEND_KEYEVENT, categoryListSendKeyEventListener);

            $(posterListView).bind(CCAEvent.CHANGE_VIEW, subViewChangeListener);
            $(posterListView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
            $(posterListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
            $(posterListView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);

            $(textListView).bind(CCAEvent.CHANGE_VIEW, subViewChangeListener);
            $(textListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
            $(textListView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            $(textListView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);

            $(dailyPopularityChartView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
            $(dailyPopularityChartView).bind(CCAEvent.CHANGE_VIEW, popularityViewFocusChangeListener);
            $(dailyPopularityChartView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
            $(dailyPopularityChartView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);

            $(weeklyPopularityChartView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
            $(weeklyPopularityChartView).bind(CCAEvent.CHANGE_VIEW, popularityViewFocusChangeListener);
            $(weeklyPopularityChartView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
            $(weeklyPopularityChartView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);

            $(purchaseBasedRecommendationView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
            $(purchaseBasedRecommendationView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            $(purchaseBasedRecommendationView).bind(CCAEvent.CHANGE_VIEW, recommendGroupViewAndPurchaseListViewFocusChangeListener);
            $(purchaseBasedRecommendationView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
            $(purchaseBasedRecommendationView).bind(CCAEvent.UPDATE_VIEW, recommendViewUpdateListener);

            
            $(recommendContentGroupView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            $(recommendContentGroupView).bind(CCAEvent.CHANGE_VIEW, recommendGroupViewAndPurchaseListViewFocusChangeListener);
            $(recommendContentGroupView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
            $(recommendContentGroupView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
            
            $(subscriberBasedRecommendationView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            $(subscriberBasedRecommendationView).bind(CCAEvent.CHANGE_VIEW, subViewChangeListener);
            $(subscriberBasedRecommendationView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory);
            $(subscriberBasedRecommendationView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);

            $(assetListView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            $(assetListView).bind(CCAEvent.CHANGE_VIEW, subViewChangeListener);
            $(assetListView).bind(CCAEvent.CHANGE_FOCUS_ON_VIEW, updateSubViewHistory)
            $(assetListView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);

            $(passwordView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            $(passwordView).bind(CCAEvent.CHANGE_VIEW, passwordViewChangeFocusListener);

            $(eventListView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            $(eventListView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);

            $(finishedEventListView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            $(finishedEventListView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);

            // $(noDataView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            $(noDataView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);

            $(modView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            // $(bundleListView).bind(CCAEvent.FINISH_VIEW, subViewFinishListener);
            // $(bundleListView).bind(CCAEvent.CHANGE_VIEW, subViewChangeListener);
            // $(bundleListView).bind(CCAEvent.CHANGE_VIEWGROUP, changeViewGroupListener);
        }

        function removeEventListener() {
            $(categoryListView).unbind();
            $(posterListView).unbind();
            $(textListView).unbind();
            $(dailyPopularityChartView).unbind();
            $(weeklyPopularityChartView).unbind();
            $(purchaseBasedRecommendationView).unbind();
            $(recommendContentGroupView).unbind();
            $(subscriberBasedRecommendationView).unbind();
            $(assetListView).unbind();
            $(passwordView).unbind();
            $(eventListView).unbind();
            $(finishedEventListView).unbind();
            $(noDataView).unbind();
            $(modView).unbind();
            // $(bundleListView).unbind();
        };

        function popularityViewFocusChangeListener(event, param) {
            currentSubView.onDeActive();
            if(param.targetView == DefineView.DAILY_POPULARITY_CHART_VIEW) {
                currentSubView = dailyPopularityChartView;
            } else if(param.targetView == DefineView.WEEKLY_POPULARITY_CHART_VIEW) {
                currentSubView = weeklyPopularityChartView;
            };
            currentSubView.onActive();
        };

        function recommendGroupViewAndPurchaseListViewFocusChangeListener(event, param) {
            currentSubView.onDeActive();
            if(param.targetView == DefineView.RECOMMEND_CONTENT_GROUP_VIEW) {
                currentSubView = recommendContentGroupView;
            } else if(param.targetView == DefineView.PURCHASE_BASED_RECOMMENDATION_VIEW) {
                currentSubView = purchaseBasedRecommendationView;
            } else {
                subViewChangeListener(event, param);
            }
            currentSubView.onActive();
        };

        function recommendViewUpdateListener(event, param) {
            recommendContentGroupView.onStart(param);
        };

        function subViewChangeListener(event, param) {
            // currentSubView.onStop();
            currentSubView.onDeActive();
            var previousViewContainer = null;
            if(currentSubView != null) {
                previousViewContainer = currentSubView.drawer.getContainer();
            }

            if(param.targetView == DefineView.TEXT_LIST_VIEW) {
                currentSubView = textListView;
            } else if(param.targetView == DefineView.POSTER_LIST_VIEW) {
                currentSubView = posterListView;
            } else if(param.targetView == DefineView.NO_DATA_VIEW) {
                currentSubView = noDataView;   
            };
            currentSubView.onStart(param);
            currentSubView.onActive();
            bindHideViewAfterCompleteDrawEvent(previousViewContainer, currentSubView.drawer.getContainer(), currentSubView);
        };

        function subViewFinishListener(event, param) {
//            console.log("subViewFinishListener");
            currentSubView.onDeActive();

            if(currentSubView == weeklyPopularityChartView) {
                currentSubView = dailyPopularityChartView;
                popHistory();
            } else if(currentSubView == recommendContentGroupView) {
                currentSubView = purchaseBasedRecommendationView;
            } else if(currentSubView != noDataView) {
                popHistory();
            }
            categoryListView.onActive();
        };

        function categoryListChangeViewListener(event, param) {
//            console.log("categoryListChangeViewListener")
            if(param.focusedCategory != null) {
                if (currentSubView == previewListView) {
                    saveDepthHistory(param);
                    startViewGroup({'currentCategoryID':param.focusedCategory.getCategoryID(), 'index':0, 'startIndex':0, 'rootCategoryName': param.rootCategoryName, 'detailIconType': param.detailIconType});
                    pushCategoryViewHistory(param.focusedCategory.getCategoryID());
                } else if(currentSubView == noDataView) {
                    //noop
                } else {
                    activateSubview();
                }
            }
        }

        function activateSubview() {
            if(currentSubView != null) {
                categoryListView.onDeActive();
                currentSubView.onActive();
                pushSubViewHistory();
            }
        }

        function saveDepthHistory(param) {
            historyStack.push({
                'currentCategoryID' : param.currentCategoryID,
                'rootCategoryName': param.rootCategoryName,
                'index' : param.index,
                'startIndex' : param.startIndex,
                'detailIconType' : param.detailIconType
            });
        }

        function categoryListFinishViewListener() {
            popHistory();
            if(historyStack.getSize() > 0) {
                var data = historyStack.pop();
                CSSHandler.sendHistoryToSettopBox();
                startViewGroup({'currentCategoryID':data.currentCategoryID, 'rootCategoryName':data.rootCategoryName, 'vIndex': data.index, 'vStartIndex': data.startIndex, 'detailIconType' : data.detailIconType});
            } else {
                sendFinishViewGroupEvent();
            }
        }

        function categoryListSendKeyEventListener(event, param) {
            if( isCurrentSubviewNeedNumberKey() ) {
                activateSubview();
                $(window).trigger(CCAEvent.SEND_KEYEVENT, param);
            }
        }

        function isCurrentSubviewNeedNumberKey() {
            switch(currentSubView) {
                case passwordView:
                    return true;
            }
            return false;
        }

        function categoryListChangeFocusListener(event, param) {
            startSubView(SessionHistoryHelper.mergeParameter(param, subViewParam));
            updateCategoryViewHistory();
            if(subViewParam) {
                //@서브뷰의 데이터를 가져오는 시간을 위한 임의의 시간 딜레이
                setTimeout(function() {
                    activateSubview();
                    subViewParam = null;
                }, 100);
            }
        }

        function sendFinishViewGroupEvent() {
            CSSHandler.sendHistoryToSettopBox();
            _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
        }

        function startSubView(param) {
            var previousViewContainer = null;
            if(currentSubView != null) {
                previousViewContainer = currentSubView.drawer.getContainer();
            }
            findNextSubView(param);
            if(currentSubView != null) {
                if(currentSubView == passwordView) {
                    param.type = PasswordView.TYPE_ADULT_PASSWORD;
                } else if (currentSubView == finishedEventListView) {
                    param.type = EventListView.TYPE_OFF_EVENT;
                } else if (currentSubView == eventListView) {
                    param.type = EventListView.TYPE_ON_EVENT;
                }

                //@복원으로 진입시
                if(param.dailyChart != null && (currentSubView == dailyPopularityChartView || currentSubView == weeklyPopularityChartView)) {
                    dailyPopularityChartView.onStart(SessionHistoryHelper.mergeParameter(param, param.dailyChart))
                    weeklyPopularityChartView.onStart(SessionHistoryHelper.mergeParameter(param, param.weeklyChart));
                } else {
                    currentSubView.onStart(param);
                    if(currentSubView == dailyPopularityChartView) {
                        weeklyPopularityChartView.onStart(param);
                    }
                }
            }
            coinBalanceView.onUpdate();
            var nextViewContainer = currentSubView.drawer != null ?  currentSubView.drawer.getContainer() : null;
            bindHideViewAfterCompleteDrawEvent(previousViewContainer, nextViewContainer, currentSubView);
        }

        function bindHideViewAfterCompleteDrawEvent(previousViewContainer, nextViewContainer, currentSubView) {
            if(previousViewContainer != null) {
                if(currentSubView == purchaseBasedRecommendationView) {
                    currentSubView = recommendContentGroupView;
                }
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
            if (currentSubView) {
                currentSubView.onStop();
                if(currentSubView == dailyPopularityChartView) {
                    weeklyPopularityChartView.onStop();
                };
            }
        }

        function findNextSubView(param) {
            var focusedCategory = param.focusedCategory;
            if (needShowPasswordView(focusedCategory)) {
                currentSubView = passwordView;
            } else {
                //@comment 복원할 뷰가 명확할 경우
                if(needRestoreTargetViewID(param.restoreTargetViewID)) {
                    findSubViewByRestoreTargetViewID(param.restoreTargetViewID);
                } else {
                    switch (focusedCategory.getViewerType()) {
                        case ViewerType.POPULARITY_CHART:
                            //currentSubView = popularityChartView;
                            currentSubView = dailyPopularityChartView;
                            break;
                        case ViewerType.PROMOTION_BANNER:
                            //currentSubView = promotionListView;
                            currentSubView = null;
                            break;
                        case ViewerType.RECOMMEND:
                            currentSubView = purchaseBasedRecommendationView;
                            break;
                        case ViewerType.SUBSCRIBER_RECOMMEND:
                        case ViewerType.BUNDLEPRODUCT_LIST:
                            currentSubView = subscriberBasedRecommendationView;
                            // currentSubView = bundleListView;
                            break;
                        case ViewerType.MD_RECOMMEND:
                            currentSubView = assetListView;
                            break;
                        case ViewerType.EVENT:
                            currentSubView = eventListView;
                            break;
                        case ViewerType.FINISHED_EVENT:
                            currentSubView = finishedEventListView;
                            break;
                        case ViewerType.POSTERLIST:
                        case ViewerType.CONTENTGROUP_LIST:
                        case ViewerType.DEFAULT:

                        default:
                            getDefaultSubView(focusedCategory);
                            break;
                    }
                }
            }
        }

        function findSubViewByRestoreTargetViewID(restoreTargetViewID) {
            switch (restoreTargetViewID) {
                case textListView.getID():
                    currentSubView = textListView;
                    break;
                case weeklyPopularityChartView.getID():
                    currentSubView = weeklyPopularityChartView;
                    break;
            }
        }

        function needRestoreTargetViewID(restoreTargetViewID) {
            var isNeed = false;
            if(restoreTargetViewID != null) {
                switch (restoreTargetViewID) {
                    case textListView.getID():
                    case weeklyPopularityChartView.getID():
                        isNeed = true;
                        break;
                }
            }
            return isNeed;
        }

        function getDefaultSubView(focusedCategory) {
            if(focusedCategory.getPresentationType() == "MODPage") {
                currentSubView = modView;
            } else if (focusedCategory.isLeafCategory()) {
                currentSubView = posterListView;
            } else {
                if(focusedCategory.getViewerType() == ViewerType.DEFAULT) {
                    currentSubView = previewListView;
                } else {
                    currentSubView = posterListView;
                }
            }
        }

        function needShowPasswordView(focusedCategory) {
            if (focusedCategory && focusedCategory.isAdultCategory()) {
                if(STBInfoManager.getAdultMenuSetting() == 0) {
                    return false;
                } else if(STBInfoManager.getAdultMenuSetting() == 1 && !CCAInfoManager.isAdultConfirm()) {
                    return true;
                } else {
                    //@ 아예 목록에서 필터링 되야함
                    return false;
                }
            }
        }

        function passwordViewChangeFocusListener(event, param) {
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

        function changeViewGroupListener(event, param) {
            _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
        }

        this.onInit();
    };
    MenuViewGroupManager.prototype = Object.create(ViewGroup.prototype);
//  MenuViewGroupManager.prototype = new ViewGroup();


    return MenuViewGroupManager;
});