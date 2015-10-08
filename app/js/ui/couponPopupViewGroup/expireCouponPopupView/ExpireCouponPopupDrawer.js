define(["framework/Drawer", "ui/couponPopupViewGroup/baseUsedCouponPopupView/BaseUsedCouponPopupModel",  "helper/UIHelper"], function (Drawer, BaseUsedCouponPopupModel, UIHelper) {
    var ExpireCouponPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/couponPopupViewGroup/expireCouponPopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        ExpireCouponPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        ExpireCouponPopupDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
        };
        
        ExpireCouponPopupDrawer.prototype.onAfterPaint = function () {
        };
        
//        ExpireCouponPopupDrawer.prototype.onDestroy = function ()	{
//        	this.getContainer().hide();
//        }
    };
    ExpireCouponPopupDrawer.prototype = Object.create(Drawer.prototype);


    return ExpireCouponPopupDrawer;
});
