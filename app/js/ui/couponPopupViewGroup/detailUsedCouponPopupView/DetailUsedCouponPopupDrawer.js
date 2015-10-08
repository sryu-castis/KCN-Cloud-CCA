define(["framework/Drawer", "ui/couponPopupViewGroup/baseUsedCouponPopupView/BaseUsedCouponPopupModel", "helper/UIHelper", "service/STBInfoManager"],
    function (Drawer, BaseUsedCouponPopupModel, UIHelper, STBInfoManager) {
    var DetailUsedCouponPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/couponPopupViewGroup/detailUsedCouponPopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        DetailUsedCouponPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        DetailUsedCouponPopupDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper, 'STBInfoManager':STBInfoManager});
			this.getContainer().html(result);
        };
        
        DetailUsedCouponPopupDrawer.prototype.onAfterPaint = function () {
        };
        
//		DetailUsedCouponPopupDrawer.prototype.onDestroy = function ()	{
//        	this.getContainer().hide();
//        }
    };
    DetailUsedCouponPopupDrawer.prototype = Object.create(Drawer.prototype);


    return DetailUsedCouponPopupDrawer;
});
