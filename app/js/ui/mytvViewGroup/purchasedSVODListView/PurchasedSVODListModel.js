define(["framework/Model"], function(Model) {
	var PurchasedSVODListModel = function() {
		Model.call(this);

		
		this.buttonGroup = null;
		this.isFetched = false;
		PurchasedSVODListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.buttonGroup = null;	
			this.isFetched = false;
		};

		PurchasedSVODListModel.prototype.setButtonGroup = function(buttonGroup) {
			this.buttonGroup = buttonGroup;
		};
		PurchasedSVODListModel.prototype.getButtonGroup = function() {
			return this.buttonGroup;
		};
		PurchasedSVODListModel.prototype.setIsListFetched = function(isFetched) {
			this.isFetched = isFetched;
		};
		PurchasedSVODListModel.prototype.isListFetched = function() {
			return this.isFetched;
		};
	};
	PurchasedSVODListModel.prototype = Object.create(Model.prototype);
	
	return PurchasedSVODListModel;
});
