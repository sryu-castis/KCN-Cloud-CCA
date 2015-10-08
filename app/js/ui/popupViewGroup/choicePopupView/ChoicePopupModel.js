define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var ChoicePopupModel = function() {
		Model.call(this);

		this.param = null;

		this.buttonGroup = null;

		this.iconType = null;
		this.title = null;
		this.headTextClass = null;
		this.headText = null;
		this.subTextClass = null;
		this.subText = null;

		this.buttonText1 = null;
		this.buttonText2 = null;
		this.buttonText3 = null;
		
		ChoicePopupModel.prototype.init = function() {
			console.log("ChoicePopupModel.prototype.init");
			Model.prototype.init.apply(this);

			this.param = null;

			this.buttonGroup = null;

			this.iconType = null;
			this.title = null;
			this.headTextClass = null;
			this.headText = null;
			this.subTextClass = null;
			this.subText = null;

			this.buttonText1 = null;
			this.buttonText2 = null;
			this.buttonText3 = null;
		};

		ChoicePopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		ChoicePopupModel.prototype.getParam = function() {
			return this.param;
		};

		ChoicePopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		ChoicePopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

		ChoicePopupModel.prototype.setIconType = function(iconType) {
			this.iconType = iconType;
		};
		ChoicePopupModel.prototype.getIconType = function() {
			return this.iconType;
		};
		
		ChoicePopupModel.prototype.setTitle = function(title) {
			this.title = title;
		};
		ChoicePopupModel.prototype.getTitle = function() {
			return this.title;
		};

		ChoicePopupModel.prototype.setHeadTextClass = function(headTextClass) {
			this.headTextClass = headTextClass;
		};
		ChoicePopupModel.prototype.getHeadTextClass = function() {
			return this.headTextClass;
		};

		ChoicePopupModel.prototype.setHeadText = function(headText) {
			this.headText = headText;
		};
		ChoicePopupModel.prototype.getHeadText = function() {
			return this.headText;
		};

		ChoicePopupModel.prototype.setSubTextClass = function(subTextClass) {
			this.subTextClass = subTextClass;
		};
		ChoicePopupModel.prototype.getSubTextClass = function() {
			return this.subTextClass;
		};

		ChoicePopupModel.prototype.setSubText = function(subText) {
			this.subText = subText;
		};
		ChoicePopupModel.prototype.getSubText = function() {
			return this.subText;
		};

		ChoicePopupModel.prototype.setButtonText1 = function(buttonText1) {
			this.buttonText1 = buttonText1;
		};
		ChoicePopupModel.prototype.getButtonText1 = function() {
			return this.buttonText1;
		}

		ChoicePopupModel.prototype.setButtonText2 = function(buttonText2) {
			this.buttonText2 = buttonText2;
		};
		ChoicePopupModel.prototype.getButtonText2 = function() {
			return this.buttonText2;
		}

		ChoicePopupModel.prototype.setButtonText3 = function(buttonText3) {
			this.buttonText3 = buttonText3;
		};
		ChoicePopupModel.prototype.getButtonText3 = function() {
			return this.buttonText3;
		}
	};
	ChoicePopupModel.prototype = Object.create(Model.prototype);
	
	return ChoicePopupModel;
});
