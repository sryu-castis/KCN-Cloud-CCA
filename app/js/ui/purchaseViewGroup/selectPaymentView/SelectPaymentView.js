define(["framework/View", "framework/event/CCAEvent", "framework/modules/ButtonGroup",
        'service/CouponManager',
        "ui/purchaseViewGroup/selectPaymentView/SelectPaymentDrawer", "ui/purchaseViewGroup/selectProductView/SelectProductModel",
        "service/STBInfoManager", "cca/DefineView", 'cca/type/PaymentType', 'cca/type/ProductType', 'cca/model/Product', 'helper/UIHelper', 'cca/PopupValues',
        "service/Communicator", "service/CCAInfoManager"
    ],
    function (View, CCAEvent, ButtonGroup, CouponManager, SelectPaymentDrawer, SelectProductModel,
              STBInfoManager, DefineView, PaymentType, ProductType, Product, UIHelper, PopupValues, Communicator, CCAInfoManager) {
        var SelectPaymentView = function () {
            View.call(this, "SelectPaymentView");
            this.model = new SelectProductModel();
            this.drawer = new SelectPaymentDrawer(this.getID(), this.model);

            var _this = this;

            SelectPaymentView.prototype.onPopupResult = function (param) {
                if (param.popupType != undefined && (param.id == PopupValues.ID.ALERT_PURCHASE_COUPON_COMPLETED || param.id == PopupValues.ID.ALERT_PURCHASE_MONTHLY_COUPON_COMPLETED)) {
                    _this.model.setButtonGroup(getButtonGroup());
                    _this.drawer.onUpdate();
                }
            };
            SelectPaymentView.prototype.onGetData = function (param) {
                var playAfterPurchase = param.playAfterPurchase == false ? false : true;
                var asset = param.asset;
                var coupon = param.coupon;
                var product = param.product;
                var isAgreeForEvent = param.isAgreeForEvent;
                if (param.bundleProduct) {
                    product = param.bundleProduct;
                    this.model.setBundleProduct(param.bundleProduct);
                }
                if (product == null) {
                    //@asset구매시 product가 1개일때만 생략해서 들어옴
                    product = asset.getProductList()[0];
                }
                var isNextPlay = param.isNextPlay;
                this.model.setNextPlay(isNextPlay);
                setData(asset, product, coupon, isAgreeForEvent, playAfterPurchase);
            };


            function setData(asset, product, coupon, isAgreeForEvent, playAfterPurchase) {
                var model = _this.model;
                var paymentTypeList = getPaymentTypeList();
                var verticalVisibleSize = 2;
                var horizonVisibleSize = paymentTypeList.length;
                var verticalMaximumSize = verticalVisibleSize;
                var horizonMaximumSize = horizonVisibleSize;

                model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                model.setRotate(false, false);
                model.setAsset(asset);
                model.setData(paymentTypeList);

                model.setCoupon(coupon);
                model.setProduct(product);
                model.setIsAgreeForEvent(isAgreeForEvent);
                model.setPlayAfterPurchase(playAfterPurchase);
                model.setButtonGroup(getButtonGroup());
            }

            function getPaymentTypeList() {
                var paymentTypeList = [PaymentType.Normal];
                if (CCAInfoManager.hasPaymentCoupon()) {
                    paymentTypeList[paymentTypeList.length] = PaymentType.Coupon;
                }
                if (CCAInfoManager.hasPaymentPoint()) {
                    paymentTypeList[paymentTypeList.length] = PaymentType.Point;
                }
                return paymentTypeList;

            }

            function getButtonGroup() {
                var currentPayment = _this.model.getHFocusedItem();
                var buttonGroup = null;
                switch (currentPayment) {
                    case PaymentType.Normal:
                        buttonGroup = getButtonGroupForNormalPayment();
                        break;
                    case PaymentType.Coupon:
                        buttonGroup = getButtonGroupForCouponPayment();
                        break;
                    case PaymentType.Point:
                        buttonGroup = getButtonGroupForTVPointPayment();
                        break;
                }
                return buttonGroup;
            }

            function hasDiscountCoupon() {
                return _this.model.getCoupon() != null
            }

            function getButtonGroupForNormalPayment() {
                var buttonGroup = null;

                if (hasDiscountCoupon()) {
                    buttonGroup = new ButtonGroup(3);
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
                    buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.DISCOUNT_COUPON);
                    buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                } else {
                    buttonGroup = new ButtonGroup(2);
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
                    buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                }
                return buttonGroup;
            }

            function getButtonGroupForCouponPayment() {
                var buttonGroup = null;
                var productPrice = UIHelper.getProductPriceWithVAT(_this.model.getProduct().getPrice());

                if (CouponManager.getTotalMoneyBalance() >= productPrice) {
                    buttonGroup = new ButtonGroup(3);
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
                    buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.MONTYLY_COUPON);
                    buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                } else if (CouponManager.getTotalMoneyBalance() > 0) {
                    buttonGroup = new ButtonGroup(4);
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
                    buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.PURCHASE_COUPON);
                    buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.MONTYLY_COUPON);
                    buttonGroup.getButton(3).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                } else {
                    buttonGroup = new ButtonGroup(3);
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.PURCHASE_COUPON);
                    buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.MONTYLY_COUPON);
                    buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                }

                return buttonGroup;
            }


            function getButtonGroupForTVPointPayment() {
                var buttonGroup = null;
                var productPrice = _this.model.getProduct().getPrice();
                if (CouponManager.getTVPointBalance() >= productPrice) {
                    buttonGroup = new ButtonGroup(2);
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
                    buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                } else {
                    buttonGroup = new ButtonGroup(2);
                    buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.TV_POINT);
                    buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);
                }

                return buttonGroup;
            }

            /////////////////////////////
            SelectPaymentView.prototype.onKeyDown = function (event, param) {
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
                var buttonGroup = _this.model.getButtonGroup();

                switch (keyCode) {
                    case tvKey.KEY_UP:
                        _this.keyNavigator.keyUp();
                        _this.drawer.onUpdate();
                        break;
                    case tvKey.KEY_DOWN:
                        _this.keyNavigator.keyDown();
                        if (isButtonGroupState()) {
                            buttonGroup.setIndex(0);
                        }
                        _this.drawer.onUpdate();
                        break;
                    case tvKey.KEY_RIGHT:
                        if (isButtonGroupState()) {
                            buttonGroup.next();
                        } else {
                            _this.keyNavigator.keyRight();
                            _this.model.setButtonGroup(getButtonGroup());
                        }
                        _this.drawer.onUpdate();
                        break;
                    case tvKey.KEY_LEFT:
                        if (isButtonGroupState()) {
                            buttonGroup.previous();
                        } else {
                            _this.keyNavigator.keyLeft();
                            _this.model.setButtonGroup(getButtonGroup());
                        }
                        _this.drawer.onUpdate();
                        break;
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_EXIT:
                        sendFinishViewEvent();
                        break;
                    case tvKey.KEY_ENTER:
                        if (isButtonGroupState()) {
                            var buttonLabel = buttonGroup.getFocusedButton().getLabel();
                            selectButtonHandler(buttonLabel);
                        } else {
                            _this.model.setVIndex(SelectPaymentView.STATE_BUTTON_GROUP);
                            _this.drawer.onUpdate();
                        }
                        break;
                    default:
                        break;
                }
            }

            function selectButtonHandler(buttonLabel) {
                switch (buttonLabel) {
                    case CCABase.StringSources.ButtonLabel.CONFIRM:
                        if (isComplexPurchase()) {
                            Communicator.requestApplicableCouponAmount(callbackForRequestApplicableCouponAmount, _this.model.getProduct().getPrice());
                        } else {
                            changeToPurchasePopup();
                        }
                        break;
                    case CCABase.StringSources.ButtonLabel.CANCEL:
                        sendFinishViewEvent();
                        break;
                    case CCABase.StringSources.ButtonLabel.PURCHASE_COUPON:
                        changeToPurchaseCouponPopup();
                        break;
                    case CCABase.StringSources.ButtonLabel.MONTYLY_COUPON:
                        changeToMonthlyCouponPopup();
                        break;
                    case CCABase.StringSources.ButtonLabel.TV_POINT:
                        changeToTVPointPopup();
                        break;
                    case CCABase.StringSources.ButtonLabel.DISCOUNT_COUPON:
                        changeToDiscountCouponPopup();
                        break;

                }
            }

            function changeToDiscountCouponPopup() {
                if (_this.model.getCoupon() != null) {
                    var param = {};
                    param.discountCoupon = _this.model.getCoupon();
                    param.targetView = DefineView.DISCOUNT_COUPON_VIEW;
                    param.targetGroup = DefineView.COUPON_POPUP_VIEWGROUP;

                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
                }
            }


            function changeToPurchaseCouponPopup() {
                var param = {'targetView': DefineView.PURCHASE_COUPON_POPUP_VIEW};

                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            }

            function changeToMonthlyCouponPopup() {
                var param = {'targetView': DefineView.PURCHASE_MONTHLY_COUPON_POPUP_VIEW};

                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            }

            function changeToTVPointPopup() {
                var popupID = "";
                if (CouponManager.getTVPointBalance() > 0) {
                    popupID = PopupValues.ID.ALERT_LACK_OF_TVPOINT;

                } else {
                    popupID = PopupValues.ID.ALERT_REGISTER_TVPOINT;
                }
                _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup: DefineView.POPUP_VIEWGROUP, id: popupID});
            }

            function changeToPurchasePopup() {
                var param = {};
                param.playAfterPurchase = _this.model.getPlayAfterPurchase();
                param.asset = _this.model.getAsset();
                param.product = _this.model.getProduct();
                param.paymentType = _this.model.getData()[_this.model.getHIndex()];
                param.coupon = _this.model.getCoupon();
                param.isAgreeForEvent = _this.model.getIsAgreeForEvent();
                param.isNextPlay = _this.model.isNextPlay();
                param.bundleProduct = _this.model.getBundleProduct();
                param.targetView = DefineView.PURCHASE_CONFIRM_VIEW;

                _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
            }

            function isComplexPurchase() {
                var paymentType = _this.model.getData()[_this.model.getHIndex()];
                var couponBalance = CouponManager.getTotalMoneyBalance();
                var productPriceWithVAT = UIHelper.getProductPriceWithVAT(_this.model.getProduct().getPrice());

                if (PaymentType.Coupon == paymentType && couponBalance > 0 && couponBalance < productPriceWithVAT) {
                    return true;
                } else {
                    return false;
                }
            }

            function callbackForRequestApplicableCouponAmount(response) {
                if (Communicator.isCorrectRequestID(response)) {
                    CouponManager.setApplicableCouponAmount(response.applicableCouponAmount);
                    changeToPurchasePopup();
                } else {
                    CouponManager.setApplicableCouponAmount(0);
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {
                        targetGroup: DefineView.POPUP_VIEWGROUP,
                        popupType: PopupValues.PopupType.ERROR,
                        id: response.resultCode
                    });
                }
            }

            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            }

            function isButtonGroupState() {
                return _this.model.getVIndex() == SelectPaymentView.STATE_BUTTON_GROUP;
            }

        };


        SelectPaymentView.prototype = Object.create(View.prototype);
        SelectPaymentView.STATE_SELECT_PRODUCT = 0;
        SelectPaymentView.STATE_BUTTON_GROUP = 1;

        return SelectPaymentView;
    });
