define(["framework/Model"], function(Model) {
	var PurchasedListModel = function() {
		Model.call(this);

		this.pageSize = 0;

		this.requestDirection = 1;
		this.requestPageIndex = 0;
		this.currentPageIndex = 0;
		this.totalCount = 0;
		this.totalPage = 0;
		this.isFetched = false;
		this.lastVIndex = null;
		
		this.buttonGroup = null;
		
		PurchasedListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.requestPageIndex = 0;
			this.currentPageIndex = 0;
			this.totalCount = 0;
			this.totalPage = 0;
			this.isFetched = false;
			this.lastVIndex = null;
		};
		PurchasedListModel.prototype.setPageSize = function(pageSize) {
			this.pageSize = pageSize;
		};
		PurchasedListModel.prototype.getPageSize = function() {
			return this.pageSize;
		};
		PurchasedListModel.prototype.setRequestDirection = function(requestDirection) {
			this.requestDirection = requestDirection;
		};
		PurchasedListModel.prototype.getRequestDirection = function() {
			return this.requestDirection;
		};
		PurchasedListModel.prototype.setRequestPageIndex = function(requestPageIndex) {
			this.requestPageIndex = requestPageIndex;
		};
		PurchasedListModel.prototype.getRequestPageIndex = function() {
			return this.requestPageIndex;
		};
		PurchasedListModel.prototype.setCurrentPageIndex = function(currentPageIndex) {
			this.currentPageIndex = currentPageIndex;
		};
		PurchasedListModel.prototype.getCurrentPageIndex = function() {
			return this.currentPageIndex;
		};
		PurchasedListModel.prototype.setTotalCount = function(totalCount) {
			this.totalCount = totalCount;
		};
		PurchasedListModel.prototype.getTotalCount = function() {
			return this.totalCount;
		};
		PurchasedListModel.prototype.setTotalPage = function(totalPage) {
			this.totalPage = totalPage;
		};
		PurchasedListModel.prototype.getTotalPage = function() {
			return this.totalPage;
		};
		PurchasedListModel.prototype.setLastVIndex = function(lastVIndex) {
			this.lastVIndex = lastVIndex;
		};
		PurchasedListModel.prototype.getLastVIndex = function() {
			return this.lastVIndex;
		};
		
		PurchasedListModel.prototype.getNextVIndexAfterRequest = function() {
			var nextVIndex = 0;
			if(this.requestDirection == -1) {
				nextVIndex = this.data.length - 1;
			}
			return nextVIndex;
		}
		
		PurchasedListModel.prototype.getNextPageIndex = function() {
			return (this.currentPageIndex == this.totalPage-1) ? 0 : this.currentPageIndex + 1;
		}
		PurchasedListModel.prototype.getPrePageIndex = function() {
			return (this.currentPageIndex == 0) ? this.totalPage -1 : this.currentPageIndex - 1;
		}
		PurchasedListModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		PurchasedListModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		PurchasedListModel.prototype.setIsListFetched = function(isFetched) {
			this.isFetched = isFetched;
		};
		PurchasedListModel.prototype.isListFetched = function() {
			return this.isFetched;
		};
	};
	PurchasedListModel.prototype = Object.create(Model.prototype);
	
	return PurchasedListModel;
});
