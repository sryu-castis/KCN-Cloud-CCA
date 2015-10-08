define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var DialogPopupModel = function() {
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
		this.buttonText2 = null;
		
		DialogPopupModel.prototype.init = function() {
			console.log("DialogPopupModel.prototype.init");
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
			this.buttonText2 = null;
		};

		DialogPopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		DialogPopupModel.prototype.getParam = function() {
			return this.param;
		};

		DialogPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		DialogPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

		DialogPopupModel.prototype.setIconType = function(iconType) {
			this.iconType = iconType;
		};
		DialogPopupModel.prototype.getIconType = function() {
			return this.iconType;
		};
		
		DialogPopupModel.prototype.setTitle = function(title) {
			this.title = title;
		};
		DialogPopupModel.prototype.getTitle = function() {
			return this.title;
		};

		DialogPopupModel.prototype.setHeadTextClass = function(headTextClass) {
			this.headTextClass = headTextClass;
		};
		DialogPopupModel.prototype.getHeadTextClass = function() {
			return this.headTextClass;
		};

		DialogPopupModel.prototype.setHeadText = function(headText) {
			this.headText = headText;
		};
		DialogPopupModel.prototype.getHeadText = function() {
			return this.headText;
		};

		DialogPopupModel.prototype.setSubTextClass = function(subTextClass) {
			this.subTextClass = subTextClass;
		};
		DialogPopupModel.prototype.getSubTextClass = function() {
			return this.subTextClass;
		};

		DialogPopupModel.prototype.setSubText = function(subText) {
			this.subText = subText;
		};
		DialogPopupModel.prototype.getSubText = function() {
			return this.subText;
		};

		DialogPopupModel.prototype.setSubSubTextClass = function(subSubTextClass) {
			this.subSubTextClass = subSubTextClass;
		};
		DialogPopupModel.prototype.getSubSubTextClass = function() {
			return this.subSubTextClass;
		};

		DialogPopupModel.prototype.setSubSubText = function(subSubText) {
			this.subSubText = subSubText;
		};
		DialogPopupModel.prototype.getSubSubText = function() {
			return this.subSubText;
		};

		DialogPopupModel.prototype.setButtonText1 = function(buttonText1) {
			this.buttonText1 = buttonText1;
		};
		DialogPopupModel.prototype.getButtonText1 = function() {
			return this.buttonText1;
		}

		DialogPopupModel.prototype.setButtonText2 = function(buttonText2) {
			this.buttonText2 = buttonText2;
		};
		DialogPopupModel.prototype.getButtonText2 = function() {
			return this.buttonText2;
		}
	};
	DialogPopupModel.prototype = Object.create(Model.prototype);
	
	return DialogPopupModel;
});
