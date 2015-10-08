/**
 * element 를 조작 하거나 그리는 부분이 중복되는 경우 사용
 */
define(["cca/model/Category", "cca/model/ContentGroup", "cca/model/Popularity", "cca/model/Asset",
        "cca/model/PurchaseLog", "cca/model/PreviewInfo", "cca/model/Product", "cca/model/EpisodePeer",
        "cca/model/Event", 'cca/model/ResultCategory', 'cca/model/BundleProduct', 'cca/model/BundleAsset',
        "cca/model/ServiceLog", "cca/model/ProductInfo", "cca/model/User", "cca/model/WishItem", 'cca/model/DiscountCoupon', "cca/model/Phone", 
        "cca/model/CouponProduct", "cca/model/PossessionCoupon", "cca/model/Program", "cca/model/HomeMenu", "cca/model/PromoWindow",
        "cca/model/PromoWindowPoster", "cca/model/FunctionMenu", "cca/model/UIComponent", "cca/model/Weather"],
    function (Category, ContentGroup, Popularity, Asset,
              PurchaseLog, PreviewInfo, Product, EpisodePeer,
              Event, ResultCategory, BundleProduct, BundleAsset,
              ServiceLog, ProductInfo, User, WishItem, DiscountCoupon, Phone, 
              CouponProduct, PossessionCoupon, Program, HomeMenu, PromoWindow, PromoWindowPoster, FunctionMenu, UIComponent, Weather) {

        var StructureHelper = {};

        StructureHelper.createGenericStructure = function (jsonData, model, fieldName) {
            if(jsonData) {
                if(jsonData[fieldName]) {
                    if(jsonData[fieldName] instanceof Array) {
                        var tempList = new Array(jsonData[fieldName].length);
                        for (var i = 0; i < jsonData[fieldName].length; i++) {
                            tempList[i] = new model(jsonData[fieldName][i]);
                        };
                        jsonData[fieldName] = tempList;
                    } else {
                        jsonData[fieldName] = new model(jsonData[fieldName]);
                    }
                } else {
                    jsonData[fieldName] = null;
                }
            } else {

            }

            return jsonData;
            
            
            
        };


        StructureHelper.createCategoryStructure = function (response) {
            return this.createGenericStructure(response, Category, 'categoryList');
        };


        StructureHelper.createAssetStructure = function (response) {
            if (response.assetList) {
                for(var i = 0 ; i < response.assetList.length; i++) {
                    response.assetList[i] = this.createGenericStructure(response.assetList[i], PreviewInfo, 'previewInfo');
                    response.assetList[i] = this.createGenericStructure(response.assetList[i], Product, 'productList');
                    response.assetList[i] = this.createGenericStructure(response.assetList[i], Event, 'eventList');
                }
                return this.createGenericStructure(response, Asset, 'assetList');
            } else if(response.asset) {
                response.asset = this.createGenericStructure(response.asset, PreviewInfo, 'previewInfo');
                response.asset = this.createGenericStructure(response.asset, Product, 'productList');
                response.asset = this.createGenericStructure(response.asset, Event, 'eventList');
                return this.createGenericStructure(response, Asset, 'asset');
            } else if(response.bundleAssetDetailList) {
                
                for(var i=0; i<response.bundleAssetDetailList.length; i++) {
                    var asset = this.createGenericStructure(response.bundleAssetDetailList[i], Product, 'productList');
                    response.bundleAssetDetailList[i] = asset;
                }
                return this.createGenericStructure(response, Asset, 'bundleAssetDetailList');;
            } else {
                return response;
            }
        };

        StructureHelper.createContentGroupStructure = function (response) {
            if (response.contentGroupList) {
                return this.createGenericStructure(response, ContentGroup, 'contentGroupList');
            } else if(response.contentGroup) {
                return this.createGenericStructure(response, ContentGroup, 'contentGroup');
            } else {
                return response;
            }
        };


        StructureHelper.createEpisodePeerStructure = function (response) {
            if (response.episodePeerList) {
                return this.createGenericStructure(response, EpisodePeer, 'episodePeerList');
            } else if(response.episodePeer) {
                return this.createGenericStructure(response, EpisodePeer, 'episodePeer');
            } else {
                return response;
            }
        };


        StructureHelper.createPopularityStructure = function (response) {
            response.dailyChart = this.createGenericStructure(response.dailyChart, Popularity, 'popularityList');
            response.weeklyChart = this.createGenericStructure(response.weeklyChart, Popularity, 'popularityList');
            return response;
        };

        StructureHelper.createPreviewInfoStructure = function (jsonData) {
            return new PreviewInfo(jsonData);
        };

        StructureHelper.createProductStructure = function (jsonData) {
            var productList = new Array(jsonData.length);
            for (var i = 0; i < jsonData.length; i++) {
                productList[i] = new Product(jsonData[i]);
            }
            return productList;
        };

        StructureHelper.createPurchaseLogStructure = function (response) {
            return this.createGenericStructure(response, PurchaseLog, 'purchaseLogList');
        };

        StructureHelper.createServiceLogStructure = function (response) {
            return this.createGenericStructure(response, ServiceLog, 'serviceLogList');
        };

        StructureHelper.createProductInfoStructure = function (response) {
            return this.createGenericStructure(response, ProductInfo, 'productInfoList');
        };

        StructureHelper.createUserStructure = function (response) {
            return this.createGenericStructure(response, User, 'userList');
        };

        StructureHelper.createWishItemStructure = function (response) {
            if (response.wishItemList) {
                for (var i = 0; i < response.wishItemList.length; i++) {
                    response.wishItemList[i] = this.createGenericStructure(response.wishItemList[i], Asset, 'asset');
                }
            }
            return this.createGenericStructure(response, WishItem, 'wishItemList');
        };

        StructureHelper.createPhoneStructure = function (response) {
            return this.createGenericStructure(response, Phone, 'phoneList');
        };

        StructureHelper.createEventStructure = function (response) {
            if(response.eventList) {
                return StructureHelper.createGenericStructure(response, Event, 'eventList');
            } else if(response.event) {
                return StructureHelper.createGenericStructure(response, Event, 'event');
            } else {
                return response;
            }
        };

        StructureHelper.createResultCategoryStructure = function (response) {
            return this.createGenericStructure(response, ResultCategory, 'resultCategoryList');
        };

        StructureHelper.createBundleProductStructure = function (response) {
            
            if(response.bundleProductList) {
                for(var i=0; i<response.bundleProductList.length; i++) {
                    response.bundleProductList[i] = this.createBundleAssetStructure(response.bundleProductList[i], BundleAsset, 'bundleAssetList');
                };
                return this.createGenericStructure(response, BundleProduct, 'bundleProductList');
            } else if(response.bundleProduct) {
                response.bundleProduct = this.createBundleAssetStructure(response.bundleProduct, BundleAsset, 'bundleAssetList');
                return this.createGenericStructure(response, BundleProduct, 'bundleProduct');
            } else {
                return response;
            }
        };

        StructureHelper.createBundleAssetStructure = function (response) {
            return this.createGenericStructure(response, BundleAsset, 'bundleAssetList');
        };

        StructureHelper.createSearchContentGroupStructure = function (response) {
            if(response.searchResultList == undefined || response.searchResultList.length == 0) {
                return response;
            };

            for(var i=0; i<response.searchResultList.length; i++) {
                response.searchResultList[i] = this.createGenericStructure(response.searchResultList[i], ContentGroup, 'contentGroupList');
            };
            // response.contentGroupList = this.createGenericStructure(response.searchResultList[0], ContentGroup, 'contentGroupList').contentGroupList;
            // response.totalCount = response.searchResultList[0].totalCount;
            // delete response.searchResultList;
            return response;
        };

        StructureHelper.createEventWinnerStructure = function (response) {
            return this.createGenericStructure(response, EventWinner, 'eventWinnerList');
        };

        StructureHelper.createCouponStructure = function (response) {
            return this.createGenericStructure(response, DiscountCoupon, 'couponList');
        };
        
        StructureHelper.createDiscountCouponStructure = function (response) {
            return this.createGenericStructure(response, DiscountCoupon, 'discountCouponList');
        };
        StructureHelper.createCouponProductStructure = function (response) {
            return this.createGenericStructure(response, CouponProduct, 'couponProductList');
        };
        StructureHelper.createPossessionCouponStructure = function (response) {
            return this.createGenericStructure(response, PossessionCoupon, 'possessionCouponList');
        };
        StructureHelper.createProgramStructure = function(response) {
            var programList = this.createGenericStructure(response.programList, Program, 'program').program;
            if(programList instanceof Array) {
                response.programList = programList;
            } else {
                response.programList = [programList];
            }
            return response;
            // if(response.programList instanceof Array) {
            //     for(var i=0; i<response.programList; i++) {
            //         var program = new Program(response.programList[i]);
            //         response.programList[i] = program;
            //     }
            //     return response;
            // } else {
            //     response.programList = [response.programList];
            //     return response;
            // }
        };

        StructureHelper.createHomeMenu = function(response){
            if(response != null && response.data){
                for(var i=0; i<response.data.promoWindowList.length ; i++ ){
                    response.data.promoWindowList[i] = this.createGenericStructure(response.data.promoWindowList[i], PromoWindowPoster, 'promoWindowPosterList')
                }
                response.data = this.createGenericStructure(response.data, PromoWindow, 'promoWindowList');
                response.data = this.createGenericStructure(response.data, Category, 'categoryList');
                response.data = this.createGenericStructure(response.data, FunctionMenu, 'functionMenuList');
                response.data = this.createGenericStructure(response.data, UIComponent, 'uiComponentList');
                response.data = this.createGenericStructure(response.data, FunctionMenu, 'subFunctionMenuList');
                return this.createGenericStructure(response, HomeMenu, "data");
            }else{
                return response;
            }
        };

        StructureHelper.createUIComponentStructure = function(response){
            if (response.uiComponentList) {
                return this.createGenericStructure(response, UIComponent, 'uiComponentList');
            } else {
                return response;
            }
        };

        StructureHelper.createWeather = function (response) {
            if (response != null) {
                return this.createGenericStructure(response, Weather, "weather");
            } else {
                return response;
            }
        };

        return StructureHelper;
    });

