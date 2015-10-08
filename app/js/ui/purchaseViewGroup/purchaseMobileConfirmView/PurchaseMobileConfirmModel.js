define(["framework/Model", 'service/CouponManager'], function (Model, CouponManager) {
    var PurchaseMobileConfirmModel = function () {
        Model.call(this);

        this.asset = null;
        this.buttonGroup = null;
        this.product = null;
        this.bundleProduct = null;

        this.purchaseSessionId = null;
        this.mobilePayment = null;

        this.confirmFail = false;

        PurchaseMobileConfirmModel.prototype.init = function () {
            Model.prototype.init.apply(this);
            this.asset = null;
            this.buttonGroup = null;
            this.product = null;
            this.bundleProduct = null;
            this.purchaseSessionId = null;
            this.mobilePayment = null;
            this.confirmFail = false;
        };
        PurchaseMobileConfirmModel.prototype.setAsset = function (asset) {
            this.asset = asset;
        };
        PurchaseMobileConfirmModel.prototype.getAsset = function () {
            return this.asset;
        };
        PurchaseMobileConfirmModel.prototype.setButtonGroup = function (_buttonGroup) {
            this.buttonGroup = _buttonGroup;
        };
        PurchaseMobileConfirmModel.prototype.getButtonGroup = function () {
            return this.buttonGroup;
        };
        PurchaseMobileConfirmModel.prototype.setProduct = function (product) {
            this.product = product;
        };
        PurchaseMobileConfirmModel.prototype.getProduct = function () {
            return this.product;
        };

        PurchaseMobileConfirmModel.prototype.setBundleProduct = function(bundleProduct) {
            this.bundleProduct = bundleProduct;
        };
        PurchaseMobileConfirmModel.prototype.getBundleProduct = function() {
            return this.bundleProduct;
        };

        PurchaseMobileConfirmModel.prototype.setPurchaseSessionId = function(purchaseSessionId) {
            this.purchaseSessionId = purchaseSessionId;
        };
        PurchaseMobileConfirmModel.prototype.getPurchaseSessionId = function() {
            return this.purchaseSessionId;
        };

        PurchaseMobileConfirmModel.prototype.setMobilePayment = function(mobilePayment) {
            this.mobilePayment = mobilePayment;
        };
        PurchaseMobileConfirmModel.prototype.getMobilePayment = function() {
            return this.mobilePayment;
        };

        PurchaseMobileConfirmModel.prototype.setConfirmFail = function(value) {
            this.confirmFail = value;
        };
        PurchaseMobileConfirmModel.prototype.isConfirmFail = function() {
            return this.confirmFail;
        };

        PurchaseMobileConfirmModel.prototype.setNextPlay = function (isNextPlay) {
            this.isNextPlayField = isNextPlay;
        };
        PurchaseMobileConfirmModel.prototype.isNextPlay = function () {
            return this.isNextPlayField;
        };

    };
    PurchaseMobileConfirmModel.prototype = Object.create(Model.prototype);

    return PurchaseMobileConfirmModel;
});