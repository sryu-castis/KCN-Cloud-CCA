define(function() {
	var PreviewInfo = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	PreviewInfo.prototype.getPreviewFileName = function(){
		return this.jsonObject.previewFileName;
	};
	PreviewInfo.prototype.getPreviewRating = function(){
		return this.jsonObject.previewRating;
	};
	PreviewInfo.prototype.getPreviewRuningtime = function(){
		return this.jsonObject.previewRuningtime;
	};

	return PreviewInfo;
});