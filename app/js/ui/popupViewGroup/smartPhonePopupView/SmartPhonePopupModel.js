define(["framework/Model"], function(Model) {
	var SmartPhonePopupModel = function() {
		Model.call(this);
		
		this.buttonGroup = null;
		this.inputField = null;
		this.iconType = null;
		this.title = "";
		this.headTextClass = null;
		this.headText = null;
		this.subTextClass = null;
		this.subText = null;

		this.buttonText1 = null;
		this.buttonText2 = null;

		this.focusablePhone = false;

		this.param = null;
		
		SmartPhonePopupModel.prototype.init = function() {
			console.log("SmartPhonePopupModel.prototype.init");
			Model.prototype.init.apply(this);
			this.buttonGroup = null;
			this.inputField = null;
			this.iconType = null;
			this.title = "";
			this.headTextClass = null;
			this.headText = null;
			this.subTextClass = null;
			this.subText = null;
			this.buttonText1 = null;
			this.buttonText2 = null;
			this.focusablePhone = false;
			this.param = null;
		};

		SmartPhonePopupModel.prototype.setButtonGroup = function(buttonGroup) {
			console.log("setButtonGroup="+buttonGroup);
			this.buttonGroup = buttonGroup;
		};
		SmartPhonePopupModel.prototype.getButtonGroup = function() {
			console.log("getButtonGroup="+this.buttonGroup);
			return this.buttonGroup;
		};
		
		SmartPhonePopupModel.prototype.setInputField = function(inputField) {
			this.inputField = inputField;
		};
		SmartPhonePopupModel.prototype.getInputField = function() {
			return this.inputField;
		};
		
		SmartPhonePopupModel.prototype.setIconType = function(iconType) {
			this.iconType = iconType;
		};
		SmartPhonePopupModel.prototype.getIconType = function() {
			return this.iconType;
		};
		
		SmartPhonePopupModel.prototype.setTitle = function(title) {
			this.title = title;
		};
		SmartPhonePopupModel.prototype.getTitle = function() {
			return this.title;
		};

		SmartPhonePopupModel.prototype.setHeadTextClass = function(headTextClass) {
			this.headTextClass = headTextClass;
		};
		SmartPhonePopupModel.prototype.getHeadTextClass = function() {
			return this.headTextClass;
		};

		SmartPhonePopupModel.prototype.setHeadText = function(headText) {
			this.headText = headText;
		};
		SmartPhonePopupModel.prototype.getHeadText = function() {
			return this.headText;
		};

		SmartPhonePopupModel.prototype.setSubTextClass = function(subTextClass) {
			this.subTextClass = subTextClass;
		};
		SmartPhonePopupModel.prototype.getSubTextClass = function() {
			return this.subTextClass;
		};

		SmartPhonePopupModel.prototype.setSubText = function(subText) {
			this.subText = subText;
		};
		SmartPhonePopupModel.prototype.getSubText = function() {
			return this.subText;
		};
		
		SmartPhonePopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		SmartPhonePopupModel.prototype.getParam = function() {
			return this.param;
		};

		SmartPhonePopupModel.prototype.setButtonText1 = function(buttonText1) {
			this.buttonText1 = buttonText1;
		};
		SmartPhonePopupModel.prototype.getButtonText1 = function() {
			return this.buttonText1;
		}

		SmartPhonePopupModel.prototype.setButtonText2 = function(buttonText2) {
			this.buttonText2 = buttonText2;
		};
		SmartPhonePopupModel.prototype.getButtonText2 = function() {
			return this.buttonText2;
		}

		SmartPhonePopupModel.prototype.setFocusablePhone = function(focusablePhone) {
			this.focusablePhone = focusablePhone;
		};
		SmartPhonePopupModel.prototype.getFocusablePhone = function() {
			return this.focusablePhone;
		};
	};
	SmartPhonePopupModel.prototype = Object.create(Model.prototype);
	
	return SmartPhonePopupModel;
});
