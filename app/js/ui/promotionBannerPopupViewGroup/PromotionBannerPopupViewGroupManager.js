define([ "framework/ViewGroup", "framework/event/CCAEvent", "cca/DefineView", "main/CSSHandler",
        "ui/promotionBannerPopupViewGroup/promotionFullPopupView/PromotionFullPopupView",
        "ui/promotionBannerPopupViewGroup/promotionPosterPopupView/PromotionPosterPopupView"
    ],

    function(ViewGroup, CCAEvent, DefineView, CSSHandler, PromotionFullPopupView, PromotionPosterPopupView) {

        var PromotionBannerPopupViewGroupManager = function(id) {
            ViewGroup.call(this, id);
            var currentView = null;
            var promotionFullPopupView = null;
            var promotionPosterPopupView = null;

            var _this = this;

            PromotionBannerPopupViewGroupManager.prototype.onInitialize = function() {
                promotionFullPopupView = new PromotionFullPopupView(DefineView.PROMOTION_FULL_POPUP_VIEW);
                promotionPosterPopupView = new PromotionPosterPopupView(DefineView.PROMOTION_POSTER_POPUP_VIEW);
                addEventListener();
            };

            PromotionBannerPopupViewGroupManager.prototype.onStart = function(param) {
                getTargetView(param);
                addCompleteToDrawEventListener();
                startViewGroup(param);
            };

            PromotionBannerPopupViewGroupManager.prototype.onStop = function() {
                currentView.onStop();
            };

            PromotionBannerPopupViewGroupManager.prototype.onHide = function() {
                currentView.onHide();
            };

            PromotionBannerPopupViewGroupManager.prototype.onShow = function() {
                currentView.onShow();
                sendCompleteDrawEvent();
            };

            PromotionBannerPopupViewGroupManager.prototype.onUpdate = function() {

            };

            PromotionBannerPopupViewGroupManager.prototype.onResume = function (param) {
                if (currentView) {
                    currentView.onActive();
                }
            };

            function startViewGroup(param) {
                currentView.onStart(param);
                currentView.onActive();
            }

            function getTargetView(param) {
                var targetView = param ? param.targetView : "";
                switch (targetView) {
                    case DefineView.PROMOTION_FULL_POPUP_VIEW:
                        currentView = promotionFullPopupView;
                        break;
                    case DefineView.PROMOTION_POSTER_POPUP_VIEW:
                        currentView = promotionPosterPopupView;
                        break;
                    default :
                        currentView = promotionPosterPopupView;
                        break;
                }
            }

            function removeEventListener() {
                $(promotionFullPopupView).unbind();
                $(promotionPosterPopupView).unbind();
            }

            function addEventListener() {
                removeEventListener();
                $(promotionFullPopupView).bind(CCAEvent.FINISH_VIEWGROUP, promotionBannerPopupFinishViewGroupListener);
                $(promotionFullPopupView).bind(CCAEvent.CHANGE_VIEWGROUP, promotionFullPopupChangeViewGroupListener);

                $(promotionPosterPopupView).bind(CCAEvent.FINISH_VIEWGROUP, promotionBannerPopupFinishViewGroupListener);
                $(promotionPosterPopupView).bind(CCAEvent.CHANGE_VIEWGROUP, promotionFullPopupChangeViewGroupListener);
            }

            function addCompleteToDrawEventListener() {
                $(promotionFullPopupView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
                $(promotionPosterPopupView).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
            }

            function sendCompleteDrawEvent() {
                _this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
            }

            function promotionBannerPopupFinishViewGroupListener(event, param) {
                _this.sendEvent(CCAEvent.FINISH_VIEWGROUP, param);
            }

            function promotionFullPopupChangeViewGroupListener(event, param) {
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
            }

            this.onInitialize();
        };
        PromotionBannerPopupViewGroupManager.prototype = Object.create(ViewGroup.prototype);

        return PromotionBannerPopupViewGroupManager;
    });