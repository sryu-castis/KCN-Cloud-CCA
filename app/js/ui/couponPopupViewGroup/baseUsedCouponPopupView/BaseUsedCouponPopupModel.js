define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var BaseUsedCouponPopupModel = function() {
		Model.call(this);
		
		this.buttonGroup = null;
		this.possessionCoupon = null;
		this.discountCoupon = null;
		
		BaseUsedCouponPopupModel.prototype.init = function() {
//			console.log("BaseUsedCouponPopupModel.prototype.init");
			Model.prototype.init.apply(this);
			this.buttonGroup = null;
			this.possessionCoupon = null;
			this.discountCoupon = null;
		};

		BaseUsedCouponPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		BaseUsedCouponPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		
		BaseUsedCouponPopupModel.prototype.setPossessionCoupon = function(possessionCoupon) {
			this.possessionCoupon = possessionCoupon;
		};
		BaseUsedCouponPopupModel.prototype.getPossessionCoupon = function() {
			return this.possessionCoupon;
		};
		BaseUsedCouponPopupModel.prototype.setDiscountCoupon = function(discountCoupon) {
			this.discountCoupon = discountCoupon;
		};
		BaseUsedCouponPopupModel.prototype.getDiscountCoupon = function() {
			return this.discountCoupon;
		};
		
	};
	BaseUsedCouponPopupModel.prototype = Object.create(Model.prototype);
	
	return BaseUsedCouponPopupModel;
});
