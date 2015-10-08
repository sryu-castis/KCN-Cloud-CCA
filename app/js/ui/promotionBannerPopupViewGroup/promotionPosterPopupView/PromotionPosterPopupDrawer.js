define(["framework/Drawer", "cca/type/PromoWindowType"], function (Drawer, PromoWindowType) {
    var PromotionPosterPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);

        var layoutTemplate = new EJS({url: 'js/ui/promotionBannerPopupViewGroup/promotionFullPopupView/LayoutTemplate.ejs'});
        var threePosterTemplate = new EJS({url: 'js/ui/promotionBannerPopupViewGroup/promotionPosterPopupView/ThreePosterTemplate.ejs'});
        var twoPosterTemplate = new EJS({url: 'js/ui/promotionBannerPopupViewGroup/promotionPosterPopupView/TwoPosterTemplate.ejs'});

        var _this = this;

        PromotionPosterPopupDrawer.prototype.onCreateLayout = function () {
            layoutTemplate.update(this.getContainer()[0], {model: this.model});
            setButtonElement();
        };

        PromotionPosterPopupDrawer.prototype.onPaint = function () {
            drawPromotionArea();
        };

        PromotionPosterPopupDrawer.prototype.onAfterPaint = function () {
            drawPosterFocus();
            drawButton();
            drawPromotionText();
        };

        function drawPromotionArea() {
            var promoWindow = _this.model.getData();
            var promotionArea = _this.getContainer().find('#promotion .promotion_bg')[0];
            if (PromoWindowType.TWO_POSTER == promoWindow.getType()) {
                twoPosterTemplate.update(promotionArea, {model: _this.model});
            } else if (PromoWindowType.THREE_POSTER == promoWindow.getType()) {
                threePosterTemplate.update(promotionArea, {model: _this.model});
            }
        }

        function setButtonElement() {
            var buttonGroup = _this.model.getButtonGroup();
            var buttonElementList = _this.getContainer().find('#promotion .area_btn >');
            var size = buttonGroup.getSize();
            for (var i = 0; i < size; i++) {
                buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
            }
        }

        function drawButton() {
            var buttonGroup = _this.model.getButtonGroup();
            for (var i = 0; i < buttonGroup.getSize(); i++) {
                if (buttonGroup.getButton(i).isActive()) {
                    buttonGroup.getButton(i).onActive();
                } else {
                    buttonGroup.getButton(i).onDeActive();
                }
                buttonGroup.getButton(i).setUnFocus();
            }
            if (_this.isActive() && !isPosterListState()) {
                buttonGroup.getFocusedButton().setFocus();
            }
        }

        function drawPosterFocus() {
            var model = _this.model;
            var index = model.getHIndex();

            var currentContent = _this.getContainer().find('.poster').eq(index);

            if (_this.isActive() && isPosterListState()) {
                currentContent.addClass('focus');
            } else {
                currentContent.addClass('unfocus');
            }
        }

        function isPosterListState() {
            return _this.model.getVIndex() == PromotionPosterPopupDrawer.STATE_POSTER_LIST;
        }

        function drawPromotionText() {
            var model = _this.model;
            var promoWindow = _this.model.getData();
            if(model.getData().getPromoWindowPosterList() != null && model.getData().getPromoWindowPosterList().length > 0) {
                var currentText = null;
                var index = model.getHIndex();

                if (PromoWindowType.TWO_POSTER == promoWindow.getType()) {
                    currentText = (_this.getContainer().find('.area_text2 .text'));
                } else if (PromoWindowType.THREE_POSTER == promoWindow.getType()) {
                    currentText = (_this.getContainer().find('.area_text3 .text'));
                }
                currentText.text(model.getData().getPromoWindowPosterList()[index].getDesc());
            }

        }
    };
    PromotionPosterPopupDrawer.prototype = Object.create(Drawer.prototype);

    PromotionPosterPopupDrawer.STATE_POSTER_LIST = 0;
    PromotionPosterPopupDrawer.STATE_BUTTON_GROUP = 1;

    return PromotionPosterPopupDrawer;
});