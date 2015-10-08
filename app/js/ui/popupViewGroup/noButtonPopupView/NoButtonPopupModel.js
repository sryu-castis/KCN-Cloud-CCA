define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var NoButtonPopupModel = function() {
		Model.call(this);

		this.param = null;

		this.buttonGroup = null;

		this.iconType = null;
		this.title = null;
		this.headTextClass = null;
		this.headText = null;
		this.subTextClass = null;
		this.subText = null;

		NoButtonPopupModel.prototype.init = function() {
			console.log("NoButtonPopupModel.prototype.init");
			Model.prototype.init.apply(this);

			this.param = null;

			this.buttonGroup = null;

			this.iconType = null;
			this.title = null;
			this.headTextClass = null;
			this.headText = null;
			this.subTextClass = null;
			this.subText = null;
		};

		NoButtonPopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		NoButtonPopupModel.prototype.getParam = function() {
			return this.param;
		};

		NoButtonPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		NoButtonPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

		NoButtonPopupModel.prototype.setIconType = function(iconType) {
			this.iconType = iconType;
		};
		NoButtonPopupModel.prototype.getIconType = function() {
			return this.iconType;
		};

		NoButtonPopupModel.prototype.setTitle = function(title) {
			this.title = title;
		};
		NoButtonPopupModel.prototype.getTitle = function() {
			return this.title;
		};

		NoButtonPopupModel.prototype.setHeadTextClass = function(headTextClass) {
			this.headTextClass = headTextClass;
		};
		NoButtonPopupModel.prototype.getHeadTextClass = function() {
			return this.headTextClass;
		};

		NoButtonPopupModel.prototype.setHeadText = function(headText) {
			this.headText = headText;
		};
		NoButtonPopupModel.prototype.getHeadText = function() {
			return this.headText;
		};

		NoButtonPopupModel.prototype.setSubTextClass = function(subTextClass) {
			this.subTextClass = subTextClass;
		};
		NoButtonPopupModel.prototype.getSubTextClass = function() {
			return this.subTextClass;
		};

		NoButtonPopupModel.prototype.setSubText = function(subText) {
			this.subText = subText;
		};
		NoButtonPopupModel.prototype.getSubText = function() {
			return this.subText;
		};
	};
	NoButtonPopupModel.prototype = Object.create(Model.prototype);

	return NoButtonPopupModel;
});
