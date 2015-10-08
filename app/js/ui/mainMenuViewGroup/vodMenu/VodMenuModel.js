define(["framework/Model"],function(Model) {
    var VodMenuModel = function() {
        Model.call(this);
        this.promoWindow =null;

        VodMenuModel.prototype.init = function() {
            Model.prototype.init.apply(this);
            this.promoWindow =null;
        };

        VodMenuModel.prototype.getPromoWindow = function(){
            return this.promoWindow;
        };

        VodMenuModel.prototype.setPromoWindow = function(promoWindow){
            this.promoWindow = promoWindow;
        };

    };
    VodMenuModel.prototype = Object.create(Model.prototype);

    return VodMenuModel;
});