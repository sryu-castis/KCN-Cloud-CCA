define(["ui/purchaseViewGroup/selectProductView/SelectProductModel", 'service/CouponManager'], function (Model, CouponManager) {
    var PurchaseMobileModel = function () {
        Model.call(this);
        this.confirmFail = false;

        PurchaseMobileModel.prototype.init = function () {
            Model.prototype.init.apply(this);
            this.confirmFail = false;
        };

        PurchaseMobileModel.prototype.setConfirmFail = function(value) {
            this.confirmFail = value;
        };
        PurchaseMobileModel.prototype.isConfirmFail = function() {
            return this.confirmFail;
        };

    };
    PurchaseMobileModel.prototype = Object.create(Model.prototype);

    return PurchaseMobileModel;
});