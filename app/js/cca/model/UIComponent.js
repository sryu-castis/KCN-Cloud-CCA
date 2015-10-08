define(function() {
	var UIComponent = function(jsonObject) {
		this.jsonObject = jsonObject;
	};
	 
	UIComponent.prototype.getUiComponentDomain = function(){
		return this.jsonObject.uiComponentDomain;
	};
	UIComponent.prototype.getUIComponentId = function() {
		return this.jsonObject.uiComponentId;
	};
	UIComponent.prototype.getTitle = function() {
		return this.jsonObject.title;
	};
	UIComponent.prototype.getImageFileName = function() {
		return this.jsonObject.imageFileName;
	};
	UIComponent.prototype.getBannerExtraInfo = function() {
		return this.jsonObject.bannerExtraInfo;
	};
	UIComponent.prototype.getContentGroupExtraInfo = function() {
		return this.jsonObject.contentGroupExtraInfo;
	};

	return UIComponent;
});