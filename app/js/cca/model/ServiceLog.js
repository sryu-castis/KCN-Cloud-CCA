define(function() {
	var ServiceLog = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	ServiceLog.prototype.getAssetID = function(){
		return this.jsonObject.assetId;
	};

	ServiceLog.prototype.getAssetTitle = function(){
		return this.jsonObject.assetTitle;
	};

	ServiceLog.prototype.getProductID = function(){
		return this.jsonObject.productId;
	};

	ServiceLog.prototype.getGoodID = function(){
		return this.jsonObject.goodId;
	};

	ServiceLog.prototype.getServiceStartTime = function(){
		return this.jsonObject.serviceStartTime;
	};

	return ServiceLog;
});