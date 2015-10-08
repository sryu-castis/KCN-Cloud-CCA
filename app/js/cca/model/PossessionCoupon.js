define(function() {
	var PossessionCoupon = function(jsonObject) {
		this.jsonObject = jsonObject;
	};
	 
	PossessionCoupon.prototype.getBalanceAfterEvent = function(){
		return this.jsonObject.balanceAfterEvent;
	};
	PossessionCoupon.prototype.getContentPrice = function() {
		return this.jsonObject.contentPrice;
	};
	PossessionCoupon.prototype.getContentPurchased = function() {
		return this.jsonObject.contentPurchased;
	};
	PossessionCoupon.prototype.getContentVatFee = function() {
		return this.jsonObject.contentVatFee;
	};
	PossessionCoupon.prototype.getCouponAmountIssued = function() {
		return this.jsonObject.couponAmountIssued;
	};
	PossessionCoupon.prototype.getCouponBalance = function() {
		return this.jsonObject.couponBalance;
	};
	PossessionCoupon.prototype.getCouponExpirationDate = function() {
		return this.jsonObject.couponExpirationDate;
	};
	PossessionCoupon.prototype.getCouponName = function() {
		return this.jsonObject.couponName;
	};
	PossessionCoupon.prototype.getCouponPinNo = function() {
		return this.jsonObject.couponPinNo;
	};
	PossessionCoupon.prototype.getCouponValidDuration = function() {
		return this.jsonObject.couponValidDuration;
	};
	PossessionCoupon.prototype.getEventDate = function() {
		return this.jsonObject.eventDate;
	};
	PossessionCoupon.prototype.getEventMoney = function() {
		return this.jsonObject.eventMoney;
	};
	PossessionCoupon.prototype.getEventName = function() {
		return this.jsonObject.eventName;
	};
	PossessionCoupon.prototype.getEventType = function() {
		return this.jsonObject.eventType;
	};

	return PossessionCoupon;
});