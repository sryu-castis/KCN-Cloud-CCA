define(["framework/Model"], function(Model) {
	var PasswordModel = function() {
		Model.call(this);

		this.inputField = null;
		this.currentCategory = null;
		this.buttonGroup = null;
		this.descriptionText = "";
		this.titleText = "";

		PasswordModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.inputField = null;
			this.currentCategory = null;
		};
		PasswordModel.prototype.setInputField = function(inputField) {
			this.inputField = inputField;
		};

		PasswordModel.prototype.getInputField = function() {
			return this.inputField;
		};
		PasswordModel.prototype.setCurrentCategory = function(category) {
			this.currentCategory = category;
		};
		PasswordModel.prototype.getCurrentCategory = function() {
			return this.currentCategory;
		};
		PasswordModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		PasswordModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		PasswordModel.prototype.setTitleText = function(titleText) {
			this.titleText = titleText;
		}
		PasswordModel.prototype.getTitleText = function() {
			return this.titleText;
		}
		PasswordModel.prototype.setDescriptionText = function(descriptionText) {
			this.descriptionText = descriptionText;
		}
		PasswordModel.prototype.getDescriptionText = function() {
			return this.descriptionText;
		}
	};
	PasswordModel.prototype = Object.create(Model.prototype);

	return PasswordModel;
});
