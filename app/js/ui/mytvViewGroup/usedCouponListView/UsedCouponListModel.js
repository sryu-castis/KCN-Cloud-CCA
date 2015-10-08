define(["framework/Model"], function(Model) {
	var UsedCouponListModel = function() {
		Model.call(this);
		this.isFetched = false;
		
		UsedCouponListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.isFetched = false;
		};
		UsedCouponListModel.prototype.setIsListFetched = function(isFetched) {
			this.isFetched = isFetched;
		};
		UsedCouponListModel.prototype.isListFetched = function() {
			return this.isFetched;
		};
	};
	UsedCouponListModel.prototype = Object.create(Model.prototype);
	
	return UsedCouponListModel;
});
