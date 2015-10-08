define(["framework/Drawer", "ui/menuViewGroup/coinBalanceView/CoinBalanceModel", "helper/UIHelper", "service/CCAInfoManager", "service/STBInfoManager"],
	function (Drawer, CoinBalanceModel, UIHelper, CCAInfoManager, STBInfoManager) {
	var CoinBalanceViewDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
		this.templateList = {'layout': new EJS({url: 'js/ui/menuViewGroup/coinBalanceView/LayoutTemplate.ejs'})};

		var _this = this;
		CoinBalanceViewDrawer.prototype.onCreateLayout = function() {
			//this.setContainer($(".bg_right .area_coupon"));
			_this = this;
		};
		
		CoinBalanceViewDrawer.prototype.onPaint = function() {
			this.setContainer($(".area_coupon"));
			if(CCAInfoManager.isMobileUser() || (STBInfoManager.isB2B() && !CCAInfoManager.hasPaymentCoupon()) ) {
				this.getContainer().html('');
			} else {
				var result = this.templateList['layout'].render({model:this.model, 'UIHelper':UIHelper});
				this.getContainer().html(result);
			}
		};
		CoinBalanceViewDrawer.prototype.onAfterPaint = function() {
			
		};
    };

	CoinBalanceViewDrawer.prototype = Object.create(Drawer.prototype);
	
	return CoinBalanceViewDrawer;
});
