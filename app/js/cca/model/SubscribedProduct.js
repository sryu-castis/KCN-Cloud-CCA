define(function() {
	var SubscribedProduct = function(jsonObject) {
		this.jsonObject = jsonObject;
	};
	SubscribedProduct.prototype.getProductID = function(){
		return this.jsonObject.productId;
	};

	return SubscribedProduct;
});