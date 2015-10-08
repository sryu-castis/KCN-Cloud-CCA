define(["service/CCAInfoManager", "service/STBInfoManager", "service/CCAStateManager",
        'helper/DateHelper', "helper/WeatherHelper", "helper/UIComponentHelper"],
    function (CCAInfoManager, STBInfoManager, CCAStateManager, DateHelper, WeatherHelper, UIComponentHelper) {
        var CommunicatorHelper = {};
        var domainId = "CnM";
        var transactionId = 'cui';
        var skpAPIAppID = "87a03ca2-4505-388a-92c5-29fe880319b8";// "3e7027e9-6875-3df2-a484-7263bec45bd7"
        var homeMenuDefaultSo = 998;

        CommunicatorHelper.setTransactionID = function (_transactionId) {
            transactionId = _transactionId;
        }

        CommunicatorHelper.getTransactionID = function () {
            return transactionId;
        }

        CommunicatorHelper.getHASURL = function (apiName) {
            var ip = CCAInfoManager.getHASIP();
            var port = CCAInfoManager.getHASPort();
            var api = apiName + ".json";
            return 'http://' + ip + ':' + port + '/HApplicationServer/' + api
        };

        CommunicatorHelper.getCUPSURL = function(apiName){
            var cupsIP = CCAInfoManager.getCUPSIP();
            var cupsPort = CCAInfoManager.getCUPSPort();
            var api = apiName;
            return 'http://' + cupsIP + ':' + cupsPort + '/' + api
        };

        CommunicatorHelper.getWeatherAPIURL = function (apiName) {
            var ip = CCAInfoManager.getWeatherIP();
            var port = CCAInfoManager.getWeatherPort();
            return 'http://' + ip + ':' + port + "/weather/current/" + apiName;
        };

        /*CommunicatorHelper.getHASDefaultParameter = function(version, _transactionId) {
         var version = version ? version : 1;
         var transactionId = transactionId;

         return { version : version, transactionId:transactionId };
         };*/
        CommunicatorHelper.getHASDefaultParameter = function (version, _transactionId) {
            var version = version ? version : 1;
            var requestID = _transactionId ? _transactionId : transactionId

            return {version: version, transactionId: requestID};
        };

        CommunicatorHelper.getDataForRequestTerminalKey = function () {
            var data = this.getHASDefaultParameter();
            data.terminalId = STBInfoManager.getMacAddress();
            data.hardwareModel = STBInfoManager.getModelName();
            data.clientVersion = CCAInfoManager.getVersion();

            return data;
        };

        CommunicatorHelper.getDataForRequestCategoryList = function (categoryProfile, categoryId, depth) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.categoryProfile = categoryProfile;
            data.categoryId = categoryId;
            data.depth = depth;
            data.traverseType = "DFS";

            return data;
        };

        CommunicatorHelper.getDataForRequestLinkCategoryList = function (categoryProfile, linkCategoryId, depth) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.categoryProfile = categoryProfile;
            data.linkCategoryId = linkCategoryId;
            data.depth = depth;
            data.traverseType = "DFS";
            //soId.soId = "";

            return data;
        };

        CommunicatorHelper.getDataForRequestCouponBalance2 = function () {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;
            /*data.specifySubscriberId = "";
             data.subscriberId = "";*/

            return data;
        };

        CommunicatorHelper.getDataForRequestTVPoint = function () {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;

            return data;
        }

        CommunicatorHelper.getDataForRequestContentGroupList = function (categoryId, sortType, pageSize, pageIndex) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.categoryId = categoryId;
            //@미리보기에서는 프로파일 1로 충분
            data.contentGroupProfile = 2;
            data.sortType = sortType;
            //startItemIndex를 사용할경우에대한 처리 필요할듯
            if (pageSize != null && pageIndex != null) {
                data.pageSize = pageSize;
                data.pageIndex = pageIndex;
            }

            return data;
        };

        CommunicatorHelper.getDataForRequestContentGroupListUseStartItemIndex = function (categoryId, sortType, startItemIndex, pageSize, indexRotation) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.categoryId = categoryId;
            //@미리보기에서는 프로파일 1로 충분
            data.contentGroupProfile = 2;
            data.sortType = sortType;
            if (startItemIndex != null) {
                data.startItemIndex = startItemIndex;
            }
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (indexRotation != null) {
                data.indexRotation = indexRotation;
            }

            return data;
        };

        CommunicatorHelper.getDataForRequestAssetInfo = function (assetId, assetProfile) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.assetProfile = assetProfile;

            return data;
        };


        CommunicatorHelper.getDataForRequestAssetListByContentGroupId = function (_transactionId, contentGroupId, assetProfile, sortType, contentType, pageIndex, pageSize) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.contentGroupId = contentGroupId;
            data.assetProfile = assetProfile;
            data.sortType = sortType;
            data.contentType = contentType;
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }

            return data;
        }

        CommunicatorHelper.getDataForRequestAssetListByCategoryID = function (categoryId, assetProfile, sortType, pageIndex, pageSize) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.categoryId = categoryId;
            data.assetProfile = assetProfile;
            data.sortType = sortType;
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }
            return data;
        };

        CommunicatorHelper.getDataForRequestAssetListByContentGroupIdUseStartItemIndex = function (contentGroupId, assetProfile, sortType, contentType, startItemIndex, pageSize, indexRotation) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.contentGroupId = contentGroupId;
            data.assetProfile = assetProfile;
            data.sortType = sortType;
            data.contentType = contentType;
            if (startItemIndex != null) {
                data.startItemIndex = startItemIndex;
            }
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (indexRotation != null) {
                data.indexRotation = indexRotation;
            }
            return data;
        }

        CommunicatorHelper.getDataForRequestContentGroupByCategoryId = function (categoryId, contentGroupProfile, pageSize, pageIndex) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.categoryId = categoryId;
            data.contentGroupProfile = contentGroupProfile;
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }
            return data;
        };

        CommunicatorHelper.getDataForRequestAutopayCouponProductList = function (_transactionId) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;

            return data;
        };

        CommunicatorHelper.getDataForRequestSubscribeAutopayCouponProduct = function (couponProductId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;
            data.couponProductId = couponProductId;

            return data;
        };

        CommunicatorHelper.getDataForRequestCouponProductList = function (_transactionId) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;

            return data;
        };

        CommunicatorHelper.getDataForRequestCouponUseHistory = function (_transactionId) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;

            return data;
        };


        CommunicatorHelper.getDataForRequestServiceLogList = function (_transactionId, serviceLogProfile, startTime, endTime, productType, assetDuplicationShowMethod, pageSize, pageIndex) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.serviceLogProfile = serviceLogProfile;
            data.startTime = startTime;
            data.endTime = endTime;
            data.productType = productType;
            data.assetDuplicationShowMethod = assetDuplicationShowMethod;
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }
            return data;
        }


        CommunicatorHelper.getDataForRequestRCPProductList = function (_transactionId, appId, sourceId, stbHostMac, cableCardMac, smartCardSn) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.appId = appId;
            data.sourceId = sourceId;
            data.stbHostMac = stbHostMac;
            data.cableCardMac = cableCardMac;
            data.smartCardSn = smartCardSn;

            return data;
        }

        CommunicatorHelper.getDataForRequestUserList = function (_transactionId, pageSize, pageIndex) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }
            return data;
        };

        CommunicatorHelper.getDataForRequestAuthCode = function (phoneNumber) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;
            data.phoneNumber = phoneNumber;
            return data;
        };

        CommunicatorHelper.getDataForRequestRemoveUser = function (userId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;
            data.userId = userId;
            return data;
        };

        CommunicatorHelper.getDataForRequestWishList = function (_transactionId, assetProfile, pageSize, pageIndex, durationBack) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetProfile = assetProfile;
            if (durationBack != null) {
                data.durationBack = durationBack;
            }
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }
            return data;
        };

        CommunicatorHelper.getDataForRequestRemoveWishItem = function (userId, assetId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;
            data.userId = userId;
            data.assetId = assetId;
            return data;
        };

        CommunicatorHelper.getDataForRequestPurchasedProductList = function (_transactionId, purchaseLogProfile, productType, expiredLogStartTime, expiredLogEndTime, sortType, includeAdultCategory, excludeInvisible, pageSize, pageIndex) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.purchaseLogProfile = purchaseLogProfile;

            if (expiredLogStartTime != null) {
                data.expiredLogStartTime = expiredLogStartTime;
            }
            if (expiredLogEndTime != null) {
                data.expiredLogEndTime = expiredLogEndTime;
            }
            if (productType != null) {
                data.productType = productType;
            }
            if (sortType != null) {
                data.sortType = sortType;
            }
            if (includeAdultCategory != null) {
                data.includeAdultCategory = includeAdultCategory;
            }
            if (excludeInvisible != null) {
                data.excludeInvisible = excludeInvisible;
            }
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }
            return data;
        }

        CommunicatorHelper.getDataForRequestPurchasedProductListForRecommendation = function (purchaseLogProfile, productType, expiredLogStartTime, expiredLogEndTime, sortType, includeAdultCategory, excludeInvisible, pageSize, pageIndex) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.purchaseLogProfile = purchaseLogProfile;

            if (expiredLogStartTime != null) {
                data.expiredLogStartTime = expiredLogStartTime;
            }
            if (expiredLogEndTime != null) {
                data.expiredLogEndTime = expiredLogEndTime;
            }
            if (productType != null) {
                data.productType = productType;
            }
            if (sortType != null) {
                data.sortType = sortType;
            }
            if (includeAdultCategory != null) {
                data.includeAdultCategory = includeAdultCategory;
            }
            if (excludeInvisible != null) {
                data.excludeInvisible = excludeInvisible;
            }
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }
            return data;
        }

        CommunicatorHelper.getDataForRequestContentGroupInfo = function (contentGroupProfile, contentGroupId, uiComponentDomain, uiComponentId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.contentGroupProfile = contentGroupProfile;
            data.contentGroupId = contentGroupId;
            if (uiComponentDomain != null) {
                data.uiComponentDomain = uiComponentDomain;
            }
            if (uiComponentId != null) {
                data.uiComponentId = uiComponentId;
            }

            return data;
        };

        CommunicatorHelper.getDataForRequestChargeCoupon = function (_transactionId, couponProductId) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;
            data.couponProductId = couponProductId;

            return data;
        };

        CommunicatorHelper.getDataForRequestPopularityChart = function (categoryId, profile, requestItems, pageSize, pageIndex) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.categoryId = categoryId;
            data.profile = profile;
            data.requestItems = requestItems;
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }

            return data;
        };

        CommunicatorHelper.getDataForRequestRecommendListByAssetId = function (assetId, contentGroupProfile, recommendField, recommendFieldValue, pageSize, pageIndex, includeResultCategoryList) {
            var data = this.getHASDefaultParameter(1, 100);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.contentGroupProfile = contentGroupProfile;
            data.recommendField = recommendField;
            data.pageSize = 6;
            if (recommendFieldValue != null && recommendFieldValue.length > 1) {
                data.recommendFieldValue = recommendFieldValue;
            }
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }
            if (includeResultCategoryList != null) {
                data.includeResultCategoryList = includeResultCategoryList;
            }

            return data;
        };

        CommunicatorHelper.getDataForRequestRecommendListByAssetIdUseStartItemIndex = function (assetId, contentGroupProfile, recommendField, recommendFieldValue, pageSize, startItemIndex) {
            var data = this.getHASDefaultParameter(1, 100);

            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.contentGroupProfile = contentGroupProfile;
            data.recommendField = recommendField;
            data.pageSize = 6;
            if (recommendFieldValue != undefined && recommendFieldValue != null) {
                data.recommendFieldValue = recommendFieldValue;
            }
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (startItemIndex != null) {
                data.startItemIndex = startItemIndex;
            }

            return data;
        };

        CommunicatorHelper.getDataForRequestRecommendListByAssetIdEx = function (categoryId, assetId, sortType, pageSize, pageIndex, contentGroupProfile, includeAdultCategory) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.categoryId = categoryId;
            data.assetId = assetId;
            data.sortType = sortType;
            data.pageSize = pageSize;
            data.pageIndex = pageIndex;
            data.contentGroupProfile = contentGroupProfile;
            data.includeAdultCategory = includeAdultCategory;

            return data;
        };

        CommunicatorHelper.getDataForRequestRecommendAssetBySubscriber = function (pageSize, startItemIndex, sortType, assetProfile, includeAdultCategory) {
            var data = this.getHASDefaultParameter();
            data.transactionId = 11;
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.pageSize = pageSize;
            data.startItemIndex = startItemIndex;
            data.sortType = sortType;
            data.assetProfile = assetProfile;
            data.includeAdultCategory = includeAdultCategory;

            return data;
        };

        CommunicatorHelper.getDataForRequestRecommendContentGroupBySubscriber = function (pageSize, pageIndex, sortType, contentGroupProfile, includeAdultCategory) {
            var data = this.getHASDefaultParameter();
            data.transactionId = 11;
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.pageSize = pageSize;
            data.pageIndex = pageIndex;
            data.sortType = sortType;
            data.contentGroupProfile = contentGroupProfile;
            data.includeAdultCategory = includeAdultCategory;

            return data;
        };

        CommunicatorHelper.getDataForDisablePurchaseLog = function (purchaseEventId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.purchaseEventId = purchaseEventId;

            return data;
        };

        CommunicatorHelper.getDataForDisableServiceLog = function (assetId, productId, goodId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.productId = productId;
            data.goodId = goodId;

            return data;
        };

        CommunicatorHelper.getDataForPurchaseRCPProduct = function (appId, sourceId, stbHostMac, cableCardMac, smartCardSn, productId, price) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.appId = appId;
            data.sourceId = sourceId;
            data.stbHostMac = stbHostMac;
            data.cableCardMac = cableCardMac;
            data.smartCardSn = smartCardSn;
            data.productId = productId;
            data.price = price;
            return data;
        };

        CommunicatorHelper.getDataForRequestEpisodePeerListByContentGroupId = function (contentGroupId, episodePeerProfile, sortType, pageSize, pageIndex, indexRotation) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.contentGroupId = contentGroupId;
            data.episodePeerProfile = episodePeerProfile;
            data.sortType = sortType;

            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }
            if (indexRotation != null) {
                data.indexRotation = indexRotation;
            }

            return data;
        };

        CommunicatorHelper.getDataForRequestEpisodePeerListByContentGroupIdUseStartItemIndex = function (contentGroupId, episodePeerProfile, sortType, pageSize, startItemIndex, indexRotation) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.contentGroupId = contentGroupId;
            data.episodePeerProfile = episodePeerProfile;
            data.sortType = sortType;
            data.pageSize = pageSize;
            data.startItemIndex = startItemIndex;

            if (indexRotation != null) {
                data.indexRotation = indexRotation;
            }

            return data;
        };


        CommunicatorHelper.getDataForRequestAssetListByEpisodePeerId = function (_transactionId, episodePeerId, assetProfile, sortType, pageIndex, pageSize) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.episodePeerId = episodePeerId;
            data.assetProfile = assetProfile;
            data.sortType = sortType;
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            if (pageIndex != null) {
                data.pageIndex = pageIndex;
            }

            return data;
        }

        CommunicatorHelper.getDataForRequestSearchWordList = function (searchField, includeAdultCategory, searchKeyword, pageIndex, pageSize) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.searchField = searchField;
            data.includeAdultCategory = includeAdultCategory;
            data.searchKeyword = searchKeyword;
            data.pageIndex = pageIndex;
            data.pageSize = pageSize;

            return data;
        };

        CommunicatorHelper.getDataForRequestSearchContentGroup = function (contentGroupProfile, searchField, includeAdultCategory, searchKeyword, sortType, startItemIndex, pageSize) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.contentGroupProfile = contentGroupProfile,
                data.searchField = searchField;
            data.includeAdultCategory = includeAdultCategory;
            data.searchKeyword = searchKeyword;
            data.sortType = sortType,
                data.startItemIndex = startItemIndex;
            data.pageSize = pageSize;

            return data;
        };

        CommunicatorHelper.getDataForRequestEventList = function (eventType, eventStatus, eventEnrollStatus, sortType, pageIndex, pageSize) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.eventType = eventType;
            data.eventStatus = eventStatus;
            data.eventEnrollStatus = eventEnrollStatus;
            data.sortType = sortType;
            data.pageIndex = pageIndex;
            data.pageSize = pageSize;

            return data;
        };

        CommunicatorHelper.getDataForRequestBundleProductList = function (productProfile, startItemIndex, pageSize) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.productProfile = productProfile;
            data.startItemIndex = startItemIndex;
            data.pageSize = pageSize;

            return data;
        };

        CommunicatorHelper.getDataForRequestBundleAssetDetailList = function (productId, externalProductId, startItemIndex, pageSize) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            if (productId != undefined) {
                data.productId = productId;
            }
            ;
            if (externalProductId != undefined) {
                data.externaProductId = externalProductId;
            }
            ;
            data.startItemIndex = startItemIndex;
            data.pageSize = pageSize;

            return data;
        };

        CommunicatorHelper.getDataForRequestEventWinnerList = function (eventId, sortType, pageIndex, pageSize) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.eventId = eventId;
            data.sortType = sortType;
            data.pageIndex = pageIndex;
            data.pageSize = pageSize;

            return data;
        };
        CommunicatorHelper.getDataForRequestProductInstruction = function (productId, goodId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.productId = productId;
            data.goodId = goodId;

            return data;
        };

        CommunicatorHelper.getDataForRequestNotifyStartPlay = function (assetId, categoryId, productId, goodId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.categoryId = categoryId;
            data.productId = productId;
            data.goodId = goodId;

            return data;
        };

        CommunicatorHelper.getDataForRequestNotifyStopPlay = function (assetId, playEventId, offset) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.playEventId = playEventId;
            data.offset = offset;

            return data;
        };
        CommunicatorHelper.getDataForRequestSetReviewRating = function (assetId, ratingValue) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.ratingValue = ratingValue;

            return data;
        }

        CommunicatorHelper.getDataForRequestContentGroupInfoByAssetID = function (_transactionId, assetId, contentGroupProfile) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.contentGroupProfile = contentGroupProfile;

            return data;
        };
        CommunicatorHelper.getDataForRequestGetLatestOffset = function (assetId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;

            return data;

        }

        CommunicatorHelper.getDataForRequestPurchaseAssetEx2 = function (assetId, categoryId, productId, goodId, price, piAgreement, discountCouponId, discountAmount) {
            var data = this.getHASDefaultParameter(2);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.categoryId = categoryId;
            data.productId = productId;
            data.goodId = goodId;
            data.price = price;
            data.piAgreement = piAgreement;
            if (discountAmount != null) {
                data.discountAmount = discountAmount;
            }
            if (discountCouponId != null) {
                data.discountCouponId = discountCouponId;
            }

            getParameterForPurchase(data);

            return data;
        }

        CommunicatorHelper.getDataForRequestPurchaseByCoupon = function (assetId, categoryId, productId, goodId, price, piAgreement) {
            var data = this.getHASDefaultParameter(2);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.categoryId = categoryId;
            data.productId = productId;
            data.goodId = goodId;
            data.price = price;
            data.piAgreement = piAgreement;

            getParameterForPurchase(data);

            return data;
        }

        CommunicatorHelper.getDataForRequestPurchaseByPoint = function (assetId, categoryId, productId, goodId, price, piAgreement) {
            var data = this.getHASDefaultParameter(2);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.categoryId = categoryId;
            data.productId = productId;
            data.goodId = goodId;
            data.price = price;
            data.piAgreement = piAgreement;

            getParameterForPurchase(data);

            return data;
        }
        CommunicatorHelper.getDataForRequestPurchaseByComplexMethods = function (assetId, categoryId, productId, goodId, price, piAgreement, pointPrice, couponPrice, mobilePrice, normalPrice) {
            var data = this.getHASDefaultParameter(2);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.assetId = assetId;
            data.categoryId = categoryId;
            data.productId = productId;
            data.goodId = goodId;
            data.price = price;
            data.piAgreement = piAgreement;
            data.pointPrice = pointPrice;
            data.couponPrice = couponPrice;
            data.mobilePrice = mobilePrice;
            data.normalPrice = normalPrice;

            getParameterForPurchase(data);

            return data;
        }

        CommunicatorHelper.getDataForRequestPurchaseProduct = function (productId) {
            var data = this.getHASDefaultParameter(2);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.productId = productId;

            getParameterForPurchase(data);

            return data;
        }

        CommunicatorHelper.getDataForRequestPurchaseProductByPoint = function (productId, price) {
            var data = this.getHASDefaultParameter(2);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.productId = productId;
            data.price = price;

            getParameterForPurchase(data);

            return data;
        }

        CommunicatorHelper.getDataForRequestPurchaseProductByCoupon2 = function (productId, price) {
            var data = this.getHASDefaultParameter(2);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.productId = productId;
            data.price = price;

            getParameterForPurchase(data);

            return data;
        }

        CommunicatorHelper.getDataForRequestPurchaseProductByComplexMethods = function (productId, price, pointPrice, couponPrice, mobilePrice, normalPrice) {
            var data = this.getHASDefaultParameter(2);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.productId = productId;
            data.price = price;
            data.pointPrice = pointPrice;
            data.couponPrice = couponPrice;
            data.mobilePrice = mobilePrice;
            data.normalPrice = normalPrice;

            getParameterForPurchase(data);

            return data;
        }

        CommunicatorHelper.getDataForRequestEventInfo = function (eventId) {
            var data = this.getHASDefaultParameter(1);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.eventId = eventId;

            return data;
        }


        function getParameterForPurchase(data) {
            data.domainId = domainId;
            data.purchaseTime = getCurrentTime();

            var entryContext = CCAStateManager.getLastUiDomainComponentEntryContext();
            if (entryContext != null) {
                data.uiComponentDomain = entryContext.uiDomainID;
                if (data.uiComponentDomain == UIComponentHelper.UIDomainID.CATEGORY && data.categoryId && CCAStateManager.isEpisodePeerContentPurchase()) {
                    data.uiComponentId = data.categoryId;
                } else {
                    data.uiComponentId = entryContext.uiComponentID;
                }
            } else {
                data.uiComponentDomain = UIComponentHelper.UIDomainID.CATEGORY;
                if (data.categoryId) {
                    data.uiComponentId = data.categoryId;
                } else {
                    data.uiComponentId = 2;
                }
            }
        }

        function getCurrentTime() {
            return DateHelper.getCurrentTime();
        }

        CommunicatorHelper.getDataForRequestExtSvcPhoneList = function (extContentDomainId, where) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.extContentDomainId = extContentDomainId;
            data.where = where;

            return data;
        };

        CommunicatorHelper.getDataForRequestExtPhoneSvc = function (extContentDomainId, extContentType, extContentId, phoneNumber, svcType) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.extContentDomainId = extContentDomainId;
            data.extContentType = extContentType;
            data.extContentId = extContentId;
            data.phoneNumber = phoneNumber;
            data.svcType = svcType;

            return data;
        };

        CommunicatorHelper.getDataForRequestDeleteExtSvcPhone = function (extContentDomainId, phoneNumber) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.extContentDomainId = extContentDomainId;
            data.phoneNumber = phoneNumber;

            return data;
        };

        CommunicatorHelper.getDataForRequestSetExtSvcSource = function (extContentDomainId, extContentType, extContentId, where) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.extContentDomainId = extContentDomainId;
            data.extContentType = extContentType;
            data.extContentId = extContentId;
            data.where = where;

            return data;
        };

        CommunicatorHelper.getDataForRequestGetExtContentInfo = function (extContentDomainId, extContentType, extContentId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.extContentDomainId = extContentDomainId;
            data.extContentType = extContentType;
            data.extContentId = extContentId;

            return data;
        };

        CommunicatorHelper.getDataForRequestGetBundleProductInfo = function (productId, productProfile) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.productId = productId;
            data.productProfile = productProfile;

            return data;
        };

        CommunicatorHelper.getDataForRequestAvailablePaymentType = function () {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.domainId = domainId;

            return data;
        };

        CommunicatorHelper.getDataForRequestSVODChannelConfirmByCoupon = function (_transactionId, couponProductId, productCode) {
            var data = this.getHASDefaultParameter(1, _transactionId);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.pinNo = couponProductId;
            data.prodCode = productCode;
            data.domainId = domainId;

            return data;
        }

        CommunicatorHelper.getDataForRequestStartPurchaseBySmartPhone = function (mobileNumber, assetId, productId, goodId, listPrice, price) {
            var data = this.getHASDefaultParameter(2);
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.mobileNumber = mobileNumber;
            data.assetId = assetId;
            data.productId = productId;
            data.goodId = goodId;
            data.listPrice = listPrice;
            data.price = price;
            data.domainId = domainId;

            getParameterForPurchase(data);

            return data;
        }

        CommunicatorHelper.getDataForRequestConfirmPurchaseBySmartPhone = function (purchaseSessionId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.purchaseSessionId = purchaseSessionId;
            data.domainId = domainId;

            return data;
        }

        CommunicatorHelper.getDataForRequestCancelPurchaseBySmartPhone = function (purchaseSessionId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.purchaseSessionId = purchaseSessionId;
            data.domainId = domainId;

            return data;
        }

        CommunicatorHelper.getDataForRequestCheckAdultOption = function () {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();

            return data;
        }

        CommunicatorHelper.getDataForRequestGetProductInfo = function (productId, goodId, productProfile) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();

            data.productId = productId;
            data.goodId = goodId;
            data.productProfile = productProfile;

            return data;
        }

        CommunicatorHelper.getDataForRequestApplicableCouponAmount = function (productPrice) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();

            data.productPrice = productPrice;
            data.domainId = domainId;

            return data;
        }

        CommunicatorHelper.getDataForRequestReportClientPlayError = function (errorCode, categoryId) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();

            data.errorCode = errorCode;
            var milliSeconds = new Date().getMilliseconds();
            data.errorTime = getCurrentTime() + "." + milliSeconds;

            var entryContext = CCAStateManager.getLastUiDomainComponentEntryContext();
            if (entryContext != null) {
                data.uiComponentDomain = entryContext.uiDomainID;
                if (data.uiComponentDomain == UIComponentHelper.UIDomainID.CATEGORY && categoryId && CCAStateManager.isEpisodePeerContentPurchase()) {
                    data.uiComponentId = categoryId;
                } else {
                    data.uiComponentId = entryContext.uiComponentID;
                }
            } else {
                data.uiComponentDomain = UIComponentHelper.UIDomainID.CATEGORY;
                if (categoryId) {
                    data.uiComponentId = categoryId;
                } else {
                    data.uiComponentId = 2;
                }
            }
            return data;
        }

        CommunicatorHelper.getDataForRequestWeatherInfo = function (socode) {
            var data = {};
            data.stnid = WeatherHelper.getSTNIDBySOCode(socode);
            data.version = 1;
            data.appKey = skpAPIAppID;

            return data;
        }

        CommunicatorHelper.getDataForRequestWeatherInfoHourly = function (socode) {
            var data = {};
            data.city = WeatherHelper.getCityNameBySOCode(socode);
            data.county  = WeatherHelper.getTownNameBySOCode(socode);
            data.village  = WeatherHelper.getVillageNameBySOCode(socode);

            data.version = 1;
            data.appKey = skpAPIAppID;

            return data;
        }

        CommunicatorHelper.getDataForRequestUIComponentList = function (menuExternalId, pageSize) {
            var data = this.getHASDefaultParameter();
            data.terminalKey = CCAInfoManager.getTerminalKey();
            data.menuExternalId = menuExternalId;
            if (pageSize != null) {
                data.pageSize = pageSize;
            }
            return data;
        };

        CommunicatorHelper.parseLocationHash = function(hashString) {
            var data = {};
            if(hashString) {
                hashString = hashString.replace('#','');
                var hashArray = hashString.split('&');
                for(var i = 0; i < hashArray.length; i++) {
                    var info = hashArray[i];
                    var temp = info.split(':');
                    if(temp.length > 1) {
                        data[temp[0]] = temp[1];
                    }
                }
            }
            return data;
        }

        CommunicatorHelper.getSoCodeFromLocationHash = function(hashString) {
            var hash = CommunicatorHelper.parseLocationHash(hashString);

            if(hash["mapid"]) {
                return hash["mapid"] == "default" ? homeMenuDefaultSo : hash["mapid"];
            } else {
                return homeMenuDefaultSo;
            }
        }

        CommunicatorHelper.getDataForRequestHomeMenu = function() {
            var data = {};
            data.soCode = CommunicatorHelper.getSoCodeFromLocationHash(window.location.hash);
            data.subMenu = true;
            return data;
        };

        CommunicatorHelper.isSeoKyungSO = function() {
            return WeatherHelper.SO_SEOKYUNG == STBInfoManager.getSOCode() || WeatherHelper.SO_SEOKYUNG == CommunicatorHelper.getSoCodeFromLocationHash(window.location.hash)
        };

        return CommunicatorHelper;
    });
