define(['cca/type/ProductType'], function(ProductType) {
	var BundleProduct = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	BundleProduct.prototype.getProductID = function(){
		return this.jsonObject.productId;
	};

	BundleProduct.prototype.getExternalProductID = function(){
		return this.jsonObject.externalProductId;
	};

	BundleProduct.prototype.getProductName = function(){
		return this.jsonObject.productName;
	};
	BundleProduct.prototype.getListPrice = function(){
		return 0;
	};
	BundleProduct.prototype.getImageFileName = function(){
		return this.jsonObject.imageFileName;
	};

	BundleProduct.prototype.getPrice = function(){
		return this.jsonObject.price;
	};

	BundleProduct.prototype.getRentalDuration = function(){
		return this.jsonObject.rentalDuration;
	};

	BundleProduct.prototype.getRentalDurationUnit = function(){
		return this.jsonObject.rentalDurationUnit;
	};

	BundleProduct.prototype.getLicenseStart = function(){
		return this.jsonObject.licenseStart;
	};

	BundleProduct.prototype.getLicenseEnd = function(){
		return this.jsonObject.licenseEnd;
	};

	BundleProduct.prototype.getBundleAssetList = function(){
		return this.jsonObject.bundleAssetList;
	};

	BundleProduct.prototype.getProductDescription = function(){
		return this.jsonObject.productDescription;
	};

	BundleProduct.prototype.getPurchasedID = function(){
		return this.jsonObject.purchasedId;
	};

    BundleProduct.prototype.setPurchasedID = function(purchasedId){
        this.jsonObject.purchasedId = purchasedId;
    };

	BundleProduct.prototype.getExpirationTime = function(){
		return this.jsonObject.expirationTime;
	};

	BundleProduct.prototype.getSuggestedPriceTotal = function(){
		return this.jsonObject.suggestedPriceTotal;
	};

	BundleProduct.prototype.getPurchasedTime = function(){
		return this.jsonObject.purchasedTime;
	};

    BundleProduct.prototype.setPurchasedTime = function(purchasedTime){
        this.jsonObject.purchasedTime = purchasedTime;
    };

	BundleProduct.prototype.getProductType = function(){
		return ProductType.BUNDLE;
	};

	BundleProduct.prototype.getAssetList = function(){
		return this.jsonObject.assetList;
	};

	BundleProduct.prototype.setAssetList = function(assetList){
		this.jsonObject.assetList = assetList;
	};
	BundleProduct.prototype.getGoodId = function(){
		return "";
	};

	return BundleProduct;
});