define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var AlertPopupModel = function() {
		Model.call(this);

		this.param = null;

		this.buttonGroup = null;

		this.iconType = null;
		this.title = null;
		this.headTextClass = null;
		this.headText = null;
		this.subTextClass = null;
		this.subText = null;
		this.subSubTextClass = null;
		this.subSubText = null;

		this.buttonText1 = null;

		AlertPopupModel.prototype.init = function() {
			console.log("AlertPopupModel.prototype.init");
			Model.prototype.init.apply(this);

			this.param = null;

			this.buttonGroup = null;

			this.iconType = null;
			this.title = null;
			this.headTextClass = null;
			this.headText = null;
			this.subTextClass = null;
			this.subText = null;
			this.subSubTextClass = null;
			this.subSubText = null;

			this.buttonText1 = null;
		};

		AlertPopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		AlertPopupModel.prototype.getParam = function() {
			return this.param;
		};

		AlertPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		AlertPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

		AlertPopupModel.prototype.setIconType = function(iconType) {
			this.iconType = iconType;
		};
		AlertPopupModel.prototype.getIconType = function() {
			return this.iconType;
		};

		AlertPopupModel.prototype.setTitle = function(title) {
			this.title = title;
		};
		AlertPopupModel.prototype.getTitle = function() {
			return this.title;
		};

		AlertPopupModel.prototype.setHeadTextClass = function(headTextClass) {
			this.headTextClass = headTextClass;
		};
		AlertPopupModel.prototype.getHeadTextClass = function() {
			return this.headTextClass;
		};

		AlertPopupModel.prototype.setHeadText = function(headText) {
			this.headText = headText;
		};
		AlertPopupModel.prototype.getHeadText = function() {
			return this.headText;
		};

		AlertPopupModel.prototype.setSubTextClass = function(subTextClass) {
			this.subTextClass = subTextClass;
		};
		AlertPopupModel.prototype.getSubTextClass = function() {
			return this.subTextClass;
		};

		AlertPopupModel.prototype.setSubText = function(subText) {
			this.subText = subText;
		};
		AlertPopupModel.prototype.getSubText = function() {
			return this.subText;
		};

		AlertPopupModel.prototype.setSubSubTextClass = function(subSubTextClass) {
			this.subSubTextClass = subSubTextClass;
		};
		AlertPopupModel.prototype.getSubSubTextClass = function() {
			return this.subSubTextClass;
		};

		AlertPopupModel.prototype.setSubSubText = function(subSubText) {
			this.subSubText = subSubText;
		};
		AlertPopupModel.prototype.getSubSubText = function() {
			return this.subSubText;
		};

		AlertPopupModel.prototype.setButtonText1 = function(buttonText1) {
			this.buttonText1 = buttonText1;
		};
		AlertPopupModel.prototype.getButtonText1 = function() {
			return this.buttonText1;
		}
	};
	AlertPopupModel.prototype = Object.create(Model.prototype);

	return AlertPopupModel;
});
