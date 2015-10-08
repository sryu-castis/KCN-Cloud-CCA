define(["framework/Model", "framework/modules/ButtonGroup", "cca/model/CouponProduct"], function(Model, ButtonGroup, CouponProduct) {
	var PurchaseMonthlyCouponConfirmModel = function() {
		Model.call(this);
		
		this.buttonGroup = null;
		this.inputField = null;
		this.subSpanClass = null;
		
		PurchaseMonthlyCouponConfirmModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.buttonGroup = null;
			this.inputField = null;
			this.subSpanClass = null;
		};

		PurchaseMonthlyCouponConfirmModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		PurchaseMonthlyCouponConfirmModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		PurchaseMonthlyCouponConfirmModel.prototype.setInputField = function(inputField) {
			this.inputField = inputField;
		};
		PurchaseMonthlyCouponConfirmModel.prototype.getInputField = function() {
			return this.inputField;
		};
		PurchaseMonthlyCouponConfirmModel.prototype.setSubSpanClass = function(subSpanClass) {
			this.subSpanClass = subSpanClass;
		};
		PurchaseMonthlyCouponConfirmModel.prototype.getSubSpanClass = function() {
			return this.subSpanClass;
		};
	};
	PurchaseMonthlyCouponConfirmModel.prototype = Object.create(Model.prototype);
	
	return PurchaseMonthlyCouponConfirmModel;
});
