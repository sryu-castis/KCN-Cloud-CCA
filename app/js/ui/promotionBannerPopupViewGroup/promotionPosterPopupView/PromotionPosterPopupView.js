define(["framework/View", "framework/event/CCAEvent", "framework/modules/ButtonGroup",
        "ui/promotionBannerPopupViewGroup/promotionPosterPopupView/PromotionPosterPopupModel",
        "ui/promotionBannerPopupViewGroup/promotionPosterPopupView/PromotionPosterPopupDrawer",
        "cca/type/VisibleTimeType", "main/CSSHandler", "cca/type/PromoWindowPosterLinkType",
        "cca/DefineView", "helper/UIComponentHelper"],
    function (View, CCAEvent, ButtonGroup, PromotionPosterPopupModel, PromotionPosterPopupDrawer, VisibleTimeType, CSSHandler ,PromoWindowPosterLinkType,
            DefineView, UIComponentHelper) {

        var PromotionPosterPopupView = function (id) {
            View.call(this, id);

            this.model = null;
            this.drawer = null;

            var _this = this;
            var StringSources = null;

            PromotionPosterPopupView.prototype.onInitialize = function () {
                this.model = new PromotionPosterPopupModel();
                this.drawer = new PromotionPosterPopupDrawer(this.getID(), this.model);
                StringSources = window.CCABase.StringSources;
            };

            PromotionPosterPopupView.prototype.onGetData = function (param) {
                initializeModel(param.promoWindow);
            };
            PromotionPosterPopupView.prototype.onAfterStart = function() {
                _this.hideTimerContainer();
                _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
            }
            PromotionPosterPopupView.prototype.onKeyDown = function (event, param) {
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
                var buttonGroup = _this.model.getButtonGroup();

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        if (isButtonGroupState()) {
                            _this.model.setVIndex(PromotionPosterPopupDrawer.STATE_POSTER_LIST);
                            _this.drawer.onUpdate();
                        }
                        break;
                    case tvKey.KEY_DOWN:
                        if (isPosterListState()) {
                            _this.model.setVIndex(PromotionPosterPopupDrawer.STATE_BUTTON_GROUP);
                            _this.drawer.onUpdate();
                        }
                        break;
                    case tvKey.KEY_RIGHT:
                        if (isPosterListState()) {
                            _this.keyNavigator.keyRight();
                            _this.drawer.onUpdate();
                        } else if (isButtonGroupState()) {
                            buttonGroup.next();
                            _this.drawer.onUpdate();
                        }
                        break;
                    case tvKey.KEY_LEFT:
                        if (isPosterListState()) {
                            _this.keyNavigator.keyLeft();
                            _this.drawer.onUpdate();
                        } else if (isButtonGroupState()) {
                            buttonGroup.previous();
                            _this.drawer.onUpdate();
                        }
                        break;
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_ESC:
                    case tvKey.KEY_EXIT:
                        sendFinishViewGroup();
                        break;
                    case tvKey.KEY_ENTER:
                    case tvKey.KEY_OK:
                        var buttonLabel = buttonGroup.getFocusedButton().getLabel();
                        if(isButtonGroupState()){
                            sendFinishViewGroup();
                            break;
                        }else{
                            selectService();
                            break;
                        }
                        break;
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
                    default:
                        break;
                }
            };

            function initializeModel(promoWindow) {
                var model = _this.model;

                var verticalVisibleSize = 2;
                var horizonVisibleSize = promoWindow.getPromoWindowPosterList().length;
                var verticalMaximumSize = verticalVisibleSize;
                var horizonMaximumSize = horizonVisibleSize;

                model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                model.setRotate(false, true);
                model.setButtonGroup(getButtonGroup());
                model.setVIndex(PromotionPosterPopupDrawer.STATE_POSTER_LIST);
                model.setData(promoWindow);
            }

            function getButtonGroup() {
                var buttonGroup = new ButtonGroup(1);
                buttonGroup.getButton(0).setLabel(StringSources.ButtonLabel.CLOSE);

                return buttonGroup;
            }

            function selectService() {
                var focusedItem = _this.model.getHFocusedItem();

                var promoWindowPosterList = focusedItem.getPromoWindowPosterList();
                if(promoWindowPosterList.length > 0){

                    var promoWindowPoster = promoWindowPosterList[_this.model.getHFocusIndex()];
                    switch (promoWindowPoster.getLinkType()) {
                        case PromoWindowPosterLinkType.VOD_DETAIL:
                            var param = {
                                targetViewGroup: DefineView.DETAIL_VIEWGROUP_MANAGER,
                                targetView: DefineView.DETAIL_VIEW,
                                uiComponentID: UIComponentHelper.getUIComponentId(UIComponentHelper.CALLER_ID_CLOUD_PROMOTION_WINDOW),
                                assetID: promoWindowPoster.getAssetId()
                            }
                            sendChangeViewGroup(param);
                            break;
                        case PromoWindowPosterLinkType.VOD_LIST:
                            var param = {
                                targetViewGroup: DefineView.LIST_VIEW_GROUP,
                                uiComponentID: UIComponentHelper.getUIComponentId(UIComponentHelper.CALLER_ID_CLOUD_PROMOTION_WINDOW),
                                assetID: promoWindowPoster.getAssetId()
                            }
                            sendChangeViewGroup(param);
                            break;
                        case PromoWindowPosterLinkType.APPLICATION:
                            CSSHandler.runThirdApp(promoWindowPoster.getSourceId());
                            break;
                        case PromoWindowPosterLinkType.CLOUD_APP:
                            CSSHandler.runCSApp(promoWindowPoster.getAppId());
                            break;
                    }
                }



            }

            function isPosterListState() {
                return _this.model.getVIndex() == PromotionPosterPopupView.STATE_POSTER_LIST;
            }

            function isButtonGroupState() {
                return _this.model.getVIndex() == PromotionPosterPopupView.STATE_BUTTON_GROUP;
            }

            function sendChangeViewGroup(param) {
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            }

            function sendFinishViewGroup() {
                _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
            }

            this.onInitialize();
        };

        PromotionPosterPopupView.prototype = Object.create(View.prototype);

        PromotionPosterPopupView.STATE_POSTER_LIST = PromotionPosterPopupDrawer.STATE_POSTER_LIST;
        PromotionPosterPopupView.STATE_BUTTON_GROUP = PromotionPosterPopupDrawer.STATE_BUTTON_GROUP;
        return PromotionPosterPopupView;

    });