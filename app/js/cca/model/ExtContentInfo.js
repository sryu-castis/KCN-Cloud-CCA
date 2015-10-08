define(function() {
    var ExtContentInfo = function(jsonObject) {
        this.jsonObject = jsonObject;
    };

    ExtContentInfo.prototype.getTitle = function(){
        return this.jsonObject.title;
    };

    ExtContentInfo.prototype.isPurchased = function(){
        return this.jsonObject.purchased;
    };

    ExtContentInfo.prototype.getPrice = function(){
        return this.jsonObject.price;
    };

    ExtContentInfo.prototype.getGenre = function(){
        return this.jsonObject.genre;
    };

    ExtContentInfo.prototype.getStyle = function(){
        return this.jsonObject.style;
    };

    ExtContentInfo.prototype.getArtist = function(){
        return this.jsonObject.artist;
    };

    ExtContentInfo.prototype.getInfo = function(){
        return this.jsonObject.info;
    };

    ExtContentInfo.prototype.getAge = function(){
        return this.jsonObject.age;
    };

    ExtContentInfo.prototype.getValidDuration = function(){
        return this.jsonObject.validDuration;
    };

    ExtContentInfo.prototype.getImgUrl = function(){
        return this.jsonObject.imgUrl;
    };

    ExtContentInfo.prototype.getProductId = function(){
        return this.jsonObject.productId;
    };

    ExtContentInfo.prototype.getGoodId = function(){
        return this.jsonObject.goodId;
    };

    return ExtContentInfo;
});