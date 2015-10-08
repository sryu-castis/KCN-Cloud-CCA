define(["../../../framework/Model", "service/CouponManager"], function(Model, CouponManager) {
	var CategoryListModel = function() {
		Model.call(this);

		CategoryListModel.prototype.init = function() {
			Model.prototype.init.apply(this);
		};
		CategoryListModel.prototype.getBalanceOfCoin = function() {
			return CouponManager.getTotalMoneyBalance();
		};
        CategoryListModel.prototype.getCountOfCoupon = function() {
            return CouponManager.getCouponListLength();
        };

	};
	CategoryListModel.prototype = Object.create(Model.prototype);
	
	return CategoryListModel;
});