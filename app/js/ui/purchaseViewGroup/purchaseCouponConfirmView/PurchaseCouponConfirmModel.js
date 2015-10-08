define(["framework/Model", "framework/modules/ButtonGroup", "cca/model/CouponProduct"], function(Model, ButtonGroup, CouponProduct) {
	var PurchaseCouponConfirmModel = function() {
		Model.call(this);
		
		this.buttonGroup = null;
		this.inputField = null;
		this.subSpanClass = null;
		
		PurchaseCouponConfirmModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.buttonGroup = null;
			this.inputField = null;
			this.subSpanClass = null;
		};

		PurchaseCouponConfirmModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		PurchaseCouponConfirmModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		PurchaseCouponConfirmModel.prototype.setInputField = function(inputField) {
			this.inputField = inputField;
		};
		PurchaseCouponConfirmModel.prototype.getInputField = function() {
			return this.inputField;
		};
		PurchaseCouponConfirmModel.prototype.setSubSpanClass = function(subSpanClass) {
			this.subSpanClass = subSpanClass;
		};
		PurchaseCouponConfirmModel.prototype.getSubSpanClass = function() {
			return this.subSpanClass;
		};

	};
	PurchaseCouponConfirmModel.prototype = Object.create(Model.prototype);
	
	return PurchaseCouponConfirmModel;
});
