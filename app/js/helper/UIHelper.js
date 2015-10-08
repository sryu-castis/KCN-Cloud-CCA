/**
 * 데이터를 변형하거나 시나리오를 풀어야 하는 부분에서 사용
 */
define(["cca/type/ProductType", "cca/type/ViewablePeriodType", "helper/DateHelper", 'cca/type/PaymentType'],
    function (ProductType, ViewablePeriodType, DateHelper, PaymentType) {
        var UIHelper = {};

        UIHelper.addThousandSeparatorCommas = function(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        UIHelper.getPosterRibbonName = function (contentGroup) {
            var assetNew = contentGroup.getNewAssetCount();
            var promotionSticker = contentGroup.getPromotionSticker();
            var getPosterRibbonName = "";
            // start
            switch (promotionSticker) {
                case 11:
                    // 반값 => 인기상승
                    getPosterRibbonName= "fav";
                    break;
                case 12:
                    // 추천
                    getPosterRibbonName= "reco";
                    break;
                case 13:
                    // 이벤트
                    getPosterRibbonName= "event_poster";
                    break;
                case 14:
                    // 극장동시
                    getPosterRibbonName= "movie";
                    break;
                case 15:
                case 1001:
                    // 할인 => 반짝할인
                    getPosterRibbonName= "sale_sur";
                    break;
                case 16:
                    getPosterRibbonName= "hot";
                    break;
                case 17:
                    getPosterRibbonName= "coupon";
                    break;
                case 18:
                    getPosterRibbonName= "rank01";
                    // 쿠폰할인
                    break;
                default:
                    switch (assetNew) {
                        case 1:
                        case 2:
                            getPosterRibbonName = "new";
                            break;
                        default:
                            getPosterRibbonName = "";
                            break;
                    }
                    break;
            }

            return getPosterRibbonName;
        };

        UIHelper.getPosterRibbonNameForAsset = function (asset) {
            var ribbonName = UIHelper.getPosterRibbonName(asset);
            if(ribbonName == "" && asset.getIsNew() == true) {
                ribbonName = "new";
            };

            return ribbonName;
        };

        UIHelper.getPosterRibbonNameForDetailView = function (asset) {
            var bundleProduct = UIHelper.getProduct(asset.getProductList(), ProductType.BUNDLE);
            if(bundleProduct != null) {
                return "sale_package";
            } else {
                return UIHelper.getPosterRibbonNameForAsset(asset);
            }
        }

        UIHelper.getRankingIconClassName = function(index)	{
            var className = "";
            if(index >= 30)	return className;
            var ranking = index+1;
            className = "g"+ranking;
            return className;

        }
        UIHelper.getDisplayProduct = function(productList, coupon) {
            if(productList.length > 1) {
                var order = [ProductType.SVOD, ProductType.PACKAGE, ProductType.BUNDLE, ProductType.RVOD, ProductType.FOD];
                var product = null;
                for(var i = 0; i < order.length; i++) {
                    //product = UIHelper.getProduct(productList, order[i]);
                    //if(UIHelper.isPurchasedProduct(product)) {
                    //    return product;
                    //}
                    //각 ProductType 별로 상품이 2개 이상일 수 있음.
                    for(var j = 0; j < productList.length; j++) {
                        product = productList[j];
                        if(order[i] == product.getProductType() && UIHelper.isPurchasedProduct(product)) {
                            return product;
                        }
                    }
                }
                /*if(CouponManager.isFreeCoupon(coupon)) {
                    //@ SVODPackage 무료 쿠폰이 생기면 내용 변경 필요함
                    if(CouponManager.isSVODFreeCoupon(coupon)) {
                        product = UIHelper.getProduct(productList, ProductType.SVOD);
                    } else {
                        product = UIHelper.getProduct(productList, ProductType.RVOD);
                    }
                } else {
                    product = UIHelper.getProduct(productList, ProductType.RVOD);
                }*/
                product = UIHelper.getProduct(productList, ProductType.RVOD);
                if(product == null) {
                    product = productList[0];
                }
                return product;
            } else {
                return productList[0];
            }
        }

        UIHelper.getDisplayPrice = function(product) {
            if(this.isPurchasedProduct(product)) {
                if(ProductType.RVOD == product.getProductType() || ProductType.PACKAGE == product.getProductType() || ProductType.BUNDLE == product.getProductType()) {
                    return CCABase.StringSources.alreadyPurchasedRVOD;
                } else if(ProductType.SVOD == product.getProductType() || ProductType.SVODPackage == product.getProductType()) {
                    return CCABase.StringSources.alreadyPurchasedSVOD;
                } else if(ProductType.FOD == product.getProductType()) {
                    return CCABase.StringSources.freeVODPrice;
                }
            } else {
                if(ProductType.SVOD == product.getProductType() || ProductType.SVODPackage == product.getProductType()) {
                    return this.addThousandSeparatorCommas(product.getPrice())+ "원/월";
                } else {
                    return this.addThousandSeparatorCommas(product.getPrice())+ "원";
                }

            }
        }
        UIHelper.getDisplayViewablePeriod = function(asset, product) {
            if(this.isPurchasedProduct(product)) {
                if(ProductType.SVOD == product.getProductType() || ProductType.FOD == product.getProductType()) {
                    return asset.getLicenseEnd().split(' ')[0];
                } else {
                    if(product.getViewablePeriodState() == ViewablePeriodType.UNLIMITED) {
                        //무제한 시청
                        return CCABase.StringSources.unLimitedPeriod;
                    } else {
                        return DateHelper.getViewablePeriodText(product.getViewablePeriod());
                    }
                }
            } else {
                if(product.getViewablePeriodState() == ViewablePeriodType.UNLIMITED) {
                    return CCABase.StringSources.unLimitedPeriod;
                } else {
                    return DateHelper.getViewablePeriodText(product.getViewablePeriod());
                }
            }

        }
        /**
         * list에서 해당 type의 product 를 return
         * @param productList
         * @param type
         * @returns {*}
         */
        UIHelper.getProduct = function(productList, type) {
            var product = null;
            for ( var i = 0; i < productList.length; i++) {
                if (productList[i].getProductType() == type) {
                    product = productList[i];
                    break;
                }
            }
            return product;
        };

        UIHelper.isPurchasedProduct = function(product) {
            var isPurchased = false;
            if (product != null) {
                if (product.getPrice() == 0 || product.getPurchasedTime().length > 1) {
                    isPurchased = true;
                }
            }
            return isPurchased;
        };

        UIHelper.getRankingChartComparisionName = function (popularity) {
            
            if(popularity.getComparision() < 0) {
                return 'down';
            } else if(popularity.getComparision() == 0) {
                return '-';
            } else if(popularity.getComparision() > 0){
                return 'up';
            } else if(popularity.getIsNew() == true || popularity.getComparision() == 'new') {
                return 'NEW';
            }
        };

        UIHelper.transformHourMinuteTimeToMinuteTime = function (time) {
            var hourMinute = time.split(":");
            return hourMinute[0]*60 + hourMinute[1]*1;
        };

        UIHelper.getRatingName = function (rating) {
            if(rating == 'all' || rating == 0) {
                return 'all';
            } else {
                return 'a' + rating;
            }
        };

        UIHelper.addHyphenForMobileNumber = function (str){
            str = str.replace(/[^0-9]/g, '');
            var tmp = '';
            if ( str.length < 4) {
                return str;
            } else if (str.length < 8) {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3);
                return tmp;
            } else {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3, 4);
                tmp += '-';
                tmp += str.substr(7);
                return tmp;
            }
            return str;
        }

        UIHelper.getPurchaseProductHead = function (product){
            var productType = product.getProductType();
            if (ProductType.RVOD == productType) {
                return CCABase.StringSources.PURCHASE_RVOD_HEAD;
            } else if (ProductType.BUNDLE == productType) {
                return CCABase.StringSources.PURCHASE_BUNDLE_HEAD
            } else if (ProductType.PACKAGE == productType) {
                return CCABase.StringSources.PURCHASE_PACKAGE_HEAD;
            } else if (ProductType.SVOD == productType) {
                return product.getProductName().split(":")[0];
            }
        }

        UIHelper.getPurchaseProductBody = function (product){
            var productType = product.getProductType();
            if (ProductType.RVOD == productType) {
                return CCABase.StringSources.PURCHASE_RVOD_BODY;
            } else if (ProductType.BUNDLE == productType) {
                return product.getProductName();
            } else if (ProductType.PACKAGE == productType) {
                return product.getProductName();
            } else if (ProductType.SVOD == productType) {
                return product.getProductName().split(":")[1];
            }
        }

        UIHelper.getPaymentHead = function (payment){
            if (PaymentType.Normal == payment) {
                return CCABase.StringSources.PAYMENT_NORMAL_HEAD;
            } else if (PaymentType.Coupon == payment) {
                return CCABase.StringSources.PAYMENT_COUPON_HEAD;
            } else if (PaymentType.Point == payment) {
                return CCABase.StringSources.PAYMENT_TVPOINT_HEAD;
            }
        }

        UIHelper.getCouponPaymentTail = function (price, couponBalance){
            if(couponBalance >= price) {
                return "쿠폰결제가능";
            } else if(couponBalance > 0) {
                return "현금+쿠폰결제가능";
            } else {
                return "쿠폰구매필요";
            }
        }

        UIHelper.getTVPointPaymentTail = function (price, tvpointBalance){
            if(tvpointBalance >= price) {
                return "포인트결제가능";
            } else if(tvpointBalance > 0) {
                return "포인트 전환필요";
            } else {
                return "회원 가입필요";
            }
        }

        var VAT_RATE = 0.1;
        UIHelper.getProductPriceWithVAT = function (price){
            return price + (price * VAT_RATE);
        }

        UIHelper.getNormalizationRating = function (realRating){
            var normalizationRating = 0;
            if (realRating == null) {
                normalizationRating = 19;
            } else if (realRating.indexOf("7") != -1) {
                normalizationRating = 7;
            } else if (realRating.indexOf("12") != -1) {
                normalizationRating = 12;
            } else if (realRating.indexOf("15") != -1) {
                normalizationRating = 15;
            } else if (realRating.indexOf("18") != -1 || realRating.indexOf("19") != -1) {
                normalizationRating = 19;
            } else {
                normalizationRating = 0;
            }

            return normalizationRating;

        }

        UIHelper.getUnEnrolledEvent = function (eventList) {
            var targetEvent = null;
            if(eventList) {
                for(var i = 0; i < eventList.length; i++) {
                    var event = eventList[i];
                    if(event.getPiAgreement() == -1 && event.isUnEnroll()) {
                        targetEvent = event;
                        break;
                    }
                }
            }
            return targetEvent;
        }

        UIHelper.isHaveOST = function (asset) {
            if (asset != null && asset.isExtContentMapped()) {
                return true;
            } else {
                return false;
            }
        }

        UIHelper.isMODAsset = function (asset){
            if (asset != null && isMODProviderId(asset.getAssetID()) && asset.isExtContentMapped()) {
                return true;
            } else {
                return false;
            }
        }
        UIHelper.isMODProvider = function (asset){
            if (asset != null && isMODProviderId(asset.getAssetID())) {
                return true;
            } else {
                return false;
            }
        }
        var MOD_PROVIDERID = "www.wisepeer.com";

        function isMODProviderId(assetID) {
            return MOD_PROVIDERID == assetID.split("|")[0];
        }

        UIHelper.getTemperature = function (value){
            if(value != null && value.length > 0) {
                return parseInt(value);
            } else {
                return "-";
            }
        }


        return UIHelper;
});