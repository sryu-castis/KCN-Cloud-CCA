define(["framework/Drawer", "ui/mytvViewGroup/purchaseMonthlyCouponView/PurchaseMonthlyCouponModel", 
        "helper/UIHelper", 'helper/DrawerHelper'], function (Drawer, PurchaseMonthlyCouponModel, UIHelper, DrawerHelper) {
    var PurchaseMonthlyCouponDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/mytvViewGroup/purchaseMonthlyCouponView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        PurchaseMonthlyCouponDrawer.prototype.onCreateLayout = function () {
            var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
            this.setContainer(tempContainer);
        };

        PurchaseMonthlyCouponDrawer.prototype.onPaint = function () {
            var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
			//this.timerContainer = $('.bg_right .subViewArea');

        };
        PurchaseMonthlyCouponDrawer.prototype.onAfterPaint = function () {
        	if(this.active)  {
                if(_this.model.getVIndex() == 0) {// coupon
                    drawFocusForCoupon();
                    drawUnfocusForButton();
                }
                else    {
                    drawFocusForButton();
                    drawSelectForCoupon(); // 현재 css에 selected가 없음
                }
            }
            else     {
                drawUnfocusForCoupon(); // 사실 이건 없어도 되지만...
                drawUnfocusForButton();
            }
            
        };
        function getFocusIndexItem() {
            var focusIndex = _this.model.getHIndex();
            var listItems = _this.getContainer().find("#mytv .coupon2");
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
    PurchaseMonthlyCouponDrawer.prototype = Object.create(Drawer.prototype);


    return PurchaseMonthlyCouponDrawer;
});
