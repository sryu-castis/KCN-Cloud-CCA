define(function() {
    var ProductInfo = function(jsonObject) {
        this.jsonObject = jsonObject;
    };

    ProductInfo.prototype.getProductID = function(){
        return this.jsonObject.productId;
    };

    ProductInfo.prototype.getProductType = function(){
        return this.jsonObject.productType;
    };

    ProductInfo.prototype.getProductName = function(){
        return this.jsonObject.productName;
    };

    ProductInfo.prototype.getPrice = function(){
        return this.jsonObject.price;
    };

    ProductInfo.prototype.getIssueDate = function(){
        return this.jsonObject.issueDate;
    };

    return ProductInfo;
});