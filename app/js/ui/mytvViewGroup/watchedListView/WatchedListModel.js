define(["framework/Model"], function(Model) {
	var WatchedListModel = function() {
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
		
		WatchedListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.requestPageIndex = 0;
			this.currentPageIndex = 0;
			this.totalCount = 0;
			this.totalPage = 0;
			this.isFetched = false;
			this.lastVIndex = null;
		};
		WatchedListModel.prototype.setPageSize = function(pageSize) {
			this.pageSize = pageSize;
		};
		WatchedListModel.prototype.getPageSize = function() {
			return this.pageSize;
		};
		WatchedListModel.prototype.setRequestDirection = function(requestDirection) {
			this.requestDirection = requestDirection;
		};
		WatchedListModel.prototype.getRequestDirection = function() {
			return this.requestDirection;
		};
		WatchedListModel.prototype.setRequestPageIndex = function(requestPageIndex) {
			this.requestPageIndex = requestPageIndex;
		};
		WatchedListModel.prototype.getRequestPageIndex = function() {
			return this.requestPageIndex;
		};
		WatchedListModel.prototype.setCurrentPageIndex = function(currentPageIndex) {
			this.currentPageIndex = currentPageIndex;
		};
		WatchedListModel.prototype.getCurrentPageIndex = function() {
			return this.currentPageIndex;
		};
		WatchedListModel.prototype.setTotalCount = function(totalCount) {
			this.totalCount = totalCount;
		};
		WatchedListModel.prototype.getTotalCount = function() {
			return this.totalCount;
		};
		WatchedListModel.prototype.setTotalPage = function(totalPage) {
			this.totalPage = totalPage;
		};
		WatchedListModel.prototype.getTotalPage = function() {
			return this.totalPage;
		};
		WatchedListModel.prototype.setLastVIndex = function(lastVIndex) {
			this.lastVIndex = lastVIndex;
		};
		WatchedListModel.prototype.getLastVIndex = function() {
			return this.lastVIndex;
		};
		WatchedListModel.prototype.getNextVIndexAfterRequest = function() {
			var nextVIndex = 0;
			if(this.requestDirection == -1) {
				nextVIndex = this.data.length - 1;
			}
			return nextVIndex;
		}
		
		WatchedListModel.prototype.getNextPageIndex = function() {
			return (this.currentPageIndex == this.totalPage-1) ? 0 : this.currentPageIndex + 1;
		}
		WatchedListModel.prototype.getPrePageIndex = function() {
			return (this.currentPageIndex == 0) ? this.totalPage -1 : this.currentPageIndex - 1;
		}
		WatchedListModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		WatchedListModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		WatchedListModel.prototype.setIsListFetched = function(isFetched) {
			this.isFetched = isFetched;
		};
		WatchedListModel.prototype.isListFetched = function() {
			return this.isFetched;
		};
	};
	WatchedListModel.prototype = Object.create(Model.prototype);
	
	return WatchedListModel;
});
