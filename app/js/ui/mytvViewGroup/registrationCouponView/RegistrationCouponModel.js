define(["framework/Model", "framework/modules/ButtonGroup", "framework/modules/InputField"], function(Model, ButtonGroup, InputField) {
	var RegistrationCouponModel = function() {
		Model.call(this);
		this.buttonGroup = new ButtonGroup();
		this.inputField1 = new InputField();
		this.inputField2 = new InputField();
		this.inputField3 = new InputField();
		this.errorCode = 0;
		this.infoString = "쿠폰 인증번호 12자리를 입력해 주세요.";
		this.couponProductId = 0;

		RegistrationCouponModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		RegistrationCouponModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		RegistrationCouponModel.prototype.setInputField1 = function(inputField) {
			this.inputField1 = inputField;
		};
		RegistrationCouponModel.prototype.getInputField1 = function() {
			return this.inputField1;
		};
		RegistrationCouponModel.prototype.setInputField2 = function(inputField) {
			this.inputField2 = inputField;
		};
		RegistrationCouponModel.prototype.getInputField2 = function() {
			return this.inputField2;
		};
		RegistrationCouponModel.prototype.setInputField3 = function(inputField) {
			this.inputField3 = inputField;
		};
		RegistrationCouponModel.prototype.getInputField3 = function() {
			return this.inputField3;
		};
		RegistrationCouponModel.prototype.setErrorCode = function(errorCode) { // error 인지 아닌지 ejs에 알려주기 위해..다른 방법이 생기면 이걸 없애자..
			this.errorCode = errorCode;
		};
		RegistrationCouponModel.prototype.getErrorCode = function() {
			return this.errorCode;
		};
		RegistrationCouponModel.prototype.setCouponProductId = function(couponProductId) {
			this.couponProductId = couponProductId;
		};
		RegistrationCouponModel.prototype.getCouponProductId = function() {
			return this.couponProductId;
		};
		RegistrationCouponModel.prototype.setInfoString = function(infoString) {
			this.infoString = infoString;
		};
		RegistrationCouponModel.prototype.getInfoString = function() {
			return this.infoString;
		};
	};
	RegistrationCouponModel.prototype = Object.create(Model.prototype);
	
	return RegistrationCouponModel;
});
