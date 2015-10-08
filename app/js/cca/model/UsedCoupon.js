define(function() {
	var UsedCoupon = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	UsedCoupon.prototype.getCouponID = function(){
		return this.jsonObject.couponId;
	};

	return UsedCoupon;
});