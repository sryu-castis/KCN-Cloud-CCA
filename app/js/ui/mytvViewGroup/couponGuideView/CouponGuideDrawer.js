define(["framework/Drawer", "ui/mytvViewGroup/couponGuideView/CouponGuideModel", "helper/DrawerHelper"], function (Drawer, CouponGuideModel, DrawerHelper) {
    var CouponGuideDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/mytvViewGroup/couponGuideView/LayoutTemplate.ejs'})};
        var _this = this;

        CouponGuideDrawer.prototype.onCreateLayout = function () {
            DrawerHelper.cleanSubViewArea();
            var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
            this.setContainer(tempContainer);
        };

        CouponGuideDrawer.prototype.onPaint = function () {
            var result = _this.templateList['layout'].render({model: this.model});
            this.getContainer().html(result);
        };
        CouponGuideDrawer.prototype.onAfterPaint = function () {
        	if(this.active)  {
                drawFocus();
            }
            else     {
                drawUnfocus();
            }
            
        };
        function getFocusIndexItem() {
            var focusIndex = _this.model.getVIndex();
            var listItems = $("#mytv tbody tr");
            var focusItem = listItems.eq(focusIndex);
            return focusItem;
            
        };
        function drawFocus() {
        	var focusItem = getFocusIndexItem();
            focusItem.addClass("focus").removeClass("unfocus");
            
            $("#mytv .pagedown").addClass("focus").removeClass("unfocus");
        }

        function drawUnfocus()   {
        	getFocusIndexItem().addClass("unfocus").removeClass("focus");
        	
        	$("#mytv .pagedown").addClass("unfocus").removeClass("focus");
        }


    };
    CouponGuideDrawer.prototype = Object.create(Drawer.prototype);


    return CouponGuideDrawer;
});
