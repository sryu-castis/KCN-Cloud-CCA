define(["framework/Model", "framework/modules/ButtonGroup", "cca/model/CouponProduct"], function(Model, ButtonGroup, CouponProduct) {
	var PurchaseCouponPopupModel = function() {
		Model.call(this);
		
		this.buttonGroup = null;
		this.inputField = null;
		this.subSpanClass = null;
		this.subSpanText = null;
		this.callBackFunction = null;
		this.param = null;
		
		PurchaseCouponPopupModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.buttonGroup = null;
			this.inputField = null;
			this.subSpanClass = null;
			this.subSpanText = null;
			this.callBackFunction = null;
			this.param = null;
		};

		PurchaseCouponPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		PurchaseCouponPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		PurchaseCouponPopupModel.prototype.setInputField = function(inputField) {
			this.inputField = inputField;
		};
		PurchaseCouponPopupModel.prototype.getInputField = function() {
			return this.inputField;
		};
		PurchaseCouponPopupModel.prototype.setSubSpanClass = function(subSpanClass) {
			this.subSpanClass = subSpanClass;
		};
		PurchaseCouponPopupModel.prototype.getSubSpanClass = function() {
			return this.subSpanClass;
		};

		PurchaseCouponPopupModel.prototype.setSubSpanText = function(subSpanText) {
			this.subSpanText = subSpanText;
		};
		PurchaseCouponPopupModel.prototype.getSubSpanText = function() {
			return this.subSpanText;
		};
		PurchaseCouponPopupModel.prototype.setCallBackFunction = function(callBackFunction) {
			this.callBackFunction = callBackFunction;
		};
		PurchaseCouponPopupModel.prototype.getCallBackFunction = function() {
			return this.callBackFunction;
		};
		PurchaseCouponPopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		PurchaseCouponPopupModel.prototype.getParam = function() {
			return this.param;
		};
	};
	PurchaseCouponPopupModel.prototype = Object.create(Model.prototype);
	
	return PurchaseCouponPopupModel;
});
