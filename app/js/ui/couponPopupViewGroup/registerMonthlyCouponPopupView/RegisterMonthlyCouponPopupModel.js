define(["ui/purchaseViewGroup/selectProductView/SelectProductModel"], function(Model) {
	var RegisterMonthlyCouponPopupModel = function() {
		Model.call(this);
		
		this.subSpanClass = null;
		this.subText = null;
		this.couponName = null;
		this.chargeAmount = null;
		this.notice_1 = null;
		this.notice_2 = null;
		this.notice_3 = null;
		this.notice_4 = null;
		this.couponProductId= null;
		this.productCode = null;
		
		RegisterMonthlyCouponPopupModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.subSpanClass = null;
			this.subText = null;
			this.couponName = null;
			this.chargeAmount = null;
			this.notice_1 = null;
			this.notice_2 = null;
			this.notice_3 = null;
			this.notice_4 = null;
			this.couponProductId= null;
			this.productCode = null;
		};

		RegisterMonthlyCouponPopupModel.prototype.setSubSpanClass = function(subSpanClass) {
			this.subSpanClass = subSpanClass;
		};
		RegisterMonthlyCouponPopupModel.prototype.getSubSpanClass = function() {
			return this.subSpanClass;
		};
		RegisterMonthlyCouponPopupModel.prototype.setSubText = function(subText) {
			this.subText = subText;
		};
		RegisterMonthlyCouponPopupModel.prototype.getSubText = function() {
			return this.subText;
		};
		RegisterMonthlyCouponPopupModel.prototype.setChargeAmount = function(chargeAmount) {
			this.chargeAmount = chargeAmount;
		};
		RegisterMonthlyCouponPopupModel.prototype.getChargeAmount = function() {
			return this.chargeAmount;
		};
		RegisterMonthlyCouponPopupModel.prototype.setNotice1 = function(notice_1) {
			this.notice_1 = notice_1;
		};
		RegisterMonthlyCouponPopupModel.prototype.getNotice1 = function() {
			return this.notice_1;
		};
		RegisterMonthlyCouponPopupModel.prototype.setNotice2 = function(notice_2) {
			this.notice_2 = notice_2;
		};
		RegisterMonthlyCouponPopupModel.prototype.getNotice2 = function() {
			return this.notice_2;
		};
		RegisterMonthlyCouponPopupModel.prototype.setNotice3 = function(notice_3) {
			this.notice_3 = notice_3;
		};
		RegisterMonthlyCouponPopupModel.prototype.getNotice3 = function() {
			return this.notice_3;
		};
		RegisterMonthlyCouponPopupModel.prototype.setNotice4 = function(notice_4) {
			this.notice_4 = notice_4;
		};
		RegisterMonthlyCouponPopupModel.prototype.getNotice4 = function() {
			return this.notice_4;
		};
		RegisterMonthlyCouponPopupModel.prototype.setCouponProductId = function(couponProductId) {
			this.couponProductId = couponProductId;
		};
		RegisterMonthlyCouponPopupModel.prototype.getCouponProductId = function() {
			return this.couponProductId;
		};
		RegisterMonthlyCouponPopupModel.prototype.setProductCode = function(productCode) {
			this.productCode = productCode;
		};
		RegisterMonthlyCouponPopupModel.prototype.getProductCode = function() {
			return this.productCode;
		};
	
	};
	RegisterMonthlyCouponPopupModel.prototype = Object.create(Model.prototype);
	
	return RegisterMonthlyCouponPopupModel;
});
