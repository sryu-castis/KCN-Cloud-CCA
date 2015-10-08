define(function(){
    var FunctionMenu = function(jsonObject){
        this.jsonObject = jsonObject;
    };

    FunctionMenu.prototype.getPresentationName = function(){
        return this.jsonObject.presentationName;
    };

    FunctionMenu.prototype.getExternalSourceType = function(){
        return this.jsonObject.externalSourceType;
    };

    FunctionMenu.prototype.getExternalSourceId = function(){
        return this.jsonObject.externalSourceId;
    };

    FunctionMenu.prototype.getImageType = function(){
        return this.jsonObject.imageType;
    };

    FunctionMenu.prototype.getFocusImage = function(){
        return this.jsonObject.focusImage;
    };

    FunctionMenu.prototype.getUnFocusImage = function(){
        return this.jsonObject.unfocusImage;
    };

    return FunctionMenu;
});