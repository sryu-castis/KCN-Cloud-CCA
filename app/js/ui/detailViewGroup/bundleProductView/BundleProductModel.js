define(["framework/Model"], function(Model) {
	var BundleProductModel = function() {
		Model.call(this);

		this.buttonGroup = null;
        this.needReloadHistory = false;

		BundleProductModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.bundleProduct = undefined;
			this.offset = 0;
			this.asset = null;
			this.buttonGroup = null;
            this.needReloadHistory = false;
		};
		BundleProductModel.prototype.setData = function(bundleProduct) {
			this.bundleProduct = bundleProduct;
		};
		BundleProductModel.prototype.getData = function() {
			return this.bundleProduct;
		};
		BundleProductModel.prototype.setOffsetToPlay = function(offset) {
			this.offset = offset;
		};
		BundleProductModel.prototype.getOffsetToPlay = function() {
			return this.offset;
		};
		BundleProductModel.prototype.setAssetToPlay = function(asset) {
			this.asset = asset;
		};
		BundleProductModel.prototype.getAssetToPlay = function() {
			return this.asset;
		};
		BundleProductModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		BundleProductModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

        BundleProductModel.prototype.setNeedReloadHistory = function(needReloadHistory) {
            this.needReloadHistory = needReloadHistory;
        };
        BundleProductModel.prototype.getNeedReloadHistory = function() {
            return this.needReloadHistory;
        };
	};
	BundleProductModel.prototype = Object.create(Model.prototype);

	return BundleProductModel;
});
