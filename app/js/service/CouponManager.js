define([ "service/Communicator", "helper/DateHelper", "service/CCAInfoManager"], function(Communicator, DateHelper, CCAInfoManager) {

	var CouponManager = {};
	var totalMoneyBalance = 0;
    var tvPointBalance = 0;
    var applicableCouponAmount = 0;
    var promotionCouponIssued = false;
	var couponList = null;

    var isRequestSuccess = false;

    var isCompletedRequestForCouponBalance = false;
    var isCompletedRequestForTVPoint = false;

    CouponManager.requestBalance = function() {
        isCompletedRequestForCouponBalance = false;
        this.requestCouponBalance();
        this.requestTVPointBalance();
    }

    CouponManager.requestTVPointBalance = function() {
        if(CCAInfoManager.isMobileUser() == false) {
            isCompletedRequestForTVPoint = false;
            Communicator.requestTVPointBalance(callbackForRequestTVPoint);
        } else {
            tvPointBalance = 0;
        }
    };

    function callbackForRequestTVPoint(response) {
        isCompletedRequestForTVPoint = true;
        if(Communicator.isSuccessResponseFromHAS(response)) {
            tvPointBalance = response.pointBalance;
        }
    }


    CouponManager.requestCouponBalance = function() {
        if(CCAInfoManager.isMobileUser() == false) {
            isCompletedRequestForCouponBalance = false;
            Communicator.requestCouponBalance(callbackForRequestCouponBalance);
        } else {
            isCompletedRequestForCouponBalance = true;
            couponList = null;
            totalMoneyBalance = 0;
            promotionCouponIssued = false;
        }
    };

    function callbackForRequestCouponBalance(response) {
        if(Communicator.isSuccessResponseFromHAS(response)) {
            isCompletedRequestForCouponBalance = true;
            couponList = response.couponList;
            totalMoneyBalance = response.totalMoneyBalance;
            promotionCouponIssued = response.promotionCouponIssued;
        }
    }

    CouponManager.isPromotionCouponIssued = function() {
        return promotionCouponIssued;
    };

    /**
     * @return int TVCoin
     */
    CouponManager.getTotalMoneyBalance = function() {
        return totalMoneyBalance;
    }

    CouponManager.getCouponListLength= function() {
        return couponList != null ? couponList.length : 0;
    }

    CouponManager.getTVPointBalance= function() {
        return tvPointBalance;
    }

    CouponManager.isCompletedRequestForBalances= function() {
        return isCompletedRequestForCouponBalance;
    }

    CouponManager.isCompletedRequestForTVBalances= function() {
        return isCompletedRequestForTVPoint;
    }

    CouponManager.setApplicableCouponAmount= function(_applicableCouponAmount) {
        applicableCouponAmount = _applicableCouponAmount;
    }

    CouponManager.getApplicableCouponAmount= function() {
        return applicableCouponAmount;
    }

    CouponManager.getAssetCoupon= function(discountCouponMasterIdList) {
        for(var i = 0; i < this.getCouponListLength(); i++) {
            var coupon = couponList[i];
            for(var j = 0; j < discountCouponMasterIdList.length; j++) {
                if(coupon.getDiscountCouponMasterId() == discountCouponMasterIdList[j]) {
                    return coupon;
                }
            }
        }
        return null;
    }

    CouponManager.getCouponList= function() {
        return couponList;
    }

    CouponManager.checkPromotionCouponIssued = function(){
        if(this.isPromotionCouponIssued()) {
            var promotionCouponIssuedDate = CCAInfoManager.getPromotionCouponIssuedDate();
            var nowDate = DateHelper.getNowDateString();
            if(nowDate != promotionCouponIssuedDate) {
                CCAInfoManager.setPromotionCouponIssuedDateToSTB(nowDate);
                return true;
            }
        }
        return false;
    }

    CouponManager.getPromotionDiscountCoupon = function() {
        var discountCouponList = this.getCouponList();
        var discountCouponIds = CCAInfoManager.getDiscountCouponIds();
        var discountCouponIdArray = [];

        //console.log("[get]discountCouponIds="+discountCouponIds);
        //discountCouponIds = "150212288583";
        //discountCouponIds = "150212288583,150212288582";

        if(discountCouponIds != null && discountCouponIds != undefined && discountCouponIds != '') {
            discountCouponIdArray = discountCouponIds.split(',');
        }

        var saveDiscountCouponIds = "";
        var promotionDiscountCoupon = null;

        for(var i = 0; discountCouponList != null && i < discountCouponList.length; i++) {
            var discountCoupon = discountCouponList[i];

            if(discountCoupon.getPopupValue() == 1) {
                if (i > 0) {
                    saveDiscountCouponIds += ",";
                }
                saveDiscountCouponIds += discountCoupon.getCouponId();

                if(promotionDiscountCoupon == null) {
                    var isHave = false;
                    for(var j = 0; j < discountCouponIdArray.length; j++) {
                        //console.log("discountCouponId="+discountCouponIdArray[j]);
                        if(discountCoupon.getCouponId() == discountCouponIdArray[j]){
                            isHave = true;
                            break;
                        }
                    }
                    if(!isHave) {
                        promotionDiscountCoupon = discountCoupon;
                    }
                }
            }
        }

        if(saveDiscountCouponIds != "") {
            CCAInfoManager.setDiscountCouponIdsToSTB(saveDiscountCouponIds);
        }

        return promotionDiscountCoupon;
    }


	// ////////////////////////////////////////////////////////////////////////////////////////////////

	return CouponManager;
});