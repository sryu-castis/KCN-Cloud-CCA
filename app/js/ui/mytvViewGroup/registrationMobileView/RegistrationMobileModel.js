define(["framework/Model"], function(Model) {
	var RegistrationMobileModel = function() {
		Model.call(this);

		this.pageSize = 0;

		this.requestDirection = 1;
		this.requestPageIndex = 0;
		this.currentPageIndex = 0;
		this.totalCount = 0;
		this.totalPage = 0;
		
		this.buttonGroup = null;

		this.registerButton = null;
		this.isFetched = false;

		this.state = RegistrationMobileModel.prototype.STATE_REGISTER_BUTTON;
		
		RegistrationMobileModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.requestPageIndex = 0;
			this.currentPageIndex = 0;
			this.totalCount = 0;
			this.totalPage = 0;
			this.isFetched = false;
			this.state = RegistrationMobileModel.STATE_REGISTER_BUTTON;
		};
		RegistrationMobileModel.prototype.setPageSize = function(pageSize) {
			this.pageSize = pageSize;
		};
		RegistrationMobileModel.prototype.getPageSize = function() {
			return this.pageSize;
		};
		RegistrationMobileModel.prototype.setRequestDirection = function(requestDirection) {
			this.requestDirection = requestDirection;
		};
		RegistrationMobileModel.prototype.getRequestDirection = function() {
			return this.requestDirection;
		};
		RegistrationMobileModel.prototype.setRequestPageIndex = function(requestPageIndex) {
			this.requestPageIndex = requestPageIndex;
		};
		RegistrationMobileModel.prototype.getRequestPageIndex = function() {
			return this.requestPageIndex;
		};
		RegistrationMobileModel.prototype.setCurrentPageIndex = function(currentPageIndex) {
			this.currentPageIndex = currentPageIndex;
		};
		RegistrationMobileModel.prototype.getCurrentPageIndex = function() {
			return this.currentPageIndex;
		};
		RegistrationMobileModel.prototype.setTotalCount = function(totalCount) {
			this.totalCount = totalCount;
		};
		RegistrationMobileModel.prototype.getTotalCount = function() {
			return this.totalCount;
		};
		RegistrationMobileModel.prototype.setTotalPage = function(totalPage) {
			this.totalPage = totalPage;
		};
		RegistrationMobileModel.prototype.getTotalPage = function() {
			return this.totalPage;
		};
		
		RegistrationMobileModel.prototype.getNextVIndexAfterRequest = function() {
			var nextVIndex = 0;
			if(this.requestDirection == -1) {
				nextVIndex = this.data.length - 1;
			}
			return nextVIndex;
		}
		
		RegistrationMobileModel.prototype.getNextPageIndex = function() {
			return (this.currentPageIndex == this.totalPage-1) ? 0 : this.currentPageIndex + 1;
		}
		RegistrationMobileModel.prototype.getPrePageIndex = function() {
			return (this.currentPageIndex == 0) ? this.totalPage -1 : this.currentPageIndex - 1;
		}

		RegistrationMobileModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		RegistrationMobileModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

		RegistrationMobileModel.prototype.setRegisterButton = function(registerButton) {
			this.registerButton = registerButton;
		};
		RegistrationMobileModel.prototype.getRegisterButton = function() {
			return this.registerButton;
		};

		RegistrationMobileModel.prototype.setState = function(state) {
			this.state = state;
		};
		RegistrationMobileModel.prototype.getState = function() {
			return this.state;
		};
		RegistrationMobileModel.prototype.setIsListFetched = function(isFetched) {
			this.isFetched = isFetched;
		};
		RegistrationMobileModel.prototype.isListFetched = function() {
			return this.isFetched;
		};
	};
	RegistrationMobileModel.prototype = Object.create(Model.prototype);

	RegistrationMobileModel.STATE_REGISTER_BUTTON = 0;
	RegistrationMobileModel.STATE_USER_LIST = 1;
	
	return RegistrationMobileModel;
});
