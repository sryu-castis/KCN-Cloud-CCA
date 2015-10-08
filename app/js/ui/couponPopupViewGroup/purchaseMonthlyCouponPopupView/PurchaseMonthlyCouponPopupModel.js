define(["framework/Model", "framework/modules/ButtonGroup", "cca/model/CouponProduct"], function(Model, ButtonGroup, CouponProduct) {
	var PurchaseMonthlyCouponPopupModel = function() {
		Model.call(this);
		
		this.buttonGroup = null;
		this.inputField = null;
		this.callBackFunction = null;
		this.subSpanClass = null;
		this.subSpanText = null;
		this.param = null;
		
		PurchaseMonthlyCouponPopupModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.buttonGroup = null;
			this.inputField = null;
			this.callBackFunction = null;
			this.subSpanClass = null;
			this.subSpanText = null;
			this.param = null;
		};

		PurchaseMonthlyCouponPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		PurchaseMonthlyCouponPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		PurchaseMonthlyCouponPopupModel.prototype.setInputField = function(inputField) {
			this.inputField = inputField;
		};
		PurchaseMonthlyCouponPopupModel.prototype.getInputField = function() {
			return this.inputField;
		};
		PurchaseMonthlyCouponPopupModel.prototype.setSubSpanClass = function(subSpanClass) {
			this.subSpanClass = subSpanClass;
		};
		PurchaseMonthlyCouponPopupModel.prototype.getSubSpanClass = function() {
			return this.subSpanClass;
		};

		PurchaseMonthlyCouponPopupModel.prototype.setSubSpanText = function(subSpanText) {
			this.subSpanText = subSpanText;
		};
		PurchaseMonthlyCouponPopupModel.prototype.getSubSpanText = function() {
			return this.subSpanText;
		};
		PurchaseMonthlyCouponPopupModel.prototype.setCallBackFunction = function(callBackFunction) {
			this.callBackFunction = callBackFunction;
		};
		PurchaseMonthlyCouponPopupModel.prototype.getCallBackFunction = function() {
			return this.callBackFunction;
		};
		PurchaseMonthlyCouponPopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		PurchaseMonthlyCouponPopupModel.prototype.getParam = function() {
			return this.param;
		};
	};
	PurchaseMonthlyCouponPopupModel.prototype = Object.create(Model.prototype);
	
	return PurchaseMonthlyCouponPopupModel;
});
