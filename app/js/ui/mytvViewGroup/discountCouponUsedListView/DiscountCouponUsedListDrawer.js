define(["framework/Drawer", "ui/mytvViewGroup/discountCouponUsedListView/DiscountCouponUsedListModel",
        "helper/UIHelper", "helper/DateHelper", "helper/DrawerHelper"], function (Drawer, DiscountCouponUsedListModel, UIHelper, DateHelper, DrawerHelper) {
    var DiscountCouponUsedListDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/mytvViewGroup/discountCouponUsedListView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        DiscountCouponUsedListDrawer.prototype.onCreateLayout = function () {
            var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
            this.setContainer(tempContainer);
        };

        DiscountCouponUsedListDrawer.prototype.onPaint = function () {
            var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper, 'DateHelper':DateHelper});
			this.getContainer().html(result);
			//this.timerContainer = $('.bg_right .subViewArea');
			
        };
        DiscountCouponUsedListDrawer.prototype.onAfterPaint = function () {
        	if(this.active)  {
                drawFocus();
            }
            else     {
                drawUnfocus();
            }
            
        };
        function getFocusIndexItem() {
            var focusIndex = _this.model.getVIndex();
            var listItems = _this.getContainer().find("#mytv tbody tr");
            var focusItem = listItems.eq(focusIndex);
            return focusItem;
            
        };
        function drawFocus() {
        	var focusItem = getFocusIndexItem();
            focusItem.addClass("focus").removeClass("unfocus");

            _this.getContainer().find("#mytv .pagedown").addClass("focus").removeClass("unfocus");
        }

        function drawUnfocus()   {
        	getFocusIndexItem().addClass("unfocus").removeClass("focus");

            _this.getContainer().find("#mytv .pagedown").addClass("unfocus").removeClass("focus");
        }


    };
    DiscountCouponUsedListDrawer.prototype = Object.create(Drawer.prototype);


    return DiscountCouponUsedListDrawer;
});
