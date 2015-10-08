define(["framework/View", "framework/event/CCAEvent", "framework/modules/ButtonGroup",
        "ui/promotionBannerPopupViewGroup/promotionFullPopupView/PromotionFullPopupModel",
        "ui/promotionBannerPopupViewGroup/promotionFullPopupView/PromotionFullPopupDrawer",
        "cca/type/VisibleTimeType", "cca/type/PromoWindowType" , "main/CSSHandler", "cca/type/PromoWindowPosterLinkType",
        "cca/DefineView", "helper/UIComponentHelper"],

    function (View, CCAEvent, ButtonGroup, PromotionFullPopupModel, PromotionFullPopupDrawer, VisibleTimeType, PromoWindowType, CSSHandler,
              PromoWindowPosterLinkType, DefineView, UIComponentHelper) {

        var PromotionFullPopupView = function (id) {
            View.call(this, id);

            this.model = null;
            this.drawer = null;

            var _this = this;
            var StringSources = null;

            PromotionFullPopupView.prototype.onInitialize = function () {
                this.model = new PromotionFullPopupModel();
                this.drawer = new PromotionFullPopupDrawer(this.getID(), this.model);
                StringSources = window.CCABase.StringSources;
            };

            PromotionFullPopupView.prototype.onGetData = function (param) {
                initializeModel(param.promoWindow);
            };
            PromotionFullPopupView.prototype.onAfterStart = function() {
                _this.hideTimerContainer();
                _this.setVisibleTimer(VisibleTimeType.POSTER_TYPE);
            }
            PromotionFullPopupView.prototype.onKeyDown = function (event, param) {
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
                var buttonGroup = _this.model.getButtonGroup();

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        if (isFullTextPopup()) {
                            _this.drawer.moveToUp();
                        }
                        break;
                    case tvKey.KEY_DOWN:
                        if (isFullTextPopup()) {
                            _this.drawer.moveToDown();
                        }
                        break;
                    case tvKey.KEY_RIGHT:
                        buttonGroup.next();
                        _this.drawer.onUpdate();
                        break;
                    case tvKey.KEY_LEFT:
                        buttonGroup.previous();
                        _this.drawer.onUpdate();
                        break;
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_ESC:
                    case tvKey.KEY_EXIT:
                        sendFinishViewGroup();
                        break;
                    case tvKey.KEY_ENTER:
                    case tvKey.KEY_OK:
                        var buttonLabel = buttonGroup.getFocusedButton().getLabel();
                        switch (buttonLabel) {
                            case StringSources.ButtonLabel.LOOK_AROUND:
                                selectService();
                                break;
                            case StringSources.ButtonLabel.CANCEL:
                            case StringSources.ButtonLabel.CLOSE:
                                sendFinishViewGroup();
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

                var verticalVisibleSize = 1;
                var horizonVisibleSize = 1;
                var verticalMaximumSize = verticalVisibleSize;
                var horizonMaximumSize = horizonVisibleSize;

                model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                model.setRotate(false, false);
                model.setButtonGroup(getButtonGroup(promoWindow));
                model.setData(promoWindow);
            }

            function getButtonGroup(promoWindow) {
                var model = _this.model;
                var buttonGroup = null;
                if(PromoWindowType.PROMO_IMAGE == promoWindow.getType()){
                    buttonGroup = new ButtonGroup(2);
                    buttonGroup.getButton(0).setLabel(StringSources.ButtonLabel.LOOK_AROUND);
                    buttonGroup.getButton(1).setLabel(StringSources.ButtonLabel.CANCEL);
                }else{
                    buttonGroup = new ButtonGroup(1);
                    buttonGroup.getButton(0).setLabel(StringSources.ButtonLabel.CLOSE);
                }
                return buttonGroup;
            }

            function selectService() {

                var promoWindowPosterList = _this.model.getData().getPromoWindowPosterList();

                if(promoWindowPosterList.length > 0){
                    var promoWindowPoster = promoWindowPosterList[0];
                    switch (promoWindowPoster.getLinkType()) {
                        case PromoWindowPosterLinkType.VOD_DETAIL:
                            var param = {
                                targetViewGroup: DefineView.DETAIL_VIEWGROUP_MANAGER,
                                targetView: DefineView.DETAIL_VIEW,
                                uiComponentID: UIComponentHelper.getUIComponentId(UIComponentHelper.CALLER_ID_CLOUD_PROMOTION_WINDOW),
                                assetID : promoWindowPoster.getAssetId()
                            }
                            sendChangeViewGroup(param);
                            break;
                        case PromoWindowPosterLinkType.VOD_LIST:
                            var param = {
                                targetViewGroup: DefineView.LIST_VIEW_GROUP,
                                uiComponentID: UIComponentHelper.getUIComponentId(UIComponentHelper.CALLER_ID_CLOUD_PROMOTION_WINDOW),
                                assetID : promoWindowPoster.getAssetId()
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

            function sendChangeViewGroup(param) {
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            }

            function sendFinishViewGroup() {
                _this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
            }

            function isFullTextPopup() {
                var promoWindow = _this.model.getData();
                return PromoWindowType.PROMO_TEXT == promoWindow.getType();
            }

            this.onInitialize();
        };

        PromotionFullPopupView.prototype = Object.create(View.prototype);

        return PromotionFullPopupView;

    });