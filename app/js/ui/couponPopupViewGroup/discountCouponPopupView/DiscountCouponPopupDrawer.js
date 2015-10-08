define(["framework/Drawer", "ui/couponPopupViewGroup/baseUsedCouponPopupView/BaseUsedCouponPopupModel",  "helper/UIHelper"], function (Drawer, BaseUsedCouponPopupModel, UIHelper) {
    var DiscountCouponPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/couponPopupViewGroup/discountCouponPopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        DiscountCouponPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        DiscountCouponPopupDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
        };
        
        DiscountCouponPopupDrawer.prototype.onAfterPaint = function () {
        };
        
//        DiscountCouponPopupDrawer.prototype.onDestroy = function ()	{
//        	this.getContainer().hide();
//        }
    };
    DiscountCouponPopupDrawer.prototype = Object.create(Drawer.prototype);


    return DiscountCouponPopupDrawer;
});
