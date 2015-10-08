define(["framework/Model"], function(Model) {
	var DetailModel = function() {
		Model.call(this);

		this.currentAsset = null;
		this.buttonGroup = null;
		this.contentGroup = null;
		this.episodePeer = null;
		this.offset = null;
		this.isFirstTime = false;

		DetailModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.currentAsset = null;
			this.buttonGroup = null;
			this.contentGroup = null;
			this.episodePeer = null;
			this.offset = null;
			this.isFirstTime = false;
		};
		DetailModel.prototype.setCurrentAsset = function(currentAsset) {
			this.currentAsset = currentAsset;
		};
		DetailModel.prototype.getCurrentAsset = function() {
			return this.currentAsset;
		};
		DetailModel.prototype.setContentGroup = function(contentGroup) {
			this.contentGroup = contentGroup;
		};
		DetailModel.prototype.getContentGroup = function() {
			return this.contentGroup;
		};
		DetailModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		DetailModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		DetailModel.prototype.isFirstTimeDraw = function() {
			return this.isFirstTime;
		};
		DetailModel.prototype.setFirstTimeDraw = function(isFirstTime) {
			this.isFirstTime = isFirstTime;
		};

		DetailModel.prototype.setEpisodePeer = function(episodePeer) {
			this.episodePeer = episodePeer;
		};
		DetailModel.prototype.getEpisodePeer = function() {
			return this.episodePeer;
		};
		DetailModel.prototype.setOffset = function(offset) {
			this.offset = offset;
		};
		DetailModel.prototype.getOffset = function() {
			return this.offset;
		};
	};
	DetailModel.prototype = Object.create(Model.prototype);

	return DetailModel;
});
