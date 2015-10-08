define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var ModTriggerDetailModel = function() {
		Model.call(this);

		this.param = null;
		this.asset = null;
		this.extContentInfo = null;
		this.buttonGroup = null;


		ModTriggerDetailModel.prototype.init = function() {
			console.log("ModTriggerDetailModel.prototype.init");
			Model.prototype.init.apply(this);

			this.param = null;
			this.asset = null;
			this.extContentInfo = null;
			this.buttonGroup = null;
		};

		ModTriggerDetailModel.prototype.setParam = function(param) {
			this.param = param;
		};
		ModTriggerDetailModel.prototype.getParam = function() {
			return this.param;
		};

		ModTriggerDetailModel.prototype.setAsset = function(asset) {
			this.asset = asset;
		};
		ModTriggerDetailModel.prototype.getAsset = function() {
			return this.asset;
		};

		ModTriggerDetailModel.prototype.setExtContentInfo = function(extContentInfo) {
			this.extContentInfo = extContentInfo;
		};
		ModTriggerDetailModel.prototype.getExtContentInfo = function() {
			return this.extContentInfo;
		};

		ModTriggerDetailModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		ModTriggerDetailModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

	};
	ModTriggerDetailModel.prototype = Object.create(Model.prototype);

	return ModTriggerDetailModel;
});
