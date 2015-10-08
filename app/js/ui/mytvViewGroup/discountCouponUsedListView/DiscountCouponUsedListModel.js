define(["framework/Model"], function(Model) {
	var DiscountCouponUsedListModel = function() {
		Model.call(this);
		this.isFetched = false;
		
		DiscountCouponUsedListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
			this.isFetched = false;
		};
		DiscountCouponUsedListModel.prototype.setIsListFetched = function(isFetched) {
			this.isFetched = isFetched;
		};
		DiscountCouponUsedListModel.prototype.isListFetched = function() {
			return this.isFetched;
		};
	};
	DiscountCouponUsedListModel.prototype = Object.create(Model.prototype);
	
	return DiscountCouponUsedListModel;
});
