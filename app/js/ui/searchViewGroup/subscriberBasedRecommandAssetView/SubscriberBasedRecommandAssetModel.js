define(["framework/Model"], function(Model) {
	var SubscriberBasedRecommandAssetModel = function() {
		this.assetList = null;
		Model.call(this);
		
		SubscriberBasedRecommandAssetModel.prototype.setAssetList = function(assetList) {
			this.assetList = assetList;
		};
		SubscriberBasedRecommandAssetModel.prototype.getAssetList = function() {
			return this.assetList;
		};
	};
	
	SubscriberBasedRecommandAssetModel.prototype = Object.create(Model.prototype);
	
	return SubscriberBasedRecommandAssetModel;
});