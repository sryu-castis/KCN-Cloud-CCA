define(["helper/WeatherHelper"], function (WeatherHelper) {
    var STBInfoManager = {};

    var macAddress = "";
    var smartCardId = "";
    var ageLimit = 0; //@값의 범위 [ 0, 7, 12, 15, 19]
    var numberOfCallCenter = "";
    var modelNumber = ""
    var adultMenuSetting = 1;
    var socode = 0;
    var cscVersion = null;
    var cssIp = null;
    var isSettedSTBInfo = false;
    var stbid = "";
    var TSIDList = "";
    var hostId = "";

    STBInfoManager.initialize = function (data) {
        console.info("STBInfoManager, initialize");
        if(data != null) {
            macAddress = data['mac'];
            modelNumber = data['modelNumber'];
            hostId = data['hostId'];
            socode = data['SOCode'];
            smartCardId = data['smartCardId'];
            numberOfCallCenter = data['callCenterPhoneNumber'];
            cscVersion = data['cscVersion'];
            cssIp = data['cssIp'];
            TSIDList = data["TSIDList"];
            ageLimit = parseInt(data['currentParentalRating']);

            if(ageLimit == 0) {
                ageLimit = STBInfoManager.AGE_LIMIT_NONE;
            }
            isSettedSTBInfo = true;
        }
    }

    STBInfoManager.hasSTBInfo = function() {
        return isSettedSTBInfo;
    }

    STBInfoManager.getMacAddress = function () {
        return macAddress;
    }
    
    STBInfoManager.getSmartCardId = function () {
        return smartCardId;
    }
    

    STBInfoManager.getModelName = function () {
        return modelNumber;
    };

    STBInfoManager.getAdultMenuSetting = function () {
        return adultMenuSetting;
    };
    STBInfoManager.setAgeLimit = function (value) {
        ageLimit = parseInt(value);
        if(ageLimit == 0) {
            ageLimit = STBInfoManager.AGE_LIMIT_NONE;
        }
    }
    STBInfoManager.getAgeLimit = function () {
        return ageLimit;
    }
    STBInfoManager.getNumberOfCallCenter = function () {
        return numberOfCallCenter;
    }
    STBInfoManager.setAdultMenuSetting = function (value) {
        adultMenuSetting = value;
    }
    STBInfoManager.getMDCategoryID = function () {
        return CCASetting.Config.MDCategoryID;
    }
    STBInfoManager.getChartCategoryId = function () {
        return CCASetting.Config.ChartCategoryId;
    }
    STBInfoManager.getCouponShopCategoryId = function () {
        return CCASetting.Config.CouponShopCategoryID;
    }
    STBInfoManager.getMovieCategoryId = function () {
        return CCASetting.Config.MovieCategoryID;
    }
    STBInfoManager.getTVCategoryID = function () {
        return CCASetting.Config.TVCategoryID;
    }

    STBInfoManager.needRatingLimit = function (rating) {
        rating = parseInt(rating);
        if(rating >= 18) {
            rating = 19;
        }
        if(ageLimit <= rating) {
            return true;
        } else {
            return false;
        }
    }
    STBInfoManager.getCscVersion = function () {
        return cscVersion;
    }
    STBInfoManager.getCssIp = function () {
        return cssIp;
    }

    STBInfoManager.getSOCode = function () {
        return socode;
    }

    STBInfoManager.getSTBID = function () {
        return stbid;
    }

    STBInfoManager.getHostId = function () {
        return hostId;
    }

    STBInfoManager.getTSIDList = function () {
        return TSIDList;
    }

    STBInfoManager.isB2B = function () {
        return (WeatherHelper.SO_ULSANJCM == socode | WeatherHelper.SO_SEOKYUNG == socode | WeatherHelper.SO_GWANGJU == socode);
    }

    STBInfoManager.isAvailableSTBToRunCSApp = function () {
        for (var i = 0; i < STBInfoManager.MODEL_NAME_LIST_TO_UNAVAILABLE_CSAPP.length; i++ ) {
            if (STBInfoManager.MODEL_NAME_LIST_TO_UNAVAILABLE_CSAPP[i] == modelNumber) {
                return false;
            }
        }
        return true;
    }

    STBInfoManager.AGE_LIMIT_NONE = 99;
    STBInfoManager.MODEL_NAME_LIST_TO_UNAVAILABLE_CSAPP = ['LSC230-8DCMSK', 'SMT-H3020SK', 'SMT-H3021SK'];

    return STBInfoManager;
});
