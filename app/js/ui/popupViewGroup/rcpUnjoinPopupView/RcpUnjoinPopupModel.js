define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var RcpUnjoinPopupModel = function() {
		Model.call(this);
		
		this.buttonGroup = null;
		this.inputField = null;
		this.bodyLineClass = "normal";
		this.headText = null;

		this.param = null;
		
		RcpUnjoinPopupModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.buttonGroup = null;
			this.inputField = null;
			this.bodyLineClass = "normal";
			this.headText = null;
			this.param = null;
		};

		RcpUnjoinPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		RcpUnjoinPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

		RcpUnjoinPopupModel.prototype.setInputField = function(inputField) {
			this.inputField = inputField;
		};
		RcpUnjoinPopupModel.prototype.getInputField = function() {
			return this.inputField;
		};

		RcpUnjoinPopupModel.prototype.setBodyLineClass = function(bodyLineClass) {
			this.bodyLineClass = bodyLineClass;
		};
		RcpUnjoinPopupModel.prototype.getBodyLineClass = function() {
			return this.bodyLineClass;
		};

		RcpUnjoinPopupModel.prototype.setHeadText = function(headText) {
			this.headText = headText;
		};
		RcpUnjoinPopupModel.prototype.getHeadText = function() {
			return this.headText;
		};

		RcpUnjoinPopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		RcpUnjoinPopupModel.prototype.getParam = function() {
			return this.param;
		};
	};
	RcpUnjoinPopupModel.prototype = Object.create(Model.prototype);
	
	return RcpUnjoinPopupModel;
});
