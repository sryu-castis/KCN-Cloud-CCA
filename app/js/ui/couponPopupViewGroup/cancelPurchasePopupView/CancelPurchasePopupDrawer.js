define(["framework/Drawer", "ui/couponPopupViewGroup/baseUsedCouponPopupView/BaseUsedCouponPopupModel", "helper/UIHelper"], function (Drawer, BaseUsedCouponPopupModel, UIHelper) {
    var CancelPurchasePopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/couponPopupViewGroup/cancelPurchasePopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        CancelPurchasePopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        CancelPurchasePopupDrawer.prototype.onPaint = function () {
            var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
        };
        
        CancelPurchasePopupDrawer.prototype.onAfterPaint = function () {
        };
        
//        CancelPurchasePopupDrawer.prototype.onDestroy = function ()	{
//        	this.getContainer().hide();
//        }
    };
    CancelPurchasePopupDrawer.prototype = Object.create(Drawer.prototype);


    return CancelPurchasePopupDrawer;
});
