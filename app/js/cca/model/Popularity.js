define(function() {
	var Popularity = function(jsonObject) {
		this.jsonObject = jsonObject;
	};

	Popularity.prototype.getAssetId = function() {
		return this.jsonObject.assetId;
	};
	Popularity.prototype.getRanking = function(){
		return this.jsonObject.ranking;
	};
	Popularity.prototype.getComparision = function(){
		return this.jsonObject.comparision;
	};
	Popularity.prototype.getHitCount = function(){
		return this.jsonObject.hitCount;
	};
	Popularity.prototype.getHot = function(){
		return this.jsonObject.hot;
	};
	Popularity.prototype.getIsNew = function(){
		return this.jsonObject.isNew;
	};
	Popularity.prototype.getNew = function(){
		return this.jsonObject.new;
	};
	Popularity.prototype.getTitle = function(){
		return this.jsonObject.title;
	};

	return Popularity;
});