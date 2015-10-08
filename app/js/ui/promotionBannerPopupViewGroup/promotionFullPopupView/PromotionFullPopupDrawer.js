define(["framework/Drawer", "cca/type/PromoWindowType"], function (Drawer, PromoWindowType) {
    var PromotionFullPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);

        var layoutTemplate = new EJS({url: 'js/ui/promotionBannerPopupViewGroup/promotionFullPopupView/LayoutTemplate.ejs'});
        var fullImageTemplate = new EJS({url: 'js/ui/promotionBannerPopupViewGroup/promotionFullPopupView/FullImageTemplate.ejs'});
        var fullTextTemplate = new EJS({url: 'js/ui/promotionBannerPopupViewGroup/promotionFullPopupView/FullTextTemplate.ejs'});

        var _this = this;
        var scope = 0;
        var currentPage = 1;

        PromotionFullPopupDrawer.prototype.onCreateLayout = function () {
            layoutTemplate.update(this.getContainer()[0], {model: this.model});
            scope = 0;
            drawCommonArea();
        };

        PromotionFullPopupDrawer.prototype.onPaint = function () {
            setButtonElement();
        };

        PromotionFullPopupDrawer.prototype.onAfterPaint = function () {
            drawButton();
        };

        PromotionFullPopupDrawer.prototype.moveToUp = function () {
            var text = _this.getContainer().find($(".text"));

            if (scope > 0) {
                scope -= 117;
                currentPage -= 1;
                text.scrollTop(scope);
            } else {
                text.scrollTop(0);
                currentPage = 1;
            }
            drawScroll()
        };

        PromotionFullPopupDrawer.prototype.moveToDown = function () {
            var text = _this.getContainer().find($(".text"));
            var scrollAreaHeight = text[0].scrollHeight;

            var maximumCount = getMaximumScrollCount();
            var currentCount = Math.floor(Math.abs(scope / 117));
            var marginTop = currentCount / maximumCount * scrollAreaHeight;

            if (scrollAreaHeight > marginTop) {
                scope += 117;
                currentPage += 1;
                text.scrollTop(scope);
            }
            drawScroll();
        };

        function setButtonElement() {
            var buttonGroup = _this.model.getButtonGroup();
            var buttonElementList = $('#promotion .area_btn >');
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
            if (_this.isActive()) {
                buttonGroup.getFocusedButton().setFocus();
            }
        }

        function drawCommonArea() {
            var commonArea = _this.getContainer().find("#promotion .promotion_bg")[0];
            var promoWindow = _this.model.getData();
            if (PromoWindowType.PROMO_IMAGE == promoWindow.getType()) {
                fullImageTemplate.update(commonArea, {model: _this.model});
            } else if (PromoWindowType.PROMO_TEXT == promoWindow.getType()) {
                fullTextTemplate.update(commonArea, {model: _this.model});
                drawScroll();
            }
        }

        function drawScroll() {
            var scrollArea = _this.getContainer().find($('.scroll'));
            var scrollAreaHeight = parseInt(scrollArea.css('height'));
            var bar = _this.getContainer().find($('.bar'));

            var maximumCount = getMaximumScrollCount();
            var currentCount = Math.floor(Math.abs(scope / 117));

            var scrollHeight = scrollAreaHeight / (maximumCount + 1);
            var scrollPosition = scrollHeight * currentCount;

            bar.css("height", scrollHeight);

            if (currentCount > 0) {
                bar.css("marginTop", scrollPosition);
            } else {
                bar.css("marginTop", 0);
            }
            drawPageNumber();
        }

        function drawPageNumber() {
            var totalPage = getMaximumScrollCount() + 1;
            $('#promotion .promotion_bg .area_text .page .all').html(totalPage);
            $('#promotion .promotion_bg .area_text .page .now').html(currentPage);
        }

        function getMaximumScrollCount() {
            var textArea = _this.getContainer().find($('.text'));
            var targetItemHeight = parseInt(textArea.css("height"));
            var scrollAreaHeight = textArea[0].scrollHeight;

            var count = 0;

            while (scrollAreaHeight > targetItemHeight) {
                scrollAreaHeight -= 117;
                count++;
            }
            return count;
        }

    };
    PromotionFullPopupDrawer.prototype = Object.create(Drawer.prototype);

    return PromotionFullPopupDrawer;

});