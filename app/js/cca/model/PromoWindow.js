define(function(){
    var PromoWindow = function(jsonObject){
        this.jsonObject = jsonObject;
    };

    PromoWindow.prototype.getPosterImage = function(){
        return this.jsonObject.posterImage;
    };

    PromoWindow.prototype.getLinkType = function(){
        return this.jsonObject.linkType;
    };

    PromoWindow.prototype.getType = function(){
        return this.jsonObject.type;
    };

    PromoWindow.prototype.getSourceId = function(){
        return this.jsonObject.sourceId;
    };

    PromoWindow.prototype.getName = function(){
        return this.jsonObject.name;
    };

    PromoWindow.prototype.getAssetId = function(){
        return this.jsonObject.assetId;
    };

    PromoWindow.prototype.getPromoWindowPosterList = function(){
        return this.jsonObject.promoWindowPosterList;
    };

    PromoWindow.prototype.setPromoWindowPosterList = function(promoWindowPosterList){
        this.jsonObject.promoWindowPosterList = promoWindowPosterList;
    };

    PromoWindow.prototype.getAppId = function () {
        return this.jsonObject.appId;
    }

    return PromoWindow;
});