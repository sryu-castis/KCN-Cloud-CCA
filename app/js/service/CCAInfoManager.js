define(["cca/type/PaymentType", "service/STBInfoManager"], function (PaymentType, STBInfoManager) {
    //@ 싱글턴 객체로 사용하며 별도의 생성이 필요 없는 객체는 {} 로 정의함. this 로 내부 메소드 접근 불가능
    var CCAInfoManager = {};
    var terminalKey = "";
    var serverValues = undefined;
    var isAdultConfirm = false;
    var availablePaymentTypeList = null;
    var promotionCouponIssuedDate = "";
    var discountCouponIds = "";
    var countOfNextWatch = 0;
    var terminalKeyResultCode = "";


    CCAInfoManager.initCCAInfo = function () {
        console.info("initCCAInfo!");
        this.initTerminalKey();
    };

    CCAInfoManager.initTerminalKey = function () {
        console.info("initTerminalKey!");
        terminalKey = "";
        terminalKeyResultCode = "";
    };

    CCAInfoManager.setTerminalKey = function (_terminalKey) {
        terminalKey = _terminalKey;
    };

    CCAInfoManager.hasTerminalKey = function () {
        return CCAInfoManager.getTerminalKey().length > 0;
    };

    CCAInfoManager.getTerminalKey = function () {
        return terminalKey;
    }

    CCAInfoManager.setTerminalKeyResultCode = function (_terminalKeyResultCode) {
        terminalKeyResultCode = _terminalKeyResultCode;
    }

    CCAInfoManager.getTerminalKeyResultCode = function () {
        return terminalKeyResultCode;
    }

    CCAInfoManager.isSuspendedUser = function () {
        var SUSPEND_CODE = 209;
        return SUSPEND_CODE == CCAInfoManager.getTerminalKeyResultCode();
    }

    CCAInfoManager.getVersion = function () {
        return CCASetting.Config.Version + CCASetting.Config.QRVersion;
    }

    CCAInfoManager.getHASIP = function () {
        return CCASetting.Config.HAS.IP;
    };

    CCAInfoManager.getHASPort = function () {
        return CCASetting.Config.HAS.PORT;
    };

    CCAInfoManager.getCUPSIP = function () {
        return CCASetting.Config.CUPS.IP;
    };

    CCAInfoManager.getCUPSPort = function () {
        return CCASetting.Config.CUPS.PORT;
    };

    CCAInfoManager.getWeatherIP = function () {
        return CCASetting.Config.Weather.IP;
    };

    CCAInfoManager.getWeatherPort = function () {
        return CCASetting.Config.Weather.PORT;
    };
    CCAInfoManager.getNotifyStartDelayTime = function () {
        return CCASetting.Config.NotifyStartDelayTime;
    };
    CCAInfoManager.getCategoryKeyBlockTime = function () {
        if(CCASetting.settopConfig[STBInfoManager.getModelName()] != undefined) {
            return CCASetting.settopConfig[STBInfoManager.getModelName()].CategoryKeyBlockTime;
        }else{
            return CCASetting.settopConfig["default"].CategoryKeyBlockTime;
        }

    };
    CCAInfoManager.getEpisodeListKeyBlockTime = function () {
        if(CCASetting.settopConfig[STBInfoManager.getModelName()] != undefined) {
            return CCASetting.settopConfig[STBInfoManager.getModelName()].EpisodeListKeyBlockTime;
        }else{
            return CCASetting.settopConfig["default"].EpisodeListKeyBlockTime;
        }
    };

    CCAInfoManager.needBlockToEnterKeyRepetition = function () {
        return CCASetting.Config.UseBlockToEnterKeyRepetition == "on";
    };
    CCAInfoManager.getRepetitionEnterKeyBlockTime = function () {
        return CCASetting.Config.RepetitionEnterKeyBlockTime;
    };

    CCAInfoManager.isAdultConfirm = function () {
        return isAdultConfirm;
    };

    CCAInfoManager.setAdultConfirm = function (value) {
        isAdultConfirm = value;
    };

    CCAInfoManager.setAdultConfirmToSTB = function () {
        putAppInfo();
    };

    CCAInfoManager.getCCAInfoAll = function(){
        //@comment stb에서 ccaInfo 정보를 가져온다
        CCABase.CSSHandler.requestCCAInfo('get', 'CCAAppData', '', function(data) {
            if(data != null && data.value.length > 0){
                var ccaAppData = JSON.parse(data.value);
                //@comment isAdultConfirm 세팅해준다.
                if(ccaAppData != null && ccaAppData["isAdultConfirm"] == true || ccaAppData["isAdultConfirm"] == "true") {
                    isAdultConfirm = true;
                }else{
                    isAdultConfirm = false;
                }

                //@comment promotionCouponIssuedDate 세팅해준다.
                if(ccaAppData != null && ccaAppData["promotionCouponIssuedDate"]) {
                    promotionCouponIssuedDate = ccaAppData["promotionCouponIssuedDate"];
                    console.log("[requestCCAInfo get] promotionCouponIssuedDate="+promotionCouponIssuedDate);
                }

                //@comment discountCouponIds 세팅해준다.
                if(ccaAppData != null && ccaAppData["discountCouponIds"]) {
                    discountCouponIds = ccaAppData["discountCouponIds"];
                    console.log("[requestCCAInfo get] discountCouponIds="+discountCouponIds);
                }

                //@comment countOfNextWatch 세팅해준다.
                if(ccaAppData != null && ccaAppData["countOfNextWatch"] != null) {
                    countOfNextWatch = parseInt(ccaAppData["countOfNextWatch"]);
                } else {
                    countOfNextWatch = 0;
                }
            }
        });
    };

    CCAInfoManager.setPromotionCouponIssuedDateToSTB = function (value) {
        promotionCouponIssuedDate = value;
        putAppInfo();
    };

    CCAInfoManager.getPromotionCouponIssuedDate = function() {
        return promotionCouponIssuedDate;
    };

    CCAInfoManager.setDiscountCouponIdsToSTB = function (value) {
        discountCouponIds = value;
        putAppInfo();
    };

    CCAInfoManager.getDiscountCouponIds = function () {
        return discountCouponIds;
    };

    CCAInfoManager.setAvailablePaymentTypeList = function(value) {
        availablePaymentTypeList = value;
    };

    CCAInfoManager.getAvailablePaymentTypeList = function() {
        return availablePaymentTypeList;
    };

    CCAInfoManager.isMobileUser = function() {
        //availablePaymentTypeList = [PaymentType.Mobile]; //for mobile test
        if(availablePaymentTypeList != null && availablePaymentTypeList.length == 1 && availablePaymentTypeList[0] == PaymentType.Mobile) {
            return true;
        } else {
            return false;
        }
    };

    CCAInfoManager.hasPaymentCoupon = function() {
        var hasPaymentCoupon = false;
        if(availablePaymentTypeList != null) {
            for(var i = 0; i < availablePaymentTypeList.length; i++) {
                if(PaymentType.Coupon == availablePaymentTypeList[i]) {
                    hasPaymentCoupon = true;
                    break;
                }
            }
        }

        return hasPaymentCoupon;
    }

    CCAInfoManager.hasPaymentPoint = function() {
        var hasPaymentPoint = false;
        if(availablePaymentTypeList != null) {
            for(var i = 0; i < availablePaymentTypeList.length; i++) {
                if(PaymentType.Point == availablePaymentTypeList[i]) {
                    hasPaymentPoint = true;
                    break;
                }
            }
        }

        return hasPaymentPoint;
    }

    CCAInfoManager.initializeCountOfNextWatch = function () {
        CCAInfoManager.setCountOfNextWatch(0);
        CCAInfoManager.setCountOfNextWatchToSTB();
    };
    CCAInfoManager.getCountOfNextWatch = function () {
        return countOfNextWatch;
    };
    CCAInfoManager.setCountOfNextWatch = function (value) {
        countOfNextWatch = value;
    };
    CCAInfoManager.setCountOfNextWatchToSTB = function () {
        putAppInfo();
    };

    function putAppInfo() {
        var appInfo = {
            countOfNextWatch : CCAInfoManager.getCountOfNextWatch(),
            discountCouponIds : CCAInfoManager.getDiscountCouponIds(),
            promotionCouponIssuedDate : CCAInfoManager.getPromotionCouponIssuedDate(),
            isAdultConfirm : CCAInfoManager.isAdultConfirm()
        }
        CCABase.CSSHandler.putAllAppDataToSTB(appInfo);
    }

    return CCAInfoManager;
});