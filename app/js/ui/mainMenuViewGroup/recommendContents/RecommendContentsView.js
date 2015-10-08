define(["framework/View", "framework/event/CCAEvent", "cca/DefineView", "service/Communicator",
        "ui/mainMenuViewGroup/recommendContents/RecommendContentsModel", "ui/mainMenuViewGroup/recommendContents/RecommendContentsDrawer",
        "cca/type/JumpType", "cca/type/PromoWindowLinkType", "main/CSSHandler", "cca/type/PromoWindowType", 'cca/PopupValues', "service/CCAInfoManager",
        "helper/UIComponentHelper"
    ],
    function (View, CCAEvent, DefineView, Communicator, RecommendContentsModel, RecommendContentsDrawer, JumpType, PromoWindowLinkType, CSSHandler, PromoWindowType, PopupValues, CCAInfoManager, UIComponentHelper) {
        var RecommendContentsView = function (id) {

            View.call(this, id);
            this.model = null;
            this.drawer = null;

            var _this = this;
            var HORIZON_VISIBLE_LIST_COUNT = 5;

            RecommendContentsView.prototype.onInitialize = function () {
                this.model = new RecommendContentsModel();
                this.drawer = new RecommendContentsDrawer(this.getID(), this.model);
            };

            RecommendContentsView.prototype.onBeforeStart = function (param) {
                if(param.getUIComponentList != undefined ) {
                    this.model.setPromoWindow(param.getPromoWindow());
                    //this.model.setSelectedItemIndex(0);
                    initializeModel(param.getUIComponentList());
                }
            };

            RecommendContentsView.prototype.onAfterActive = function () {
                sendChangeFocus();
            };
            
            RecommendContentsView.prototype.onUpdate = function (param) {
                this.model.setSelectedItemIndex(param.selectedItemIndex);
                this.model.setPromoWindow(param.promoWindow);
                this.model.setHIndex(0);
                requestRecommendContent(param.externalMappingId);
            };

            RecommendContentsView.prototype.onKeyDown = function (event, param) {
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        sendChangeView(DefineView.SERVICE_MENU_VIEW);
                        break;
                    case tvKey.KEY_DOWN:
                        sendChangeView(DefineView.VOD_MENU_VIEW);
                        break;
                    case tvKey.KEY_LEFT:
                        if (isRecommendState()) {
                            if (isFirstContents()) {
                                if(_this.model.getPromoWindow()){
                                    setPromotionAreaFocus();
                                }else{
                                    setRecommendAreaFocus(_this.model.getHMax() - 1);
                                }
                            } else {
                                _this.keyNavigator.keyLeft();
                            }
                            _this.drawer.onRepaint();
                        } else if (isPromotionState()) {
                            setRecommendAreaFocus(_this.model.getHMax() - 1);
                            _this.drawer.onRepaint();
                        }
                        sendChangeFocus();
                        break;
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_ESC:
                    case tvKey.KEY_EXIT:
                        _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                        break;
                    case tvKey.KEY_RIGHT:
                        if (isRecommendState()) {
                            if (isLastContents()) {
                                if(_this.model.getPromoWindow()){
                                    setPromotionAreaFocus();
                                }else{
                                    setRecommendAreaFocus(0);
                                }
                            } else {
                                _this.keyNavigator.keyRight();
                            }
                            _this.drawer.onRepaint();
                        } else if (isPromotionState()) {
                            setRecommendAreaFocus(0);
                            _this.drawer.onRepaint();
                        }
                        sendChangeFocus();
                        break;
                    case tvKey.KEY_ENTER:
                    case tvKey.KEY_OK:
                        selectService();
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
                    case tvKey.KEY_G:
                    case tvKey.KEY_GREEN:
                        break;
                    default:
                        break;
                }
            };

            function initializeModel(UIComponentList) {
                var model = _this.model;

                var verticalVisibleSize = 1;
                var horizonVisibleSize = HORIZON_VISIBLE_LIST_COUNT;
                var verticalMaximumSize = verticalVisibleSize;
                var horizonMaximumSize = UIComponentList.length;

                model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                model.setRotate(false, true);
                model.setData(UIComponentList);
            }

            function requestRecommendContent(externalMappingId) {
                _this.transactionId = $.now() % 1000000;
                Communicator.requestUIComponentList(function (result) {
                    if (result.transactionId != _this.transactionId) {
                        console.error("Invalid transactionId.");
                        return;
                    }
                    if (Communicator.isSuccessResponseFromHAS(result) == true) {
                        initializeModel(result.uiComponentList);
                        _this.drawer.onUpdate();
                    } else {
                        console.error("Failed to get datas from has.", result);
                    }
                }, _this.transactionId, externalMappingId, 5);
            };

            function sendChangeView(targetView) {
                _this.sendEvent(CCAEvent.CHANGE_VIEW, targetView);
            }

            function sendChangeViewGroup(param) {
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            }

            function sendChangeFocus() {
                var model = _this.model;
                var param = {};
                param.recommendContentIndex = model.getHIndex();
                _this.sendEvent(CCAEvent.CHANGE_FOCUS_ON_VIEW, param);
            }

            function selectService() {
                if (!isPromotionState()) {
                    if(CCAInfoManager.hasTerminalKey()) {
                        requestContentGroupInfo();
                    } else {
                        changeToFailToRequestTerminalkey();
                    }
                } else {
                    selectServiceForPromotionState();
                }
            }

            function selectServiceForPromotionState() {
                var promoWindow = _this.model.getPromoWindow();
                var linkType = promoWindow.getLinkType();
                var type = promoWindow.getType();

                if (isApplicationLinkType(linkType)) {
                    CSSHandler.runThirdApp(promoWindow.getSourceId());
                } else if (isCloudAppLinkType(linkType)){
                    CSSHandler.runCSApp(promoWindow.getAppId());
                } else {
                    var param =  getParamForPromotionState(linkType, type);
                    sendChangeViewGroup(param);
                }
            }

            function getParamForPromotionState(linkType, type) {
                var param;
                switch (linkType) {
                    case PromoWindowLinkType.VOD_DETAIL:
                        param = getParamByPromotionLinkType(linkType);
                        param.targetViewGroup = DefineView.DETAIL_VIEWGROUP_MANAGER;
                        param.targetView = DefineView.DETAIL_VIEW;
                        break;
                    case PromoWindowLinkType.VOD_LIST:
                        param = getParamByPromotionLinkType(linkType);
                        param.targetViewGroup = DefineView.LIST_VIEW_GROUP;
                        break;
                    case PromoWindowLinkType.POPUP:
                        param = getParamByPromotionType(type);
                        param.targetViewGroup = DefineView.PROMOTION_BANNER_POPUP_VIEWGROUP_MANAGER;
                        param.promoWindow = _this.model.getPromoWindow();
                        break;
                }
                return param;
            }

            function getParamByPromotionLinkType(linkType) {
                var param = {};
                if ( !isPopupLinkType(linkType) ) {
                    param.uiComponentID = UIComponentHelper.getUIComponentId(UIComponentHelper.CALLER_ID_CLOUD_PROMOTION_WINDOW);
                    param.uiDomainID= UIComponentHelper.UIDomainID.MAIN_MENU;
                    param.assetID = _this.model.getPromoWindow().getAssetId();
                }
                return param;
            }

            function getParamByPromotionType(type) {
                var param = {};
                if ( isTwoPosterType(type) || isThreePosterType(type) ){
                    param.targetView = DefineView.PROMOTION_POSTER_POPUP_VIEW;
                } else if( isPromoImageType(type) || isPromoTextType(type) ) {
                    param.targetView = DefineView.PROMOTION_FULL_POPUP_VIEW;
                }
                return param;
            }

            function isCloudAppLinkType(linkType) {
                return PromoWindowLinkType.CLOUD_APP == linkType;
            }

            function isApplicationLinkType(linkType) {
                return PromoWindowLinkType.APPLICATION == linkType;
            }

            function isPopupLinkType(linkType) {
                return PromoWindowLinkType.POPUP == linkType;
            }

            function isPromoImageType(type) {
                return PromoWindowType.PROMO_IMAGE == type;
            }

            function isPromoTextType(type) {
                return PromoWindowType.PROMO_TEXT == type;
            }

            function isTwoPosterType(type) {
                 return PromoWindowType.TWO_POSTER == type ;
            }

            function isThreePosterType(type) {
                return PromoWindowType.THREE_POSTER == type;
            }

            function requestContentGroupInfo() {
                var focusedItem = _this.model.getHFocusedItem();
                var contentGroupID = focusedItem.getUIComponentId();
                var contentGroupProfile = 2;
                Communicator.requestContentGroupInfo(callBackForRequestContentGroupInfo, contentGroupProfile, contentGroupID);
            }

            function callBackForRequestContentGroupInfo (response) {
                if(Communicator.isSuccessResponseFromHAS(response)) {
                    var focusedItem = _this.model.getHFocusedItem();
                    var param = {
                        targetViewGroup: DefineView.DETAIL_VIEWGROUP_MANAGER,
                        targetView: getTargetView(response.contentGroup),
                        uiComponentID: getUIComponentID(),
                        uiDomainID: UIComponentHelper.UIDomainID.MAIN_MENU,
                        contentGroupID: focusedItem.getUIComponentId()
                    };
                    sendChangeViewGroup(param);
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetViewGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:response.resultCode});
                }
            }

            function getUIComponentID() {
                return UIComponentHelper.getUIComponentId(UIComponentHelper.CALLER_ID_CLOUD_RECOMMENT_CONTENT) + _this.model.getSelectedItemIndex() + 1;
            }

            function changeToFailToRequestTerminalkey() {
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetViewGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:CCAInfoManager.getTerminalKeyResultCode()});
            }

            function getTargetView(contentGroup) {
                if(contentGroup.isEpisodePeerContent()) {
                    return DefineView.EPISODE_PEER_LIST_VIEW;
                } else {
                    return DefineView.DETAIL_VIEW;
                }

            }

            function isFirstContents() {
                var hIndex = _this.model.getHIndex();

                return hIndex == 0;
            }

            function isLastContents() {
                var hIndex = _this.model.getHIndex();
                var hMax = _this.model.getHMax();

                return hIndex == hMax - 1;
            }

            function setRecommendAreaFocus(hIndex) {
                _this.model.setHIndex(hIndex);
            }

            function setPromotionAreaFocus() {
                _this.model.setHIndex(_this.model.getHMax());
            }

            function isRecommendState() {
                var hIndex = _this.model.getHIndex();
                var hMax = _this.model.getHMax();
                return hIndex >= 0 || hIndex < hMax - 1;
            }

            function isPromotionState() {
                return _this.model.getHIndex() == _this.model.getHMax();
            }

            this.onInitialize();
        };

        RecommendContentsView.prototype = Object.create(View.prototype);

        return RecommendContentsView;
    });