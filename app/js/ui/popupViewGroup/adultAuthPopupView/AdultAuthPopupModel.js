define(["framework/Model"], function(Model) {
	var AdultAuthPopupModel = function() {
		Model.call(this);
		
		this.buttonGroup = null;
		this.inputField = null;
		this.iconType = null;
		this.title = "";
		this.headText = "";
		this.subText = "";
		this.subSpanClass = "";
		this.subSpanText = "";
		this.param = null;
		
		AdultAuthPopupModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.buttonGroup = null;
			this.inputField = null;
			this.iconType = null;
			this.title = "";
			this.headText = "";
			this.subText = "";
			this.subSpanClass = "";
			this.subSpanText = "";
			this.param = null;
		};

		AdultAuthPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		AdultAuthPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		
		AdultAuthPopupModel.prototype.setInputField = function(inputField) {
			this.inputField = inputField;
		};
		AdultAuthPopupModel.prototype.getInputField = function() {
			return this.inputField;
		};
		
		AdultAuthPopupModel.prototype.setIconType = function(iconType) {
			this.iconType = iconType;
		};
		AdultAuthPopupModel.prototype.getIconType = function() {
			return this.iconType;
		};
		
		AdultAuthPopupModel.prototype.setTitle = function(title) {
			this.title = title;
		};
		AdultAuthPopupModel.prototype.getTitle = function() {
			return this.title;
		};
		
		AdultAuthPopupModel.prototype.setHeadText = function(headText) {
			this.headText = headText;
		};
		AdultAuthPopupModel.prototype.getHeadText = function() {
			return this.headText;
		};
		
		AdultAuthPopupModel.prototype.setSubText = function(subText) {
			this.subText = subText;
		};
		AdultAuthPopupModel.prototype.getSubText = function() {
			return this.subText;
		}
		
		AdultAuthPopupModel.prototype.setSubSpanClass = function(subSpanClass) {
			this.subSpanClass = subSpanClass;
		};
		AdultAuthPopupModel.prototype.getSubSpanClass = function() {
			return this.subSpanClass;
		};

		AdultAuthPopupModel.prototype.setSubSpanText = function(subSpanText) {
			this.subSpanText = subSpanText;
		};
		AdultAuthPopupModel.prototype.getSubSpanText = function() {
			return this.subSpanText;
		}
		
		AdultAuthPopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		AdultAuthPopupModel.prototype.getParam = function() {
			return this.param;
		};
	};
	AdultAuthPopupModel.prototype = Object.create(Model.prototype);
	
	return AdultAuthPopupModel;
});
