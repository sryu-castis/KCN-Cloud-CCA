define(["ui/purchaseViewGroup/selectProductView/SelectProductModel"], function(Model) {
	var PurchaseProductConfirmModel = function() {
		Model.call(this);
		
		this.subSpanClass = null;
		this.subText = null;
		this.styleValues = null;
		this.paymentType = null;

		PurchaseProductConfirmModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.subSpanClass = null;
			this.subText = null;
			this.styleValues = null;
			this.paymentType = null;
		};

		PurchaseProductConfirmModel.prototype.setSubSpanClass = function(subSpanClass) {
			this.subSpanClass = subSpanClass;
		};
		PurchaseProductConfirmModel.prototype.getSubSpanClass = function() {
			return this.subSpanClass;
		};
		PurchaseProductConfirmModel.prototype.setSubText = function(subText) {
			this.subText = subText;
		};
		PurchaseProductConfirmModel.prototype.getSubText = function() {
			return this.subText;
		};
		PurchaseProductConfirmModel.prototype.setStyleValues = function(styleValues) {
			this.styleValues = styleValues;
		};
		PurchaseProductConfirmModel.prototype.getStyleValues = function() {
			return this.styleValues;
		};
		PurchaseProductConfirmModel.prototype.setPaymentType = function(paymentType) {
			this.paymentType = paymentType;
		};
		PurchaseProductConfirmModel.prototype.getPaymentType = function() {
			return this.paymentType;
		};
	
	};
	PurchaseProductConfirmModel.prototype = Object.create(Model.prototype);
	
	return PurchaseProductConfirmModel;
});
