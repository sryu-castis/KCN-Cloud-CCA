define(["framework/Model"], function (Model) {
    var PromotionFullPopupModel = function () {
        Model.call(this);

        PromotionFullPopupModel.prototype.init = function () {
            Model.prototype.init.apply(this);
            this.buttonGroup = null;
        };

        PromotionFullPopupModel.prototype.setButtonGroup = function (buttonGroup) {
            this.buttonGroup = buttonGroup;
        };

        PromotionFullPopupModel.prototype.getButtonGroup = function () {
            return this.buttonGroup;
        };

    };
    PromotionFullPopupModel.prototype = Object.create(Model.prototype);

    return PromotionFullPopupModel;
});