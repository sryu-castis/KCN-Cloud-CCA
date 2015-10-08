define(["framework/Model", "framework/modules/ButtonGroup"], function(Model, ButtonGroup) {
	var RatingPopupModel = function() {
		Model.call(this);

		this.param = null;
		this.buttonGroup = null;
		this.rating = 0;
		this.assetId = null;

		RatingPopupModel.prototype.init = function() {
			Model.prototype.init.apply(this);

			this.param = null;
			this.buttonGroup = null;
			this.rating = 0;
			this.assetId = null;
		};

		RatingPopupModel.prototype.setParam = function(param) {
			this.param = param;
		};
		RatingPopupModel.prototype.getParam = function() {
			return this.param;
		};
		RatingPopupModel.prototype.setAssetId = function(assetId) {
			this.assetId = assetId;
		};
		RatingPopupModel.prototype.getAssetId = function() {
			return this.assetId;
		};
		RatingPopupModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		RatingPopupModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};

		RatingPopupModel.prototype.setRating = function(rating) {
			this.rating = rating;
		};
		RatingPopupModel.prototype.getRating = function() {
			return this.rating;
		};

	
	};
	RatingPopupModel.prototype = Object.create(Model.prototype);

	return RatingPopupModel;
});
