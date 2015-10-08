define(function() {
	var PurchaseLog = function(jsonObject) {
		this.jsonObject = jsonObject;
	};
	 
	PurchaseLog.prototype.getPurchasedID = function(){
		return this.jsonObject.purchasedId;
	};
	PurchaseLog.prototype.getPurchasedTime = function(){
		return this.jsonObject.purchasedTime;
	};
	PurchaseLog.prototype.getAssetID = function(){
		return this.jsonObject.assetId;
	};
	PurchaseLog.prototype.getAssetTitle = function(){
		return this.jsonObject.assetTitle;
	};
	PurchaseLog.prototype.getProductName = function(){
		return this.jsonObject.productName;
	};
	PurchaseLog.prototype.getLicenseEnd = function(){
		return this.jsonObject.licenseEnd;
	};
	PurchaseLog.prototype.getPaymentType = function(){
		return this.jsonObject.paymentType;
	};
	PurchaseLog.prototype.getViewablePeriodState = function(){
		return this.jsonObject.viewablePeriodState;
	};
	PurchaseLog.prototype.getProductType = function(){
		return this.jsonObject.productType;
	};
	PurchaseLog.prototype.getViewablePeriod = function(){
		return this.jsonObject.viewablePeriod;
	};
	PurchaseLog.prototype.getPrice = function(){
		return this.jsonObject.price;
	};
	PurchaseLog.prototype.getProductId = function(){
		return this.jsonObject.productId;
	};
	return PurchaseLog;
});