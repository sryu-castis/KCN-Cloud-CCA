define(function(){
    var PromoWindowPoster = function(jsonObject){
        this.jsonObject = jsonObject;
    };

    PromoWindowPoster.prototype.getImage = function(){
        return this.jsonObject.image;
    };

    PromoWindowPoster.prototype.getLinkType = function(){
        return this.jsonObject.linkType;
    };

    PromoWindowPoster.prototype.getAssetId = function(){
        return this.jsonObject.assetId;
    };

    PromoWindowPoster.prototype.getType = function(){
        return this.jsonObject.type;
    };

    PromoWindowPoster.prototype.getSourceId = function(){
        return this.jsonObject.sourceId;
    };

    PromoWindowPoster.prototype.getName = function(){
        return this.jsonObject.name;
    };

    PromoWindowPoster.prototype.getTitle = function(){
        return this.jsonObject.title;
    };

    PromoWindowPoster.prototype.getDesc = function(){
        return this.jsonObject.desc;
    };

    PromoWindowPoster.prototype.getAppId = function () {
        return this.jsonObject.appId;
    }

    return PromoWindowPoster;
});