define(["framework/Model"], function(Model) {
	var HelpMenuModel = function() {
		this.buttonGroup = null;
		this.assetList = null;
		this.viewType = null;
		
		Model.call(this);
		
		HelpMenuModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		HelpMenuModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		HelpMenuModel.prototype.setAssetList = function (list) {
			this.assetList = list;
		};
		HelpMenuModel.prototype.getAssetList = function () {
			return this.assetList;
		};
		HelpMenuModel.prototype.setViewType = function (viewType) {
			this.viewType = viewType;
		};
		HelpMenuModel.prototype.getViewType = function () {
			return this.viewType;
		};
	};
	HelpMenuModel.prototype = Object.create(Model.prototype);
	
	return HelpMenuModel;
});
