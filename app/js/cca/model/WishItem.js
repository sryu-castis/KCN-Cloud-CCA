define(function() {
    var WishItem = function(jsonObject) {
        this.jsonObject = jsonObject;
    };

    WishItem.prototype.getUserID = function(){
        return this.jsonObject.userId;
    };

    WishItem.prototype.getPhoneNumber = function(){
        return this.jsonObject.phoneNumber;
    };

    WishItem.prototype.getAddTime = function(){
        return this.jsonObject.addTime;
    };

    WishItem.prototype.getAsset = function(){
        return this.jsonObject.asset;
    };

    WishItem.prototype.setAsset = function(asset){
        this.jsonObject.asset = asset;
    };

    return WishItem;
});