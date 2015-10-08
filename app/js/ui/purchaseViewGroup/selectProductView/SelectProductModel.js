define(["framework/Model", 'service/CouponManager'], function (Model, CouponManager) {
    var SelectProductModel = function () {
        Model.call(this);

        this.asset = null;
        this.buttonGroup = null;
        this.inputField = null;
        this.product = null;
        this.coupon = null;
        this.isAgreeForEvent = null;
        this.bundleProduct = null;
        this.playAfterPurchase = null;

        var _this = this;
        SelectProductModel.prototype.init = function () {
            Model.prototype.init.apply(this);
            this.asset = null;
            this.buttonGroup = null;
            this.inputField = null;
            this.product = null;
            this.coupon = null;
            this.isAgreeForEvent = null;
            this.bundleProduct = null;
            this.playAfterPurchase = null;
        };
        SelectProductModel.prototype.setAsset = function (asset) {
            this.asset = asset;
        };
        SelectProductModel.prototype.getAsset = function () {
            return this.asset;
        };
        SelectProductModel.prototype.setButtonGroup = function (_buttonGroup) {
            this.buttonGroup = _buttonGroup;
        };
        SelectProductModel.prototype.getButtonGroup = function () {
            return this.buttonGroup;
        };
        SelectProductModel.prototype.setCoupon = function (coupon) {
            this.coupon = coupon;
        }
        SelectProductModel.prototype.getCoupon = function () {
            return this.coupon;
        };
        SelectProductModel.prototype.hasCoupon = function () {
            if (this.coupon) {
                return true;
            } else {
                return false;
            }
        };
        SelectProductModel.prototype.setProduct = function (product) {
            this.product = product;
        };
        SelectProductModel.prototype.getProduct = function () {
            return this.product;
        };
        SelectProductModel.prototype.setIsAgreeForEvent = function (isAgreeForEvent) {
            this.isAgreeForEvent = isAgreeForEvent;
        };
        SelectProductModel.prototype.getIsAgreeForEvent = function () {
            return this.isAgreeForEvent;
        };

        SelectProductModel.prototype.setNextPlay = function (isNextPlay) {
            this.isNextPlayField = isNextPlay;
        };
        SelectProductModel.prototype.isNextPlay = function () {
            return this.isNextPlayField;
        };

        SelectProductModel.prototype.getBalanceOfCoin = function() {
            return CouponManager.getTotalMoneyBalance();
        };
        SelectProductModel.prototype.getBalanceOfTVPoint = function() {
            return CouponManager.getTVPointBalance();
        };
        SelectProductModel.prototype.setInputField = function(inputField) {
            this.inputField = inputField;
        };
        SelectProductModel.prototype.getInputField = function() {
            return this.inputField;
        };

        SelectProductModel.prototype.setBundleProduct = function(bundleProduct) {
            this.bundleProduct = bundleProduct;
        };
        SelectProductModel.prototype.getBundleProduct = function() {
            return this.bundleProduct;
        };
        SelectProductModel.prototype.setPlayAfterPurchase = function(playAfterPurchase) {
            this.playAfterPurchase = playAfterPurchase;
        };
        SelectProductModel.prototype.getPlayAfterPurchase = function() {
            return this.playAfterPurchase;
        };

    };
    SelectProductModel.prototype = Object.create(Model.prototype);

    return SelectProductModel;
});