define(["framework/Drawer", "ui/couponPopupViewGroup/baseUsedCouponPopupView/BaseUsedCouponPopupModel", "helper/UIHelper"], function (Drawer, BaseUsedCouponPopupModel, UIHelper) {
    var RefundCouponPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/couponPopupViewGroup/refundCouponPopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        RefundCouponPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        RefundCouponPopupDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
        };
        
        RefundCouponPopupDrawer.prototype.onAfterPaint = function () {
        };
        
//        RefundCouponPopupDrawer.prototype.onDestroy = function ()	{
//        	this.getContainer().hide();
//        }
    };
    RefundCouponPopupDrawer.prototype = Object.create(Drawer.prototype);


    return RefundCouponPopupDrawer;
});
