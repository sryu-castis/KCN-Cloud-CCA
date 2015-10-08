define(['framework/Model', "service/CouponManager"], function (Model, CouponManager) {
	var SearchModel = function () {
		Model.call(this);
	};
	SearchModel.prototype = Object.create(Model.prototype);

	SearchModel.prototype.getBalanceOfCoin = function() {
		return CouponManager.getTotalMoneyBalance();
	};
    SearchModel.prototype.getCountOfCoupon = function() {
        return CouponManager.getCouponListLength();
    };

	return SearchModel;
});