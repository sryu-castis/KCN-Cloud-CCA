define(["service/CouponManager", "service/Communicator", "cca/type/ProductType", "cca/type/PaymentType"], function (CouponManager, Communicator, ProductType, PaymentType) {
    var PurchaseManager = {};
    var RETRY_MAX_COUNT = 3;
    var WAITING_TIME = 60 * 1000;

    var callbackFuncForAfterPurchase = null;
    var retryCount = 0;
    var playInfo = null;


    PurchaseManager.purchase = function (callbackFunc) {
        callbackFuncForAfterPurchase = callbackFunc;
        purchaseProduct();
    }

    function purchaseProduct() {
        if (isBundleProduct()) {
            purchaseBundleProduct();
        } else if (isSVODProduct()) {
            purchaseSVODProduct();
        } else {
            purchaseContent();
        }
    }

    function purchaseBundleProduct() {
        var paymentType = playInfo.paymentType;
        var product = playInfo.product;

        if (paymentType == PaymentType.Normal) {
            Communicator.requestPurchaseProduct(callbackForPurchase, product.getProductID());
        } else if (paymentType == PaymentType.Coupon) {
            Communicator.requestPurchaseProductByCoupon2(callbackForPurchase, product.getProductID(), product.getPrice());
        } else if (paymentType == PaymentType.Point) {
            Communicator.requestPurchaseProductByPoint(callbackForPurchase, product.getProductID(), product.getPrice());
        } else if (paymentType == PaymentType.Complex) {
            var pointPrice = 0;
            var couponPrice = CouponManager.getApplicableCouponAmount();
            var mobilePrice = 0;
            var normalPrice = product.getPrice() - couponPrice;

            Communicator.requestPurchaseProductByComplexMethods(callbackForPurchase, product.getProductID(), product.getPrice(), pointPrice, couponPrice, mobilePrice, normalPrice);
        }
    }

    function purchaseSVODProduct() {
        var asset = playInfo.asset;
        var product = playInfo.product;
        var isAgreeForEvent = playInfo.isAgreeForEvent;

        Communicator.requestPurchaseAssetEx2(callbackForPurchase, asset.getAssetID(), asset.getCategoryID(), product.getProductID(), product.getGoodId(), product.getPrice(), isAgreeForEvent);
    }

    function purchaseContent() {
        var asset = playInfo.asset;
        var product = playInfo.product;
        var paymentType = playInfo.paymentType;
        var coupon = playInfo.coupon;
        var isAgreeForEvent = playInfo.isAgreeForEvent;

        var couponId, discountAmount;
        if (coupon) {
            couponId = coupon.getCouponId();
            discountAmount = coupon.getDiscountAmount();
        } else {
            couponId = "";
            discountAmount = "0";
        }

        if (paymentType == PaymentType.Normal) {
            Communicator.requestPurchaseAssetEx2(callbackForPurchase, asset.getAssetID(), asset.getCategoryID(), product.getProductID(), product.getGoodId(), product.getPrice(), isAgreeForEvent, couponId, discountAmount);
        } else if (paymentType == PaymentType.Coupon) {
            Communicator.requestPurchaseByCoupon(callbackForPurchase, asset.getAssetID(), asset.getCategoryID(), product.getProductID(), product.getGoodId(), product.getPrice(), isAgreeForEvent);
        } else if (paymentType == PaymentType.Point) {
            Communicator.requestPurchaseByPoint(callbackForPurchase, asset.getAssetID(), asset.getCategoryID(), product.getProductID(), product.getGoodId(), product.getPrice(), isAgreeForEvent);
        } else if (paymentType == PaymentType.Complex) {
            var pointPrice = 0;
            var couponPrice = CouponManager.getApplicableCouponAmount();
            var mobilePrice = 0;
            var normalPrice = product.getPrice() - couponPrice;

            Communicator.requestPurchaseByComplexMethods(callbackForPurchase, asset.getAssetID(), asset.getCategoryID(), product.getProductID(), product.getGoodId(), product.getPrice(), isAgreeForEvent, pointPrice, couponPrice, mobilePrice, normalPrice);
        }
    }

    function isBundleProduct() {
        return ProductType.BUNDLE == playInfo.product.getProductType();
    }

    function isSVODProduct() {
        return ProductType.SVOD == playInfo.product.getProductType();
    }

    function callbackForPurchase(response) {

        if(playInfo.retryPurchase == true) {
            if(Communicator.isSuccessResponseFromHAS(response)) {
                //@구매로 인한 새로고침
                CouponManager.requestBalance();
                resetRetryCount();
                callbackFuncForAfterPurchase(response);
            } else {
                //@Comment 구매 재시도
                if(RETRY_MAX_COUNT > retryCount) {
                    setTimeout(function() {
                        retryCount += 1;
                        purchaseProduct();
                    }, WAITING_TIME);
                } else {
                    resetRetryCount();
                    callbackFuncForAfterPurchase(response);
                }
            }
        } else {
            CouponManager.requestBalance();
            callbackFuncForAfterPurchase(response);
        }
    }

    function resetRetryCount() {
        retryCount = 0;
    }

    PurchaseManager.setPlayInfo = function(asset, product, playType, paymentType, coupon, isAgreeForEvent, needRetryPurchase) {
        playInfo = {'asset': asset, 'product':product, 'playType':playType, 'isAgreeForEvent':isAgreeForEvent, 'paymentType':paymentType, 'coupon':coupon, 'retryPurchase':needRetryPurchase};
    }
    PurchaseManager.getPlayType = function() {
        if(playInfo) {
            return playInfo.playType;
        } else {
            return null;
        }
    }
    PurchaseManager.getPlayAsset = function() {
        if(playInfo) {
            return playInfo.asset;
        } else {
            return null;
        }
    }
    PurchaseManager.getPlayProduct = function() {
        if(playInfo) {
            return playInfo.product;
        } else {
            return null;
        }
    }

    return PurchaseManager;
});