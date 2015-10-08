define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var PurchaseConponModel = function() {
		Model.call(this);
		this.buttonGroup = new ButtonGroup();

		PurchaseConponModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		PurchaseConponModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
	};
	PurchaseConponModel.prototype = Object.create(Model.prototype);
	
	return PurchaseConponModel;
});
