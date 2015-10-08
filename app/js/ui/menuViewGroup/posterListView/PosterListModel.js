define(['framework/Model'], function (Model) {
	var PosterListModel = function () {
		Model.call(this);

		this.totalCount = 0;
		this.assetID = "";
		this.resultCategory = null;
		this.keyword = "";

		PosterListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.totalCount  = 0;
			this.assetID = "";
			this.resultCategory = null;
			this.keyword = "";
		};
		PosterListModel.prototype.setTotalCount = function(totalCount) {
			this.totalCount = totalCount;
		}
		PosterListModel.prototype.getTotalCount = function() {
			return this.totalCount;
		}
		PosterListModel.prototype.setAssetID = function(assetID) {
			this.assetID = assetID;
		};
		PosterListModel.prototype.getAssetID = function() {
			return this.assetID;
		};
		PosterListModel.prototype.setResultCategory = function(ResultCategory) {
			this.resultCategory = ResultCategory;
		};
		PosterListModel.prototype.getResultCategory = function() {
			return this.resultCategory;
		};
		PosterListModel.prototype.setKeyword = function(keyword) {
			this.keyword = keyword;
		};
		PosterListModel.prototype.getKeyword = function() {
			return this.keyword;
		};
		PosterListModel.prototype.setSearchField = function(searchField) {
			this.searchField = searchField;
		};
		PosterListModel.prototype.getSearchField = function() {
			return this.searchField;
		};
		PosterListModel.prototype.setIsExpandSearch = function(isExpandSearch) {
			this.isExpandSearch = isExpandSearch;
		};
		PosterListModel.prototype.getIsExpandSearch = function() {
			return this.isExpandSearch;
		};
	};
	PosterListModel.prototype = Object.create(Model.prototype);

	return PosterListModel;
});