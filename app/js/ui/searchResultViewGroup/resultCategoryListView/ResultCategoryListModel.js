define(["ui/menuViewGroup/categoryListView/CategoryListModel"], function(Model) {
	var ResultCategoryListModel = function() {
		Model.call(this);

		this.resultCategoryList = "";
		this.keyword = "";

		ResultCategoryListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.resultCategoryList = null;
			this.keyword = "";
			this.expandSearch = false;
		};
		ResultCategoryListModel.prototype.setResultCategoryList = function(resultCategoryList) {
			this.resultCategoryList = resultCategoryList;
		};
		ResultCategoryListModel.prototype.getResultCategoryList = function() {
			return this.resultCategoryList;
		};
		ResultCategoryListModel.prototype.setKeyword = function(keyword) {
			this.keyword = keyword;
		};
		ResultCategoryListModel.prototype.getKeyword = function() {
			return this.keyword;
		};
		ResultCategoryListModel.prototype.setExpandSearch = function(expandSearch) {
			this.expandSearch = expandSearch;
		};
		ResultCategoryListModel.prototype.getExpandSearch = function() {
			return this.expandSearch;
		};

	};
	ResultCategoryListModel.prototype = Object.create(Model.prototype);

	return ResultCategoryListModel;
});