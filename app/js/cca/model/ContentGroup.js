define(function() {
	var ContentGroup = function(jsonObject) {
		this.jsonObject = jsonObject;
	};
	 
	ContentGroup.prototype.getContentGroupID = function(){
		return this.jsonObject.contentGroupId;
	};
	 
	ContentGroup.prototype.getHDAssetCount = function() {
		return this.jsonObject.HDAssetCount;
	};
	ContentGroup.prototype.getSDAssetCount = function() {
		return this.jsonObject.SDAssetCount;
	};
	ContentGroup.prototype.getNewAssetCount = function() {
		return this.jsonObject.assetNew;
	};

	ContentGroup.prototype.getBundleAssetCount = function() {
		return this.jsonObject.assetBundle;
	};
	ContentGroup.prototype.isSeries = function() {
		return ( this.jsonObject.assetSeriesLink == '1' );
	};
	ContentGroup.prototype.getCategoryID = function() {
		return this.jsonObject.categoryId;
	};
	ContentGroup.prototype.getDirector = function() {
		return this.jsonObject.director;
	};
	ContentGroup.prototype.getGenre = function() {
		return this.jsonObject.genre;
	};
	ContentGroup.prototype.getImageFileName = function() {
		return this.jsonObject.imageFileName;
	};
	ContentGroup.prototype.getSmallImageFileName = function() {
		return this.jsonObject.smallImageFileName;
	};
	ContentGroup.prototype.getPrimaryAssetID = function() {
		return this.jsonObject.primaryAssetId;
	};
	ContentGroup.prototype.getPromotionSticker = function() {
		return this.jsonObject.promotionSticker;
	};
	ContentGroup.prototype.getRating = function() {
		return this.jsonObject.rating;
	};
	ContentGroup.prototype.getReviewRating = function() {
		return this.jsonObject.reviewRating;
	};
	ContentGroup.prototype.getRunningTime = function() {
		return this.jsonObject.runningTime;
	};
	ContentGroup.prototype.getStarring = function() {
		return this.jsonObject.starring;
	};
	ContentGroup.prototype.getSynopsis = function() {
		return this.jsonObject.synopsis;
	};
	ContentGroup.prototype.getTitle = function() {
		return this.jsonObject.title;
	};
	ContentGroup.prototype.isEpisodePeerContent = function() {
		return this.jsonObject.episodePeerExistence == '1';
	};

	ContentGroup.prototype.getAssetList = function() {
		return this.jsonObject.assetList;
	};
	ContentGroup.prototype.setAssetList = function(assetList) {
		this.jsonObject.assetList = assetList;
		this.jsonObject.hdAsset = null;
		this.jsonObject.sdAsset = null;
		for(var i = 0; i < assetList.length; i++) {
			if(assetList[i].isHDContent()) {
				this.jsonObject.hdAsset = assetList[i];
			} else {
				this.jsonObject.sdAsset = assetList[i];
			}
		}
	};
	ContentGroup.prototype.getHDAsset = function() {
		return this.jsonObject.hdAsset;
	};
	ContentGroup.prototype.getSDAsset = function() {
		//return null
		return this.jsonObject.sdAsset;
	};




	return ContentGroup;
});