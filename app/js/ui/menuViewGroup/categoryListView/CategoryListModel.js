define(["framework/Model"], function(Model) {
	var CategoryListModel = function() {
		Model.call(this);

        this.parentCategory = null;
        this.currentCategory = null;
		this.rootCategoryName = "";
		this.jumpCategoryID = "";

		CategoryListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.parentCategory = null;
			this.currentCategory = null;
			this.rootCategoryName = "";
			this.jumpCategoryID = "";
		};
		CategoryListModel.prototype.setParentCategory = function(category) {
			this.parentCategory = category;
		};
		CategoryListModel.prototype.getParentCategory = function() {
			return this.parentCategory;
		};
        CategoryListModel.prototype.setCurrentCategory = function(category) {
            this.currentCategory = category;
        };
        CategoryListModel.prototype.getCurrentCategory = function() {
            return this.currentCategory;
        };
		CategoryListModel.prototype.setRootCategoryName = function(categoryName) {
			this.rootCategoryName = categoryName;
		};
		CategoryListModel.prototype.getRootCategoryName = function() {
			return this.rootCategoryName;
		};
		CategoryListModel.prototype.setJumpCategoryID = function(jumpCategoryID) {
			this.jumpCategoryID = jumpCategoryID;
		};
		CategoryListModel.prototype.getJumpCategoryID = function() {
			return this.jumpCategoryID;
		};
		CategoryListModel.prototype.setDetailIconType = function(detailIconType) {
			this.detailIconType = detailIconType;
		};
		CategoryListModel.prototype.getDetailIconType = function() {
			return this.detailIconType;
		};


	};
	CategoryListModel.prototype = Object.create(Model.prototype);
	
	return CategoryListModel;
});