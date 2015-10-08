define(['framework/Model'], function (Model) {
	var SubscriberBasedRecommendationModel = function () {
		Model.call(this);
		this.viewType = null; 
		SubscriberBasedRecommendationModel.prototype.init = function () {
			this.list = null;
			this.viewType = null;
		};
		SubscriberBasedRecommendationModel.prototype.setData = function (list) {
			this.list = list;
		};
		SubscriberBasedRecommendationModel.prototype.getData = function () {
			return this.list;
		};
		SubscriberBasedRecommendationModel.prototype.setViewType = function (viewType) {
			this.viewType = viewType;
		};
		SubscriberBasedRecommendationModel.prototype.getViewType = function () {
			return this.viewType;
		};
	};
	SubscriberBasedRecommendationModel.prototype = Object.create(Model.prototype);

	return SubscriberBasedRecommendationModel;
});
