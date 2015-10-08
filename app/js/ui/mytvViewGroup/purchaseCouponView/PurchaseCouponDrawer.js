define(["framework/Drawer", "ui/mytvViewGroup/purchaseCouponView/PurchaseCouponModel",
        "helper/UIHelper", "helper/DrawerHelper"], function (Drawer, PurchaseCouponModel, UIHelper, DrawerHelper) {
    var PurchaseCouponDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/mytvViewGroup/purchaseCouponView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        PurchaseCouponDrawer.prototype.onCreateLayout = function () {
            var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
            this.setContainer(tempContainer);
        };

        PurchaseCouponDrawer.prototype.onPaint = function () {
            var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
			//this.timerContainer = $('.bg_right .subViewArea');
        };
        PurchaseCouponDrawer.prototype.onAfterPaint = function () {
        	if(this.active)  {
                if(_this.model.getVIndex() == 0) {// coupon
                    drawFocusForCoupon();
                    drawUnfocusForButton();
                }
                else    {
                    drawFocusForButton();
                    drawSelectForCoupon();
                }
            }
            else     {
                drawUnfocusForCoupon(); // 사실 이건 없어도 되지만...
                drawUnfocusForButton();
            }
            
        };
        function getFocusIndexItem() {
            var focusIndex = _this.model.getHIndex();
            var listItems = _this.getContainer().find("#mytv .coupon");
            var focusItem = listItems.eq(focusIndex);
            return focusItem;
            
        };
        function drawFocusForCoupon() {
        	var focusItem = getFocusIndexItem();
            focusItem.addClass("focus");
            focusItem.removeClass("unfocus").removeClass("selected");
        }
        function drawSelectForCoupon()	{
        	var focusItem = getFocusIndexItem();
            focusItem.addClass("selected");
            focusItem.removeClass("unfocus").removeClass("focus");
        }
        function drawUnfocusForCoupon()   {
        	var focusItem = getFocusIndexItem();
            focusItem.removeClass("focus").removeClass("selected");
            focusItem.addClass("unfocus");
        }

        function drawFocusForButton()   {
            var focusIndex =_this.model.getButtonGroup().getIndex();
            var listItems = _this.getContainer().find("#mytv .bt_147");
            var focusItem = listItems.eq(focusIndex);
            focusItem.addClass("focus");
        }

        function drawUnfocusForButton() {
            var focusIndex =_this.model.getButtonGroup().getIndex();
            var listItems = _this.getContainer().find("#mytv .bt_147");
            var focusItem = listItems.eq(focusIndex);
            focusItem.removeClass("focus");
        }

    };
    PurchaseCouponDrawer.prototype = Object.create(Drawer.prototype);


    return PurchaseCouponDrawer;
});
