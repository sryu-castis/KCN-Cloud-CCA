define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var ModSendToMultiPhoneModel = function() {
		Model.call(this);

		this.param = null;
		this.buttonGroup = null;
		this.smsSendCount = 0;
		this.smsTotalCount = 0;

		this.asset = null;
		this.selectedPhoneIndex = 0;

		this.inputField = null;
		
		ModSendToMultiPhoneModel.prototype.init = function() {
			console.log("ModSendToMultiPhoneModel.prototype.init");
			Model.prototype.init.apply(this);

			this.param = null;
			this.buttonGroup = null;
			this.smsSendCount = 0;
			this.smsTotalCount = 0;

			this.asset = null;
			this.selectedPhoneIndex = 0;

			this.inputField = null;
		};

		ModSendToMultiPhoneModel.prototype.setParam = function(param) {
			this.param = param;
		};
		ModSendToMultiPhoneModel.prototype.getParam = function() {
			return this.param;
		};

		ModSendToMultiPhoneModel.prototype.setSmsSendCount = function(smsSendCount) {
			this.smsSendCount = smsSendCount;
		};
		ModSendToMultiPhoneModel.prototype.getSmsSendCount = function() {
			return this.smsSendCount;
		};

		ModSendToMultiPhoneModel.prototype.setSmsTotalCount = function(smsTotalCount) {
			this.smsTotalCount = smsTotalCount;
		};
		ModSendToMultiPhoneModel.prototype.getSmsTotalCount = function() {
			return this.smsTotalCount;
		};

		ModSendToMultiPhoneModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		ModSendToMultiPhoneModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

		ModSendToMultiPhoneModel.prototype.setAsset = function(asset) {
			this.asset = asset;
		};
		ModSendToMultiPhoneModel.prototype.getAsset = function() {
			return this.asset;
		};

		ModSendToMultiPhoneModel.prototype.setSelectedPhoneIndex = function(selectedPhoneIndex) {
			this.selectedPhoneIndex = selectedPhoneIndex;
		};
		ModSendToMultiPhoneModel.prototype.getSelectedPhoneIndex = function() {
			return this.selectedPhoneIndex;
		};

		ModSendToMultiPhoneModel.prototype.setInputField = function(inputField) {
			this.inputField = inputField;
		};
		ModSendToMultiPhoneModel.prototype.getInputField = function() {
			return this.inputField;
		};
		
	};
	ModSendToMultiPhoneModel.prototype = Object.create(Model.prototype);
	
	return ModSendToMultiPhoneModel;
});
