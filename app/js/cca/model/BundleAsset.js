define(function() {
	var BundleAsset = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	BundleAsset.prototype.getAssetID = function(){
		return this.jsonObject.assetId;
	};

	BundleAsset.prototype.getDisplayName = function(){
		return this.jsonObject.displayName;
	};

	BundleAsset.prototype.getImageFileName = function(){
		return this.jsonObject.imageFileName;
	};

	BundleAsset.prototype.getSuggestedPrice = function(){
		return this.jsonObject.suggestedPrice;
	};

	BundleAsset.prototype.getHDContent = function(){
		return this.jsonObject.HDContent;
	};
	BundleAsset.prototype.isExtContentMapped = function () {
		return false;
	}

	return BundleAsset;
});