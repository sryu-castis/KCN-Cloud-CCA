define(function() {
	var Category = function(jsonObject) {
		this.jsonObject = jsonObject;
	};
	 
	Category.prototype.getCategoryID = function(){
		return this.jsonObject.categoryId;
	};
	 
	Category.prototype.getParentCategoryID = function() {
		return this.jsonObject.parentCategoryId;
	};
	Category.prototype.getCategoryName = function() {
		return this.jsonObject.categoryName;
	};
	Category.prototype.setCategoryName = function(categoryName) {
		this.jsonObject.categoryName = categoryName;
	};
	Category.prototype.isAdultCategory = function() {
		return this.jsonObject.adultCategory;
	};
	Category.prototype.getImageFileName = function() {
		return this.jsonObject.imageFileName;
	};
	Category.prototype.getDescription = function() {
		return this.jsonObject.description;
	};
	Category.prototype.getViewerType = function() {
		return this.jsonObject.viewerType;
	}
	Category.prototype.getPresentationType = function() {
		return this.jsonObject.presentationType;
	}
	Category.prototype.getSubCategoryPresentationType = function() {
		return this.jsonObject.subCategoryPresentationType;
	};
	Category.prototype.getSubCategoryVisible = function() {
		return this.jsonObject.subCategoryVisible;
	};
	Category.prototype.getMenuType = function() {
		return this.jsonObject.menuType;
	};
	Category.prototype.getVodType = function() {
		return this.jsonObject.vodType;
	};
	Category.prototype.isLeafCategory = function() {
		return this.jsonObject.leaf;
	};
	Category.prototype.getLinkInterfaceId = function() {
		return this.jsonObject.linkInterfaceId;
	};
	Category.prototype.setSubCategoryList = function(subCategoryList) {
		this.jsonObject.subCategoryList = subCategoryList;
	};
	Category.prototype.getSubCategoryList = function(subCategoryList) {
		return this.jsonObject.subCategoryList;
	};

	//2015-04-27 jjh add
	Category.prototype.getPresentationName = function(){
		return this.jsonObject.presentationName;
	};
	Category.prototype.getMenuExternalId = function(){
		return this.jsonObject.menuExternalId;
	};
	Category.prototype.getImageType = function(){
		return this.jsonObject.imageType;
	};
	Category.prototype.getFocusImage = function(){
		return this.jsonObject.focusImage;
	};
	Category.prototype.getUnFocusImage = function(){
		return this.jsonObject.unfocusImage;
	};
	Category.prototype.getDetailIconType = function(){
		return this.jsonObject.detailIconType;
	};

	return Category;
});