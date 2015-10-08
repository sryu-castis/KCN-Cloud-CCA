define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var PurchaseMonthlyCouponModel = function() {
		Model.call(this);
		this.buttonGroup = new ButtonGroup();

		PurchaseMonthlyCouponModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		PurchaseMonthlyCouponModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
	};
	PurchaseMonthlyCouponModel.prototype = Object.create(Model.prototype);
	
	return PurchaseMonthlyCouponModel;
});
