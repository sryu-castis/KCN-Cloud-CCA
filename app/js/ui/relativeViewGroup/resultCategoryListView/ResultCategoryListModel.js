define(["ui/menuViewGroup/categoryListView/CategoryListModel"], function(Model) {
	var ResultCategoryListModel = function() {
		Model.call(this);

		this.resultCategoryList = "";
		this.assetID = "";

		ResultCategoryListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.resultCategoryList = null;
			this.assetID = "";
		};
		ResultCategoryListModel.prototype.setResultCategoryList = function(resultCategoryList) {
			this.resultCategoryList = resultCategoryList;
		};
		ResultCategoryListModel.prototype.getResultCategoryList = function() {
			return this.resultCategoryList;
		};
		ResultCategoryListModel.prototype.setAssetID = function(assetID) {
			this.assetID = assetID;
		}
		ResultCategoryListModel.prototype.getAssetID = function() {
			return this.assetID;
		};

	};
	ResultCategoryListModel.prototype = Object.create(Model.prototype);

	return ResultCategoryListModel;
});