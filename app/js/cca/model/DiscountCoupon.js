define(function() {
	var DiscountCoupon = function(jsonObject) {
		this.jsonObject = jsonObject;
	};
	 
	DiscountCoupon.prototype.getCouponClassName = function(){
		return this.jsonObject.couponClassName;
	};
	DiscountCoupon.prototype.getCouponId = function() {
		return this.jsonObject.couponId;
	};
	DiscountCoupon.prototype.getCouponName = function() {
		return this.jsonObject.couponName;
	};
	DiscountCoupon.prototype.getDiscountAmount = function() {
		return this.jsonObject.discountAmount;
	};
	DiscountCoupon.prototype.getDiscountCouponState = function() {
		return this.jsonObject.discountCouponState;
	};
	DiscountCoupon.prototype.getDiscountRate = function() {
		return this.jsonObject.discountRate;
	};
	DiscountCoupon.prototype.getDiscountType = function() {
		return this.jsonObject.discountType;
	};
	DiscountCoupon.prototype.getExpirationTime = function() {
		return this.jsonObject.expirationTime;
	};
	DiscountCoupon.prototype.getIssueTime = function() {
		return this.jsonObject.issueTime;
	};
	DiscountCoupon.prototype.getStartTime = function() {
		return this.jsonObject.startTime;
	};
	DiscountCoupon.prototype.getDiscountCouponMasterId = function() {
		return this.jsonObject.discountCouponMasterId;
	}
	DiscountCoupon.prototype.getPopupValue = function() {
		return this.jsonObject.popupValue;
	}


	return DiscountCoupon;
});