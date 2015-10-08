define(["framework/Model"], function(Model) {
	var RecommendContentGroupModel = function() {
		Model.call(this);


		RecommendContentGroupModel.prototype.init = function() {
			Model.prototype.init.apply(this);
		};

		RecommendContentGroupModel.prototype.setData = function(list) {
			this.contentGroupList = list;
		};

		RecommendContentGroupModel.prototype.getData = function() {
			return this.contentGroupList;
		};

		RecommendContentGroupModel.prototype.setPurchasedTitle = function(purchasedTitle) {
			this.purchasedTitle = purchasedTitle;
		};

		RecommendContentGroupModel.prototype.getPurchasedTitle = function() {
			return this.purchasedTitle;
		};

	};
	RecommendContentGroupModel.prototype = Object.create(Model.prototype);
	
	return RecommendContentGroupModel;
});