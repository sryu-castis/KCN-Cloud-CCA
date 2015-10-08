define(function() {
	var Product = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	Product.prototype.getProductID = function(){
		return this.jsonObject.productId;
	};
	Product.prototype.getGoodId = function(){
		return this.jsonObject.goodId;
	};
	Product.prototype.getProductName = function(){
		return this.jsonObject.productName;
	};
	Product.prototype.getProductType = function(){
		return this.jsonObject.productType;
	};
	Product.prototype.getPrice = function(){
		return this.jsonObject.price;
	};
	Product.prototype.getListPrice = function(){
		return this.jsonObject.listPrice;
	};
	Product.prototype.getPurchasedTime = function(){
		return this.jsonObject.purchasedTime;
	};
	Product.prototype.getViewablePeriod = function(){
		return this.jsonObject.viewablePeriod;
	};
	Product.prototype.getViewablePeriodState = function(){
		return this.jsonObject.viewablePeriodState;
	};


	return Product;
});