define(["framework/Model"], function(Model) {
	var RelativeListModel = function() {
		Model.call(this);

		this.assetID = null;

		RelativeListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.assetID = null;
		};

		RelativeListModel.prototype.setAssetID = function(assetID) {
			this.assetID = assetID;
		};

		RelativeListModel.prototype.getAssetID = function() {
			return this.assetID;
		};

	};
	RelativeListModel.prototype = Object.create(Model.prototype);
	
	return RelativeListModel;
});