define(['framework/Model'], function (Model) {
	var KeypadModel = function () {
		Model.call(this);

		this.searchWordList = [];
		this.expandSearch = 0;
		this.keypadMode = 0;
		this.inputText = null;
		this.checkBox = null;
		this.topButtonGroup = null;
		this.bottomButtonGroup = null;

		this.TYPE_SEARCH_BAR			= 0;
		this.TYPE_CHECK_BOX 			= 1;
		this.TYPE_TOP_BUTTON_GROUP		= 2;
		this.TYPE_KEYPAD				= 3;
		this.TYPE_BOTTOM_BUTTON_GROUP	= 4;

		this.TYPE_SEARCH_WORD			= 10;

		this.currentFocusedComponent = this.TYPE_SEARCH_BAR;

		KeypadModel.prototype.init = function () {
			this.inputText = "";
			this.searchWordList = [];
			this.expandSearch = false;
			this.keypadMode = 0;
			this.vIndex = 0;
			this.hIndex = 0;
			this.currentFocusedComponent = this.TYPE_SEARCH_BAR;
		}
		KeypadModel.prototype.setData = function (list) {
			this.searchWordList = list ? list : [];
		};
		KeypadModel.prototype.getData = function () {
			return this.searchWordList;
		};
		KeypadModel.prototype.setExpandSearch = function (isExpanded) {
			this.expandSearch = isExpanded;
		};
		KeypadModel.prototype.getExpandSearch = function () {
			return this.expandSearch;
		};
		KeypadModel.prototype.setInputText = function (text) {
			this.inputText = text;
		};
		KeypadModel.prototype.getInputText = function () {
			return this.inputText;
		};
		KeypadModel.prototype.setKeypadMode = function (mode) {
			this.keypadMode = mode;
		};
		KeypadModel.prototype.getKeypadMode = function () {
			return this.keypadMode;
		}

		KeypadModel.prototype.setTopButtonGroup = function (buttonGroup) {
			this.topButtonGroup = buttonGroup;
		};

		KeypadModel.prototype.getTopButtonGroup = function () {
			return this.topButtonGroup;
		};

		KeypadModel.prototype.setBottomButtonGroup = function (buttonGroup) {
			this.bottomButtonGroup = buttonGroup;
		};

		KeypadModel.prototype.getBottomButtonGroup = function (buttonGroup) {
			return this.bottomButtonGroup;
		};

		KeypadModel.prototype.setFocusedComponent = function (componentType) {
			this.currentFocusedComponent = (componentType < this.TYPE_SEARCH_BAR) ? 0 : componentType;
			this.currentFocusedComponent = (componentType > this.TYPE_BOTTOM_BUTTON_GROUP 
				&& componentType != this.TYPE_SEARCH_WORD) ? this.TYPE_BOTTOM_BUTTON_GROUP : this.currentFocusedComponent;
		};

		KeypadModel.prototype.getFocusedComponent = function () {
			return this.currentFocusedComponent;
		};

	};
	KeypadModel.prototype = Object.create(Model.prototype);

	return KeypadModel;
});