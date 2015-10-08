define(["framework/Model", "framework/modules/ButtonGroup", "cca/model/Asset"], function(Model, ButtonGroup, Asset) {
	var NextWatchPopupModel = function() {
		Model.call(this);

		this.param = null;

		this.buttonGroup = null;
		this.isEOSState = false;
		this.currentAsset = null;
		this.nextAsset = null;
		this.popupId = null;
		this.offset = 0;
		
		NextWatchPopupModel.prototype.init = function() {
//			console.log("NextWatchPopupModel.prototype.init");
			Model.prototype.init.apply(this);

			this.param = null;
			this.buttonGroup = null;
			this.isEOSState = false;
			this.currentAsset = null;
			this.nextAsset = null;
			this.popupId = null;
			this.offset = 0;
		};

		NextWatchPopupModel.prototype.setPopupId = function(popupId) {
			this.popupId = popupId;
		};
		NextWatchPopupModel.prototype.getPopupId = function() {
			return this.popupId;
		};

		NextWatchPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		NextWatchPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		NextWatchPopupModel.prototype.setEOS = function(isEOS) {
			this.isEOSState = isEOS;
		};
		NextWatchPopupModel.prototype.isEOS = function() {
			return this.isEOSState;
		};
		NextWatchPopupModel.prototype.setCurrentAsset = function(currentAsset) {
			this.currentAsset = currentAsset;
		};
		NextWatchPopupModel.prototype.getCurrentAsset = function() {
			return this.currentAsset;
		};
		NextWatchPopupModel.prototype.setNextAsset = function(nextAsset) {
			this.nextAsset = nextAsset;
		};
		NextWatchPopupModel.prototype.getNextAsset = function() {
			return this.nextAsset;
		};
		NextWatchPopupModel.prototype.setOffset = function(offset) {
			this.offset = offset;
		};
		NextWatchPopupModel.prototype.getOffset = function() {
			return this.offset;
		};
	};
	NextWatchPopupModel.prototype = Object.create(Model.prototype);
	
	return NextWatchPopupModel;
});
