define(["framework/Drawer", "ui/mytvViewGroup/usedCouponListView/UsedCouponListModel", 
        "helper/UIHelper", "helper/DateHelper", "helper/DrawerHelper"], function (Drawer, UsedCouponListModel, UIHelper, DateHelper, DrawerHelper) {
    var UsedCouponListDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/mytvViewGroup/usedCouponListView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        UsedCouponListDrawer.prototype.onCreateLayout = function () {
            var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
            this.setContainer(tempContainer);
        };

        UsedCouponListDrawer.prototype.onPaint = function () {
//            console.log(this.model);
            var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper, 'DateHelper':DateHelper});
			this.getContainer().html(result);
			//this.timerContainer = $('.bg_right .subViewArea');
        };
        UsedCouponListDrawer.prototype.onAfterPaint = function () {
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
            
            focusItem.find(".cen").addClass("focus1").removeClass("unfocus");
            focusItem.find(".left").addClass("focus1").removeClass("unfocus");
            focusItem.find(".right").addClass("focus2").removeClass("unfocus");

            _this.getContainer().find("#mytv .pagedown").removeClass("unfocus").addClass("focus");
        }

        function drawUnfocus()   {
        	getFocusIndexItem().find(".cen").addClass("unfocus").removeClass("focus1");
        	getFocusIndexItem().find(".left").addClass("unfocus").removeClass("focus1");
        	getFocusIndexItem().find(".right").addClass("unfocus").removeClass("focus2");

            _this.getContainer().find("#mytv .pagedown").addClass("unfocus").removeClass("focus");
        }


    };
    UsedCouponListDrawer.prototype = Object.create(Drawer.prototype);


    return UsedCouponListDrawer;
});
