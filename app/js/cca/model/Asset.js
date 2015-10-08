define(function() {
	var Asset = function(jsonObject) {
		this.jsonObject = jsonObject;
	};
	 
	Asset.prototype.getAssetID = function(){
		return this.jsonObject.assetId;
	};
	Asset.prototype.getTitle = function() {
		return this.jsonObject.title;
	};
	Asset.prototype.getDirector = function() {
		return this.jsonObject.director;
	};
	Asset.prototype.getStarring = function() {
		return this.jsonObject.starring;
	};
	Asset.prototype.getSynopsis = function() {
		return this.jsonObject.synopsis;
	};
	Asset.prototype.getGenre = function() {
		return this.jsonObject.genre;
	};
	Asset.prototype.getRunningTime = function() {
		return this.jsonObject.runningTime;
	};
	Asset.prototype.getPreviewPeriod = function() {
		return this.jsonObject.previewPeriod;
	};
	Asset.prototype.getRating = function() {
		return this.jsonObject.rating;
	};
	Asset.prototype.isHDContent = function() {
		return this.jsonObject.HDContent;
	};
	Asset.prototype.isUHDContent = function() {
		return this.jsonObject.UHDContent;
	};
	Asset.prototype.getLicenseStart = function() {
		return this.jsonObject.licenseStart;
	};
	Asset.prototype.getLicenseEnd = function() {
		return this.jsonObject.licenseEnd;
	};
	Asset.prototype.getFileName = function() {
		return this.jsonObject.fileName;
	};
	/*Asset.prototype.getPreviewFileName = function() {
		return this.jsonObject.previewFileName;
	};*/
	Asset.prototype.getImageFileName = function() {
		return this.jsonObject.imageFileName;
	};
	Asset.prototype.getPromotionSticker = function() {
		return this.jsonObject.promotionSticker;
	};
	Asset.prototype.getReviewRating = function() {
		var reviewRating = this.jsonObject.reviewRatingTotal / this.jsonObject.reviewRatingCount;
		return reviewRating.toFixed(1);
	}
	Asset.prototype.getReviewRatingTotal = function() {
		return this.jsonObject.reviewRatingTotal;
	};
	Asset.prototype.getReviewRatingCount = function() {
		return this.jsonObject.reviewRatingCount;
	};
	Asset.prototype.getProductList = function() {
		return this.jsonObject.productList;
	};
	Asset.prototype.setProductList = function(productList) {
		this.jsonObject.productList = productList;
	};
	Asset.prototype.isNew = function() {
		return this.jsonObject.isNew;
	};
	Asset.prototype.isHot = function() {
		return this.jsonObject.hot;
	};
	Asset.prototype.getCategoryID = function() {
		return this.jsonObject.categoryId;
	};
	Asset.prototype.isSeries = function() {
		return this.jsonObject.seriesLink;
	};
	Asset.prototype.isNextWatch = function() {
		return this.jsonObject.nextWatch;
	};
	Asset.prototype.getNextWatchAssetId = function() {
		return this.jsonObject.nextWatchAssetId;
	};
	Asset.prototype.getPreviewInfo = function() {
		return this.jsonObject.previewInfo;
	};
	Asset.prototype.setPreviewInfo = function(previewInfo) {
		this.jsonObject.previewInfo = previewInfo
	}
	Asset.prototype.hasPreview = function() {
		return this.jsonObject.previewPeriod > 0;
	}
	Asset.prototype.hasTrailer = function() {
		return this.jsonObject.previewInfo && this.jsonObject.previewInfo.getPreviewFileName().length > 0;
	}


	Asset.prototype.getCopyProtection = function() {
		return this.jsonObject.copyProtection;
	};
	Asset.prototype.getEncryption = function() {
		return this.jsonObject.encryption;
	};
	Asset.prototype.getProduction = function() {
		return this.jsonObject.production;
	};
	Asset.prototype.getPromotionCopy = function() {
		return this.jsonObject.promotionCopy;
	};
	Asset.prototype.getSoundMix = function() {
		return this.jsonObject.soundMix;
	};
	Asset.prototype.getThreeDimIndicator = function() {
		return this.jsonObject.threeDimIndicator;
	};
	Asset.prototype.getNewAssetCount = function () {
		return this.jsonObject.assetNew;
	};
	Asset.prototype.getIsNew = function () {
		return this.jsonObject.isNew;
	};
	Asset.prototype.getEventList = function () {
		return this.jsonObject.eventList;
	};
	Asset.prototype.isExtContentMapped = function () {
		return this.jsonObject.extContentMapped;
	}
	Asset.prototype.getExtContentDomainId = function () {
		return this.jsonObject.extContentDomainId;
	}
	Asset.prototype.getExtContentType = function () {
		return this.jsonObject.extContentType;
	}
	Asset.prototype.getExtContentId = function () {
		return this.jsonObject.extContentId;
	}
	Asset.prototype.getDiscountCouponMasterIdList = function () {
		return this.jsonObject.discountCouponMasterIdList;
	}
	Asset.prototype.getSmallImageFileName = function () {
		return this.jsonObject.smallImageFileName;
	}


	return Asset;
});