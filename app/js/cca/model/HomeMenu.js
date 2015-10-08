define(function(){
    var HomeMenu = function(jsonObject) {
        this.jsonObject = jsonObject;
    };

    HomeMenu.prototype.getTitle = function(){
        return this.jsonObject.title;
    };

    HomeMenu.prototype.getDesc = function(){
        return this.jsonObject.desc;
    };

    HomeMenu.prototype.getUpdateDate = function(){
        return this.jsonObject.updateDate;
    };

    HomeMenu.prototype.getHeaderImage = function(){
        return this.jsonObject.headerImage;
    };

    HomeMenu.prototype.getPromoWindowList = function(){
        return this.jsonObject.promoWindowList;
    };

    HomeMenu.prototype.setPromoWindowList = function(promoWindowList){
        this.jsonObject.promoWindowList = promoWindowList;
    };

    HomeMenu.prototype.getCategoryList = function(){
      return this.jsonObject.categoryList;
    };

    HomeMenu.prototype.getFunctionMenuList = function(){
        return this.jsonObject.functionMenuList;
    };

    HomeMenu.prototype.setFunctionMenuList = function(functionMenuList){
      this.jsonObject.functionMenuList = functionMenuList;
    };

    HomeMenu.prototype.getUIComponentList = function(){
      return this.jsonObject.uiComponentList;
    };

    HomeMenu.prototype.getPromoWindow = function(){
        return this.jsonObject.promoWindow;
    }

    HomeMenu.prototype.setPromoWindowByIndex = function(index){
        this.jsonObject.promoWindow  = this.jsonObject.promoWindowList[index];
    }

    HomeMenu.prototype.getSubFunctionMenuList = function () {
        return this.jsonObject.subFunctionMenuList;
    };

    return HomeMenu;
});