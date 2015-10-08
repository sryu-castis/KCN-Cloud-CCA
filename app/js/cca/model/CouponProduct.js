define(function() {
	var CouponProduct = function(jsonObject) {
		this.jsonObject = jsonObject;
	};
	 
	CouponProduct.prototype.getChargeAmount = function(){
		return this.jsonObject.chargeAmount;
	};
	CouponProduct.prototype.getCouponProductDescription = function() {
		return this.jsonObject.couponProductDescription;
	};
	CouponProduct.prototype.getCouponProductId = function() {
		return this.jsonObject.couponProductId;
	};
	CouponProduct.prototype.getCouponProductName = function() {
		return this.jsonObject.couponProductName;
	};
	CouponProduct.prototype.getCouponProductPrice = function() {
		return this.jsonObject.couponProductPrice;
	};
	CouponProduct.prototype.getDiscountRate = function() {
		return this.jsonObject.discountRate;
	};
	CouponProduct.prototype.getExpirationInfo = function() {
		return this.jsonObject.expirationInfo;
	};
	CouponProduct.prototype.getImageFileUrl = function() {
		return this.jsonObject.imageFileUrl;
	};
	CouponProduct.prototype.getSubscribed = function() {
		return this.jsonObject.subscribed;
	};
	CouponProduct.prototype.isSubscribed = function() {
		return this.jsonObject.subscribed == 1;
	};
	
	return CouponProduct;
});