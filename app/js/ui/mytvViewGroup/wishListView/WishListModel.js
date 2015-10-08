define(["framework/Model"], function(Model) {
	var WishListModel = function() {
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
		
		WishListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.requestPageIndex = 0;
			this.currentPageIndex = 0;
			this.totalCount = 0;
			this.totalPage = 0;
			this.isFetched = false;
			this.lastVIndex = null;
		};
		WishListModel.prototype.setPageSize = function(pageSize) {
			this.pageSize = pageSize;
		};
		WishListModel.prototype.getPageSize = function() {
			return this.pageSize;
		};
		WishListModel.prototype.setRequestDirection = function(requestDirection) {
			this.requestDirection = requestDirection;
		};
		WishListModel.prototype.getRequestDirection = function() {
			return this.requestDirection;
		};
		WishListModel.prototype.setRequestPageIndex = function(requestPageIndex) {
			this.requestPageIndex = requestPageIndex;
		};
		WishListModel.prototype.getRequestPageIndex = function() {
			return this.requestPageIndex;
		};
		WishListModel.prototype.setCurrentPageIndex = function(currentPageIndex) {
			this.currentPageIndex = currentPageIndex;
		};
		WishListModel.prototype.getCurrentPageIndex = function() {
			return this.currentPageIndex;
		};
		WishListModel.prototype.setTotalCount = function(totalCount) {
			this.totalCount = totalCount;
		};
		WishListModel.prototype.getTotalCount = function() {
			return this.totalCount;
		};
		WishListModel.prototype.setTotalPage = function(totalPage) {
			this.totalPage = totalPage;
		};
		WishListModel.prototype.getTotalPage = function() {
			return this.totalPage;
		};
		WishListModel.prototype.setLastVIndex = function(lastVIndex) {
			this.lastVIndex = lastVIndex;
		};
		WishListModel.prototype.getLastVIndex = function() {
			return this.lastVIndex;
		};
		WishListModel.prototype.getNextVIndexAfterRequest = function() {
			var nextVIndex = 0;
			if(this.requestDirection == -1) {
				nextVIndex = this.data.length - 1;
			}
			return nextVIndex;
		}
		
		WishListModel.prototype.getNextPageIndex = function() {
			return (this.currentPageIndex == this.totalPage-1) ? 0 : this.currentPageIndex + 1;
		}
		WishListModel.prototype.getPrePageIndex = function() {
			return (this.currentPageIndex == 0) ? this.totalPage -1 : this.currentPageIndex - 1;
		}
		WishListModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		WishListModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		WishListModel.prototype.setIsListFetched = function(isFetched) {
			this.isFetched = isFetched;
		};
		WishListModel.prototype.isListFetched = function() {
			return this.isFetched;
		};
	};
	WishListModel.prototype = Object.create(Model.prototype);
	
	return WishListModel;
});
