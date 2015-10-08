define(["framework/Model"], function (Model) {
    var PromotionPosterPopupModel = function () {
        Model.call(this);

        PromotionPosterPopupModel.prototype.init = function () {
            Model.prototype.init.apply(this);
            this.buttonGroup = null;
        };

        PromotionPosterPopupModel.prototype.setButtonGroup = function (buttonGroup) {
            this.buttonGroup = buttonGroup;
        };

        PromotionPosterPopupModel.prototype.getButtonGroup = function () {
            return this.buttonGroup;
        };

    };
    PromotionPosterPopupModel.prototype = Object.create(Model.prototype);
    return PromotionPosterPopupModel;
});