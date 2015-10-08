define(["framework/Model"], function (Model) {
    var RecommendContentsModel = function () {
        Model.call(this);

        this.uiComponentList = null;
        this.promoWindow = null;
        this.selectedItemIndex = 0;

        RecommendContentsModel.prototype.init = function () {
            Model.prototype.init.apply(this);
            this.uiComponent = null;
            this.promoWindow = null;
            this.selectedItemIndex = 0;
        };

        RecommendContentsModel.prototype.getUIComponentList = function(){
            return this.uiComponentList;
        };

        RecommendContentsModel.prototype.setUIComponentList= function(uiComponentList){
            this.uiComponentList = uiComponentList;
        };

        RecommendContentsModel.prototype.getPromoWindow = function(){
            return this.promoWindow;
        };

        RecommendContentsModel.prototype.setPromoWindow= function(promoWindow){
            this.promoWindow = promoWindow;
        };

        RecommendContentsModel.prototype.getSelectedItemIndex = function(){
            return this.selectedItemIndex;
        };

        RecommendContentsModel.prototype.setSelectedItemIndex= function(selectedItemIndex){
            this.selectedItemIndex = selectedItemIndex;
        };
    };
    RecommendContentsModel.prototype = Object.create(Model.prototype);

    return RecommendContentsModel;
});