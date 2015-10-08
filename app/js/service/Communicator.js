define(["service/CCAInfoManager", "service/STBInfoManager", "../helper/CommunicatorHelper", "../helper/StructureHelper",
    "cca/type/PromoWindowLinkType", "cca/type/PromoWindowType", "cca/type/PromoWindowPosterLinkType", "cca/type/PromoWindowPosterType",
    "cca/type/FunctionMenuExternalSourceType"],
    function(CCAInfoManager, STBInfoManager, CommunicatorHelper, StructureHelper, PromoWindowLinkType, PromoWindowType, PromoWindowPosterLinkType,
             PromoWindowPosterType, FunctionMenuExternalSourceType) {
	var Communicator = {};
    var HAS_SUCCESS_RESULT_CODE = 100;
    var POST = "post";
    var GET = "get";
    var TIMEOUT_TIME = 5000;

    var lastRequest = null;
    /*Communicator.requestID = 0;

    Communicator.increaseRequestID = function() {

    }

    Communicator.increaseRequestID = function() {

    }*/

    function request (url, data, isAsync, callback, dataType, requestType) {
        /*if(requestType == GET) {
            console.log("request url : " + url);
        }*/
        if(dataType == null) {
            dataType = 'json';
        }
        jQuery.ajaxSettings.traditional = true;

        lastRequest = $.ajax({
            url : url,
            async : isAsync,
            data : data,
            dataType : dataType,
            type : requestType,
            timeout : TIMEOUT_TIME,
            success : function(response) {
                console.info("requestData Sucess!!");
                lastRequest = null;

                callback(response);
    },
            error : function(response) {
                console.info("requestData Fail!!");
                lastRequest = null;

                callback(response);
            }
        });
    }

    Communicator.setRequestID = function(requestID) {
        CommunicatorHelper.setTransactionID(requestID);
    }

    Communicator.getRequestID = function() {
        return CommunicatorHelper.getTransactionID();
    }

    function requestByPOST (url, data, isAsync, callback, dataType) {
        request(url, data, isAsync, callback, dataType, POST);
    }

    function requestByGET(url, data, isAsync, callback, dataType) {
        request(url, data, isAsync, callback, dataType, GET);
    }

    function abortRequest() {
        if(lastRequest != null) {
            lastRequest.abort();
        }
    }

    function isSuccessResponseFromHAS(response) {
        return response != null && response.resultCode == HAS_SUCCESS_RESULT_CODE;
    }

    Communicator.isSuccessResponseFromHAS = function(response) {
        return isSuccessResponseFromHAS(response);
    }

    Communicator.isSuccessResponseFromCUPS = function(response) {
        return isSuccessResponseFromCUPS(response);
    }

    Communicator.isSuccessResponseFromWeather = function(response) {
        return response != null && response.result != null && response.result.code == 9200;
    }

    function isSuccessResponseFromCUPS(response) {
        return response != null && response.data != null;
    }

    Communicator.isCorrectRequestID = function(response) {
        return CommunicatorHelper.getTransactionID() == response.transactionId;
    }

    Communicator.isCorrectTransactionID = function(transactionId, response) {
        return transactionId == response.transactionId;
    }


	Communicator.requestTerminalKey = function(callbackFunction) {
		var url = CommunicatorHelper.getHASURL("authenticateClient");
        var data = CommunicatorHelper.getDataForRequestTerminalKey();
        requestByPOST(url, data, false, function(response) {
            callbackFunction(response);
        });
	};

	Communicator.requestCategoryList = function(categoryProfile, categoryId, depth, callbackFunction) {
        var url = CommunicatorHelper.getHASURL("getCategoryTree");
        var data = CommunicatorHelper.getDataForRequestCategoryList(categoryProfile, categoryId, depth);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createCategoryStructure(response));
        });
	};

    Communicator.requestCategorySync = function(categoryProfile, categoryId, depth) {
        var url = CommunicatorHelper.getHASURL("getCategoryTree");
        var data = CommunicatorHelper.getDataForRequestCategoryList(categoryProfile, categoryId, depth);
        var result = null;
        requestByPOST(url, data, false, function(response) {
            result = StructureHelper.createCategoryStructure(response);
        });
        return result;
    };

	Communicator.requestLinkCategoryList = function(categoryProfile, linkCategoryId, depth, callbackFunction) {
        var url = CommunicatorHelper.getHASURL("getCategoryLinkTree");
        var data = CommunicatorHelper.getDataForRequestLinkCategoryList(categoryProfile, linkCategoryId, depth);
        requestByPOST(url, data, false, function(response) {
            callbackFunction(StructureHelper.createCategoryStructure(response));
        });
	};

    Communicator.requestCouponBalance = function(callbackFunction) {
        var url = CommunicatorHelper.getHASURL("getCouponBalance2");
        var data = CommunicatorHelper.getDataForRequestCouponBalance2();
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createCouponStructure(response));
        });
    };

    Communicator.requestTVPointBalance = function(callbackFunction) {
        var url = CommunicatorHelper.getHASURL("getPointBalance");
        var data = CommunicatorHelper.getDataForRequestTVPoint();
        requestByPOST(url, data, true, function(response) {
            callbackFunction(response);
        });
    }

    Communicator.requestAssetInfo = function(callbackFunction, assetId, assetProfile) {
        var url = CommunicatorHelper.getHASURL("getAssetInfo");
        var data = CommunicatorHelper.getDataForRequestAssetInfo(assetId, assetProfile);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createAssetStructure(response));
        });
    }

    Communicator.requestAssetListByContentGroupId = function(callbackFunction, transactionId, contentGroupId, assetProfile, sortType, contentType, pageIndex, pageSize) {
        var url = CommunicatorHelper.getHASURL("getAssetListByContentGroupId");
        var data = CommunicatorHelper.getDataForRequestAssetListByContentGroupId(transactionId, contentGroupId, assetProfile, sortType, contentType, pageIndex, pageSize);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createAssetStructure(response));
        });
    }

    Communicator.requestAssetListByContentGroupIdUseStartItemIndex = function(callbackFunction, contentGroupId, assetProfile, sortType, contentType, startItemIndex, pageSize, indexRotation) {
        var url = CommunicatorHelper.getHASURL("getAssetListByContentGroupId");
        var data = CommunicatorHelper.getDataForRequestAssetListByContentGroupIdUseStartItemIndex(contentGroupId, assetProfile, sortType, contentType, startItemIndex, pageSize, indexRotation);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createAssetStructure(response));
        });
    }

    Communicator.requestAssetListByCategoryID = function(callbackFunction, transactionId, categoryId, assetProfile, sortType, pageIndex, pageSize) {
        var url = CommunicatorHelper.getHASURL("getAssetList");
        var data = CommunicatorHelper.getDataForRequestAssetListByCategoryID(categoryId, assetProfile, sortType, pageIndex, pageSize);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createAssetStructure(response));
        });
    }

    Communicator.requestContentGroupList = function(callbackFunction, categoryId, sortType, pageSize, pageIndex) {
        var url = CommunicatorHelper.getHASURL("getContentGroupList");
        var data = CommunicatorHelper.getDataForRequestContentGroupList(categoryId, sortType, pageSize, pageIndex);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createContentGroupStructure(response));
        });
    }

    Communicator.requestContentGroupListUseStartItemIndex = function(callbackFunction, transactionId, categoryId, sortType, startItemIndex, pageSize, indexRotation) {
        var url = CommunicatorHelper.getHASURL("getContentGroupList");
        var data = CommunicatorHelper.getDataForRequestContentGroupListUseStartItemIndex(categoryId, sortType, startItemIndex, pageSize, indexRotation);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createContentGroupStructure(response));
        });
    }


    Communicator.requestContentGroupListByCategoryId = function(callbackFunction, categoryId, contentGroupProfile, pageSize, pageIndex) {
        var url = CommunicatorHelper.getHASURL("getContentGroupListByCategoryId");
        var data = CommunicatorHelper.getDataForRequestContentGroupByCategoryId(categoryId, contentGroupProfile, pageSize, pageIndex);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createContentGroupStructure(response));
        });
    }

    Communicator.requestAutopayCouponProductList = function(callbackFunction, transactionId) {
        var url = CommunicatorHelper.getHASURL("getAutopayCouponProductList");
        var data = CommunicatorHelper.getDataForRequestAutopayCouponProductList(transactionId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createCouponProductStructure(response));
        });
    }

    //월정액코인(쿠폰) 가입
    Communicator.requestSubscribeAutopayCouponProduct = function(callbackFunction, couponProductId) {
        var url = CommunicatorHelper.getHASURL("subscribeAutopayCouponProduct");
        var data = CommunicatorHelper.getDataForRequestSubscribeAutopayCouponProduct(couponProductId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(response);
        });
    }

    Communicator.requestCouponProductList = function(callbackFunction, transactionId) {
        var url = CommunicatorHelper.getHASURL("getCouponProductList");
        var data = CommunicatorHelper.getDataForRequestCouponProductList(transactionId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createCouponProductStructure(response));
        });
    }

    Communicator.requestCouponUseHistory = function(callbackFunction, transactionId) {
        var url = CommunicatorHelper.getHASURL("getCouponUseHistory");
        var data = CommunicatorHelper.getDataForRequestCouponUseHistory(transactionId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createPossessionCouponStructure(response));
        });
    }

    Communicator.requestServiceLogList = function(callbackFunction, transactionId, serviceLogProfile, startTime, endTime, productType, assetDuplicationShowMethod, pageSize, pageIndex) {
        var url = CommunicatorHelper.getHASURL("getServiceLogList");
        var data = CommunicatorHelper.getDataForRequestServiceLogList(transactionId, serviceLogProfile, startTime, endTime, productType, assetDuplicationShowMethod, pageSize, pageIndex);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createServiceLogStructure(response));
        });
    }

    Communicator.requestRCPProductList = function(callbackFunction, transactionId, appId, sourceId, stbHostMac, cableCardMac, smartCardSn) {
        var url = CommunicatorHelper.getHASURL("getRCPProductList");
        var data = CommunicatorHelper.getDataForRequestRCPProductList(transactionId, appId, sourceId, stbHostMac, cableCardMac, smartCardSn);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createProductInfoStructure(response));
        });
    }

    Communicator.requestUserList = function(callbackFunction, transactionId, pageSize, pageIndex) {
        var url = CommunicatorHelper.getHASURL("getUserList");
        var data = CommunicatorHelper.getDataForRequestUserList(transactionId, pageSize, pageIndex);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createUserStructure(response));
        });
    }

    Communicator.requestAuthCode = function(callbackFunction, phoneNumber) {
        var url = CommunicatorHelper.getHASURL("requestAuthCode");
        var data = CommunicatorHelper.getDataForRequestAuthCode(phoneNumber);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(response);
        });
    }

    Communicator.requestRemoveUser = function(callbackFunction, userId) {
        var url = CommunicatorHelper.getHASURL("removeUser")
        var data = CommunicatorHelper.getDataForRequestRemoveUser(userId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(response);
        });
    }

    Communicator.requestWishList = function(callbackFunction, transactionId, assetProfile, pageSize, pageIndex, durationBack) {
        var url = CommunicatorHelper.getHASURL("getWishList");
        var data = CommunicatorHelper.getDataForRequestWishList(transactionId, assetProfile, pageSize, pageIndex, durationBack);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createWishItemStructure(response));
        });
    }

    Communicator.requestRemoveWishItem = function(callbackFunction, userId, assetId) {
        var url = CommunicatorHelper.getHASURL("removeWishItem");
        var data = CommunicatorHelper.getDataForRequestRemoveWishItem(userId, assetId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(response);
        });
    }

    Communicator.requestPurchasedProductList = function(callbackFunction, transactionId, purchaseLogProfile, productType, expiredLogStartTime, expiredLogEndTime, sortType, includeAdultCategory, excludeInvisible, pageSize, pageIndex) {
        var url = CommunicatorHelper.getHASURL("getPurchasedProductList");
        var data = CommunicatorHelper.getDataForRequestPurchasedProductList(transactionId, purchaseLogProfile, productType, expiredLogStartTime, expiredLogEndTime, sortType, includeAdultCategory, excludeInvisible, pageSize, pageIndex);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createPurchaseLogStructure(response));
        });
    }

    Communicator.requestPurchasedProductListForRecommendation = function(callbackFunction, purchaseLogProfile, productType, expiredLogStartTime, expiredLogEndTime, sortType, includeAdultCategory, excludeInvisible, pageSize, pageIndex) {
        var url = CommunicatorHelper.getHASURL("getPurchasedProductListForRecommendation");
        var data = CommunicatorHelper.getDataForRequestPurchasedProductListForRecommendation(purchaseLogProfile, productType, expiredLogStartTime, expiredLogEndTime, sortType, includeAdultCategory, excludeInvisible, pageSize, pageIndex);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createPurchaseLogStructure(response));
        });
    }
    Communicator.requestRecommendAssetBySubscriber = function(transactionId, callbackFunction, pageSize, startItemIndex, sortType, assetProfile, includeAdultCategory) {
        var url = CommunicatorHelper.getHASURL("recommendAssetBySubscriber");
        var data = CommunicatorHelper.getDataForRequestRecommendAssetBySubscriber(pageSize, startItemIndex, sortType, assetProfile, includeAdultCategory);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createAssetStructure(response));
        });
    }

    Communicator.requestDiscountCouponUseHistory = function(callbackFunction, transactionId) {
        var url = CommunicatorHelper.getHASURL("getDiscountCouponUseHistory");
        var data = CommunicatorHelper.getDataForRequestCouponUseHistory(transactionId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createDiscountCouponStructure(response));
        });
    }

    Communicator.requestContentGroupInfo = function(callbackFunction, contentGroupProfile, contentGroupId, uiComponentDomain, uiComponentId) {
        var url = CommunicatorHelper.getHASURL("getContentGroupInfo");
        var data = CommunicatorHelper.getDataForRequestContentGroupInfo(contentGroupProfile, contentGroupId, uiComponentDomain, uiComponentId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createContentGroupStructure(response));
        });
    }


    /**
     * 쿠폰 등록시에 couponProductID에 'PIN:'을 붙여주세요\
     * ex) Communicator.requestChargeCoupon(callback, 'PIN:' + couponProductID);
     * @param callbackFunction
     * @param couponProductId
     */
    Communicator.requestChargeCoupon = function(callbackFunction, transactionId, couponProductId) {
        var url = CommunicatorHelper.getHASURL("chargeCoupon");
        var data = CommunicatorHelper.getDataForRequestChargeCoupon(transactionId, couponProductId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(response);
        });
    }


    /**
     *
     * @param callbackFunction
     * @param categoryId
     * @param profile
     * @param requestItems 'daily' or 'weekly' or 'all'
     * @param pageSize
     * @param pageIndex
     * @constructor
     */
    Communicator.requestPopularityChart = function(callbackFunction, categoryId, profile, requestItems, pageSize, pageIndex) {
        var url = CommunicatorHelper.getHASURL("getPopularityChart");
        var data = CommunicatorHelper.getDataForRequestPopularityChart(categoryId, profile, requestItems, pageSize, pageIndex);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createPopularityStructure(response));
        });
    };

    Communicator.requestRecommendContentGroupByAssetId = function (callbackFunction, assetId, contentGroupProfile, recommendField, recommendFieldValue, pageSize, pageIndex, includeResultCategoryList) {
        var url = CommunicatorHelper.getHASURL("recommendContentGroupByAssetId");
        var data = CommunicatorHelper.getDataForRequestRecommendListByAssetId(assetId, contentGroupProfile, recommendField, recommendFieldValue, pageSize, pageIndex, includeResultCategoryList);
        requestByPOST(url, data, true, function(response) {
            response = StructureHelper.createResultCategoryStructure(response);
            callbackFunction(StructureHelper.createContentGroupStructure(response));
        });
    }

    Communicator.requestRecommendContentGroupByAssetIdUseStartItemIndex = function (callbackFunction, transactionId, assetId, contentGroupProfile, recommendField, recommendFieldValue, pageSize, startItemIndex) {
        var url = CommunicatorHelper.getHASURL("recommendContentGroupByAssetId");
        var data = CommunicatorHelper.getDataForRequestRecommendListByAssetIdUseStartItemIndex(assetId, contentGroupProfile, recommendField, recommendFieldValue, pageSize, startItemIndex);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function(response) {
            response = StructureHelper.createResultCategoryStructure(response);
            callbackFunction(StructureHelper.createContentGroupStructure(response));
        });
    }

    Communicator.requestRecommendContentGroupBySubscriber = function(callbackFunction, pageSize, pageIndex, sortType, contentGroupProfile, includeAdultCategory) {
        var url = CommunicatorHelper.getHASURL("recommendContentGroupBySubscriber");
        var data = CommunicatorHelper.getDataForRequestRecommendContentGroupBySubscriber(pageSize, pageIndex, sortType, contentGroupProfile, includeAdultCategory);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createContentGroupStructure(response));
        });
    }

    Communicator.requestContentGroupByAssetIdEx = function (callbackFunction, categoryId, assetId, sortType, pageSize, pageIndex, contentGroupProfile, includeAdultCategory) {
        var url = CommunicatorHelper.getHASURL("recommendContentGroupByAssetIdEx");
        var data = CommunicatorHelper.getDataForRequestRecommendListByAssetIdEx(categoryId, assetId, sortType, pageSize, pageIndex, contentGroupProfile, includeAdultCategory);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createContentGroupStructure(response));
        });
    };


    Communicator.requestDisablePurchaseLog = function(callbackFunction, purchaseEventId) {
        var url = CommunicatorHelper.getHASURL("disablePurchaseLog");
        var data = CommunicatorHelper.getDataForDisablePurchaseLog(purchaseEventId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(response);
        });
    };

    Communicator.requestDisableServiceLog = function(callbackFunction, assetId, productId, goodId) {
        var url = CommunicatorHelper.getHASURL("disableServiceLog");
        var data = CommunicatorHelper.getDataForDisableServiceLog(assetId, productId, goodId);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(response);
        });
    };

    Communicator.requestPurchaseRCPProduct = function(callbackFunction, appId, sourceId, stbHostMac, cableCardMac, smartCardSn, productId, price) {
        var url = CommunicatorHelper.getHASURL("purchaseRCPProduct");
        var data = CommunicatorHelper.getDataForPurchaseRCPProduct(appId, sourceId, stbHostMac, cableCardMac, smartCardSn, productId, price);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(response);
        });
    };

    Communicator.requestEpisodePeerListByContentGroupId = function(callbackFunction, contentGroupId, episodePeerProfile, sortType, pageSize, pageIndex, indexRotation) {
        var url = CommunicatorHelper.getHASURL("getEpisodePeerListByContentGroupId");
        var data = CommunicatorHelper.getDataForRequestEpisodePeerListByContentGroupId(contentGroupId, episodePeerProfile, sortType, pageSize, pageIndex, indexRotation);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createEpisodePeerStructure(response));
        });
    }

    Communicator.requestEpisodePeerListByContentGroupIdUseStartItemIndex = function(callbackFunction, contentGroupId, episodePeerProfile, sortType, pageSize, startItemIndex, indexRotation) {
        var url = CommunicatorHelper.getHASURL("getEpisodePeerListByContentGroupId");
        var data = CommunicatorHelper.getDataForRequestEpisodePeerListByContentGroupIdUseStartItemIndex(contentGroupId, episodePeerProfile, sortType, pageSize, startItemIndex, indexRotation);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createEpisodePeerStructure(response));
        });
    }

    Communicator.requestAssetListByEpisodePeerId = function(callbackFunction, transactionId, episodePeerId, assetProfile, sortType, pageIndex, pageSize) {
        var url = CommunicatorHelper.getHASURL("getAssetListByEpisodePeerId");
        var data = CommunicatorHelper.getDataForRequestAssetListByEpisodePeerId(transactionId, episodePeerId, assetProfile, sortType, pageIndex, pageSize);
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createAssetStructure(response));
        });
    }

    Communicator.requestSearchWordList = function(callbackFunction, transactionId, searchField, includeAdultCategory, searchKeyword, pageIndex, pageSize) {
        var url = CommunicatorHelper.getHASURL("getSearchWord");
        var data = CommunicatorHelper.getDataForRequestSearchWordList(searchField, includeAdultCategory, searchKeyword, pageIndex, pageSize);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestSearchContentGroup = function(callbackFunction, transactionId, contentGroupProfile, searchField, includeAdultCategory, searchKeyword, sortType, startItemIndex, pageSize) {
        var url = CommunicatorHelper.getHASURL("searchContentGroup");
        var data = CommunicatorHelper.getDataForRequestSearchContentGroup(contentGroupProfile, searchField, includeAdultCategory, searchKeyword, sortType, startItemIndex, pageSize);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function (response) {
            callbackFunction(StructureHelper.createSearchContentGroupStructure(response));
        });
    }

    Communicator.requestEventList = function(callbackFunction, transactionId, eventType, eventStatus, eventEnrollStatus, sortType, pageIndex, pageSize) {
        var url = CommunicatorHelper.getHASURL("getEventList");
        var data = CommunicatorHelper.getDataForRequestEventList(eventType, eventStatus, eventEnrollStatus, sortType, pageIndex, pageSize);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function (response) {
            callbackFunction(StructureHelper.createEventStructure(response));
        });
    };

    Communicator.requestBundleProductList = function(callbackFunction, transactionId, productProfile, startItemIndex, pageSize) {
        var url = CommunicatorHelper.getHASURL("getBundleProductList");
        var data = CommunicatorHelper.getDataForRequestBundleProductList(productProfile, startItemIndex, pageSize);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function (response) {
            callbackFunction(StructureHelper.createBundleProductStructure(response));
        });
    };

    Communicator.requestBundleAssetDetailList = function(callbackFunction, transactionId, productId, externalProductId, startItemIndex, pageSize) {
        var url = CommunicatorHelper.getHASURL("getBundleAssetDetailList");
        var data = CommunicatorHelper.getDataForRequestBundleAssetDetailList(productId, externalProductId, startItemIndex, pageSize);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function (response) {
            callbackFunction(StructureHelper.createAssetStructure(response));
        });
    };

    Communicator.requestEventWinnerList = function(callbackFunction, transactionId, eventId, sortType, pageIndex, pageSize) {
        var url = CommunicatorHelper.getHASURL("getEventWinnerList");
        var data = CommunicatorHelper.getDataForRequestEventWinnerList(eventId, sortType, pageIndex, pageSize);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function (response) {
            callbackFunction(StructureHelper.createBundleProductStructure(response));
        });
    }
    Communicator.requestProductInstruction = function(callbackFunction, transactionId, productId, goodId) {
        var url = CommunicatorHelper.getHASURL("getProductInstruction");
        var data = CommunicatorHelper.getDataForRequestProductInstruction(productId, goodId);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function (response) {
            callbackFunction(StructureHelper.createBundleProductStructure(response));
        });
    }

    Communicator.requestNotifyStartPlay = function(callbackFunction, assetId, categoryId, productId, goodId) {
        var url = CommunicatorHelper.getHASURL("notifyStartPlay");
         //@Query("uiComponentDomain") int uiComponentDomain , @Query("uiComponentId") int uiComponentId
        var data = CommunicatorHelper.getDataForRequestNotifyStartPlay(assetId, categoryId, productId, goodId);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestNotifyStopPlay = function(callbackFunction, assetId, playEventId, offset) {
        var url = CommunicatorHelper.getHASURL("notifyStopPlay");
        var data = CommunicatorHelper.getDataForRequestNotifyStopPlay(assetId, playEventId, offset);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }
    Communicator.requestSetReviewRating = function(callbackFunction, assetId, ratingValue) {
        var url = CommunicatorHelper.getHASURL("setReviewRating");
        var data = CommunicatorHelper.getDataForRequestSetReviewRating(assetId, ratingValue);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestContentGroupInfoByAssetID = function(callbackFunction, transactionId, assetId, contentGroupProfile) {
        var url = CommunicatorHelper.getHASURL("getContentGroupInfoByAssetId");
        var data = CommunicatorHelper.getDataForRequestContentGroupInfoByAssetID(transactionId, assetId, contentGroupProfile);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(StructureHelper.createContentGroupStructure(response));
        });
    }
    
    Communicator.requestGetLatestOffset = function(callbackFunction, assetId) {
        var url = CommunicatorHelper.getHASURL("getLatestOffset");
        var data = CommunicatorHelper.getDataForRequestGetLatestOffset(assetId);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }


    Communicator.requestPurchaseAssetEx2 = function(callbackFunction, assetId, categoryId, productId, goodId, price, piAgreement, discountCouponId, discountAmount) {
        var url = CommunicatorHelper.getHASURL("purchaseAssetEx2");
        var data = CommunicatorHelper.getDataForRequestPurchaseAssetEx2(assetId, categoryId, productId, goodId, price, piAgreement, discountCouponId, discountAmount);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestPurchaseByCoupon = function(callbackFunction, assetId, categoryId, productId, goodId, price, piAgreement) {
        var url = CommunicatorHelper.getHASURL("purchaseByCoupon");
        var data = CommunicatorHelper.getDataForRequestPurchaseByCoupon(assetId, categoryId, productId, goodId, price, piAgreement);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestPurchaseByPoint = function(callbackFunction, assetId, categoryId, productId, goodId, price, piAgreement) {
        var url = CommunicatorHelper.getHASURL("purchaseByPoint");
        var data = CommunicatorHelper.getDataForRequestPurchaseByPoint(assetId, categoryId, productId, goodId, price, piAgreement);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestPurchaseByPoint = function(callbackFunction, assetId, categoryId, productId, goodId, price, piAgreement) {
        var url = CommunicatorHelper.getHASURL("purchaseByPoint");
        var data = CommunicatorHelper.getDataForRequestPurchaseByPoint(assetId, categoryId, productId, goodId, price, piAgreement);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestPurchaseByComplexMethods = function(callbackFunction, assetId, categoryId, productId, goodId, price, piAgreement, pointPrice, couponPrice, mobilePrice, normalPrice) {
        var url = CommunicatorHelper.getHASURL("purchaseByComplexMethods");
        var data = CommunicatorHelper.getDataForRequestPurchaseByComplexMethods(assetId, categoryId, productId, goodId, price, piAgreement, pointPrice, couponPrice, mobilePrice, normalPrice);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestPurchaseProduct = function(callbackFunction, productId) {
        var url = CommunicatorHelper.getHASURL("purchaseProduct");
        var data = CommunicatorHelper.getDataForRequestPurchaseProduct(productId);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestPurchaseProductByPoint = function(callbackFunction, productId, price) {
        var url = CommunicatorHelper.getHASURL("purchaseProductByPoint");
        var data = CommunicatorHelper.getDataForRequestPurchaseProductByPoint(productId, price);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestPurchaseProductByCoupon2 = function(callbackFunction, productId, price) {
        var url = CommunicatorHelper.getHASURL("purchaseProductByCoupon2");
        var data = CommunicatorHelper.getDataForRequestPurchaseProductByCoupon2(productId, price);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestPurchaseProductByComplexMethods = function(callbackFunction, productId, price, pointPrice, couponPrice, mobilePrice, normalPrice) {
        var url = CommunicatorHelper.getHASURL("purchaseProductByComplexMethods");
        var data = CommunicatorHelper.getDataForRequestPurchaseProductByComplexMethods(productId, price, pointPrice, couponPrice, mobilePrice, normalPrice);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestEventInfo = function(callbackFunction, eventId) {
        var url = CommunicatorHelper.getHASURL("getEventInfo");
        var data = CommunicatorHelper.getDataForRequestEventInfo(eventId);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(StructureHelper.createEventStructure(response));
        });
    }

    Communicator.requestExtSvcPhoneList = function(callbackFunction, extContentDomainId, where) {
        var url = CommunicatorHelper.getHASURL("getExtSvcPhoneList");
        var data = CommunicatorHelper.getDataForRequestExtSvcPhoneList(extContentDomainId, where);
        requestByPOST(url, data, false, function (response) {
            callbackFunction(StructureHelper.createPhoneStructure(response));
        });
    }

    Communicator.requestExtPhoneSvc = function(callbackFunction, extContentDomainId, extContentType, extContentId, phoneNumber, svcType) {
        var url = CommunicatorHelper.getHASURL("requestExtPhoneSvc");
        var data = CommunicatorHelper.getDataForRequestExtPhoneSvc(extContentDomainId, extContentType, extContentId, phoneNumber, svcType);
        requestByPOST(url, data, false, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestDeleteExtSvcPhone = function(callbackFunction, extContentDomainId, phoneNumber) {
        var url = CommunicatorHelper.getHASURL("deleteExtSvcPhone");
        var data = CommunicatorHelper.getDataForRequestDeleteExtSvcPhone(extContentDomainId, phoneNumber);
        requestByPOST(url, data, false, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestSetExtSvcSource = function(callbackFunction, extContentDomainId, extContentType, extContentId, where) {
        var url = CommunicatorHelper.getHASURL("setExtSvcSource");
        var data = CommunicatorHelper.getDataForRequestSetExtSvcSource(extContentDomainId, extContentType, extContentId, where);
        requestByPOST(url, data, false, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestGetExtContentInfo = function(callbackFunction, extContentDomainId, extContentType, extContentId) {
        var url = CommunicatorHelper.getHASURL("getExtContentInfo");
        var data = CommunicatorHelper.getDataForRequestGetExtContentInfo(extContentDomainId, extContentType, extContentId);
        requestByPOST(url, data, false, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestGetBundleProductInfo = function(callbackFunction, transactionId, productId, productProfile) {
        var url = CommunicatorHelper.getHASURL("getBundleProductInfo");
        var data = CommunicatorHelper.getDataForRequestGetBundleProductInfo(productId, productProfile);
        data.transactionId = transactionId;
        requestByPOST(url, data, false, function (response) {
            callbackFunction(StructureHelper.createBundleProductStructure(response));
        });
    }

    Communicator.requestAvailablePaymentType = function(callbackFunction) {
        var url = CommunicatorHelper.getHASURL("getAvailablePaymentType");
        var data = CommunicatorHelper.getDataForRequestAvailablePaymentType();
        requestByPOST(url, data, false, function (response) {
            callbackFunction(response);
        });
    }
    Communicator.requestSVODChannelConfirmByCoupon = function(callbackFunction, transactionId, couponProductId, productCode)	{
    	var url = CommunicatorHelper.getHASURL("svodChannelConfirmByCoupon");
        var data = CommunicatorHelper.getDataForRequestSVODChannelConfirmByCoupon(transactionId, couponProductId, productCode);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestStartPurchaseBySmartPhone = function(callbackFunction, mobileNumber, assetId, productId, goodId, listPrice, price)	{
        var url = CommunicatorHelper.getHASURL("startPurchaseBySmartPhone");
        var data = CommunicatorHelper.getDataForRequestStartPurchaseBySmartPhone(mobileNumber, assetId, productId, goodId, listPrice, price);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestConfirmPurchaseBySmartPhone = function(callbackFunction, purchaseSessionId)	{
        var url = CommunicatorHelper.getHASURL("confirmPurchaseBySmartPhone");
        var data = CommunicatorHelper.getDataForRequestConfirmPurchaseBySmartPhone(purchaseSessionId);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestCancelPurchaseBySmartPhone = function(callbackFunction, purchaseSessionI)	{
        var url = CommunicatorHelper.getHASURL("cancelPurchaseBySmartPhone");
        var data = CommunicatorHelper.getDataForRequestCancelPurchaseBySmartPhone(purchaseSessionI);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestCheckAdultOption = function(callbackFunction)	{
        var url = CommunicatorHelper.getHASURL("getCheckAdultOption");
        var data = CommunicatorHelper.getDataForRequestCheckAdultOption();
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestGetProductInfo = function(callbackFunction, productId, goodId, productProfile) {
        var url = CommunicatorHelper.getHASURL("getProductInfo");
        var data = CommunicatorHelper.getDataForRequestGetProductInfo(productId, goodId, productProfile);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }


    Communicator.requestApplicableCouponAmount = function(callbackFunction, productPrice) {
        var url = CommunicatorHelper.getHASURL("checkApplicableCouponAmount");
        var data = CommunicatorHelper.getDataForRequestApplicableCouponAmount(productPrice);
        requestByPOST(url, data, false, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestReportClientPlayError = function(callbackFunction, errorCode, categoryId) {
        var url = CommunicatorHelper.getHASURL("reportClientPlayError");
        var data = CommunicatorHelper.getDataForRequestReportClientPlayError(errorCode, categoryId);
        requestByPOST(url, data, true, function (response) {
            callbackFunction(response);
        });
    }

    Communicator.requestWeatherInfo = function(callbackFunction, socode) {
        var url = CommunicatorHelper.getWeatherAPIURL("minutely");
        var data = CommunicatorHelper.getDataForRequestWeatherInfo(socode);
        requestByGET(url, data, true, function (response) {
            callbackFunction(StructureHelper.createWeather(response));
        });
    }

    Communicator.requestWeatherInfoHourly = function (callbackFunction, socode) {
        var url = CommunicatorHelper.getWeatherAPIURL("hourly");
        var data = CommunicatorHelper.getDataForRequestWeatherInfoHourly(socode);
        requestByGET(url, data, true, function (response) {
            callbackFunction(StructureHelper.createWeather(response));
        });
    }

    Communicator.requestHomeMenu = function(callbackFunction) {
        var url = CommunicatorHelper.getCUPSURL("homeMenu");
        var data = CommunicatorHelper.getDataForRequestHomeMenu();
        requestByGET(url, data, true, function(response){
            callbackFunction(StructureHelper.createHomeMenu(response));
        });
    };

    Communicator.requestUIComponentList = function(callbackFunction, transactionId, menuExternalId, pageSize) {
        var url = CommunicatorHelper.getHASURL("menu/getUIComponentList");
        var data = CommunicatorHelper.getDataForRequestUIComponentList(menuExternalId, pageSize);
        data.transactionId = transactionId;
        requestByPOST(url, data, true, function(response) {
            callbackFunction(StructureHelper.createUIComponentStructure(response));
        });
    };

    /*
        @GET("/getSessionManagerAddress.json?version=1")
        void requestSessionManagerAddress(@Query("terminalKey") String terminalKey , Callback<SessionManagerAddressResult> callback);

        @GET("/demandVodRequestId.json?version=1")
        void requestDemandVodRequestId(@Query("terminalKey") String terminalKey , @Query("assetId") String assetId , @Query("categoryId") int categoryId, @Query("soId") int soId , @Query("offset") long offset , Callback<DemandVodRequestIdResult> callback);

        @GET("/demandVodRequestId.json?version=1")
        DemandVodRequestIdResult requestDemandVodRequestId(@Query("terminalKey") String terminalKey , @Query("assetId") String assetId , @Query("categoryId") int categoryId, @Query("soId") int soId , @Query("offset") long offset);


        @GET("/purchaseAsset.json?version=2")
        void purchaseAsset(@Query("terminalKey") String terminalKey , @Query("assetId") String assetId , @Query("categoryId") int categoryId ,@Query("productId") String productId , @Query("goodId") String goodId , @Query("purchaseTime") String purchaseTime , @Query("price") int price ,@Query("uiComponentDomain") int uiComponentDomain , @Query("uiComponentId") int uiComponentId, Callback<ResponseResult> callback);


        @GET("/purchaseAsset.json?version=2")
        ResponseResult purchaseAsset(@Query("terminalKey") String terminalKey , @Query("assetId") String assetId , @Query("categoryId") int categoryId ,@Query("productId") String productId , @Query("goodId") String goodId , @Query("purchaseTime") String purchaseTime , @Query("price") int price ,@Query("uiComponentDomain") int uiComponentDomain , @Query("uiComponentId") int uiComponentId , @Query("piAgreement") int piAgreement);

        @GET("/purchaseAsset.json?version=2")
        ResponseResult purchaseAsset(@Query("terminalKey") String terminalKey , @Query("assetId") String assetId , @Query("categoryId") int categoryId ,@Query("productId") String productId , @Query("goodId") String goodId , @Query("purchaseTime") String purchaseTime , @Query("price") int price ,@Query("uiComponentDomain") int uiComponentDomain , @Query("uiComponentId") int uiComponentId );


        @GET("/requestPurchaseByMobile.json?version=1")
        void requestPurchaseByMobile(@Query("terminalKey")String terminalKey, @Query("domainId") String domainId, @Query("carrier")String carrier, @Query("mobileNumber")String mobileNumber, @Query("socialNumber")String socialNumber, @Query("assetId")String assetId, @Query("productId")String productId, @Query("goodId")String goodId, @Query("price")int price, Callback<RequestMobilePurchaseResult> callback);

        @GET("/purchaseByMobile.json?version=2")
        void purchaseByMobile(@Query("terminalKey")String terminalKey, @Query("domainId")String domainId, @Query("paymentSessionId")String paymentSessionId, @Query("approvalNumber") String approvalNumber,@Query("assetId")String assetId,@Query("productId") String productId, @Query("goodId") String goodId,@Query("price") int price,@Query("categoryId") int categoryId,@Query("uiComponentDomain") int uiComponentDomain,@Query("uiComponentId") int uiComponentId, Callback<ResponseResult> callback);*/

    Communicator.getImageFileUrl = function(_imageFileName) {
        var imageFileUrl = '';
        if(_imageFileName != null) {
            var temp = _imageFileName.split(':');
            temp[1] = '//'+CCAInfoManager.getSecurityHASIP();
            for(var i = 0; i < temp.length; i++){
                imageFileUrl += temp[i];
                if(i != temp.length-1) {
                    imageFileUrl += ":";
                }
            }
        }
        return imageFileUrl;
    };
	return Communicator;
});