define(["framework/Model"], function(Model) {
	var PurchaseBasedRecommendationModel = function() {
		Model.call(this);


		PurchaseBasedRecommendationModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.purchaseLogList = null;
		};

		PurchaseBasedRecommendationModel.prototype.setPurchaseLogList = function(list) {
			this.purchaseLogList = list;
		};

		PurchaseBasedRecommendationModel.prototype.getPurchaseLogList = function() {
			return this.purchaseLogList;
		};

	};
	PurchaseBasedRecommendationModel.prototype = Object.create(Model.prototype);
	
	return PurchaseBasedRecommendationModel;
});