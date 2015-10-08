define(function() {
	var EpisodePeer = function(jsonObject) {
		this.jsonObject = jsonObject;
	};
	 
	EpisodePeer.prototype.getEpisodePeerID = function(){
		return this.jsonObject.episodePeerId;
	};

	EpisodePeer.prototype.getContentGroupId = function(){
		return this.jsonObject.contentGroupId;
	};

	EpisodePeer.prototype.getSeriesIndex = function(){
		return this.jsonObject.seriesIndex;
	};

	EpisodePeer.prototype.getReleaseDate = function(){
		return this.jsonObject.releaseDate;
	};

	EpisodePeer.prototype.getPrimaryAssetId = function(){
		return this.jsonObject.primaryAssetId;
	};


	return EpisodePeer;

});