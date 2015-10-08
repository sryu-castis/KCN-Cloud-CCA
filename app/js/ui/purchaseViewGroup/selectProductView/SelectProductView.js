define(["framework/View", "framework/event/CCAEvent", "framework/modules/ButtonGroup",
        "ui/purchaseViewGroup/selectProductView/SelectProductDrawer", "ui/purchaseViewGroup/selectProductView/SelectProductModel",
        "service/STBInfoManager", "cca/DefineView", 'cca/type/ProductType', 'cca/type/PaymentType'],
    function (View, CCAEvent, ButtonGroup, SelectProductDrawer, SelectProductModel, STBInfoManager, DefineView, ProductType, PaymentType) {
        var SelectProductView = function () {
            View.call(this, "selectProductView");
            this.model = new SelectProductModel();
            this.drawer = new SelectProductDrawer(this.getID(), this.model);

            var _this = this;

            SelectProductView.prototype.onGetData = function (param) {
                var asset = param.asset;
                var coupon = param.coupon;
                var isAgreeForEvent = param.isAgreeForEvent;
                var isNextPlay = param.isNextPlay;
                setData(asset, coupon, isAgreeForEvent, isNextPlay);
            };


            function setData(asset, coupon, isAgreeForEvent, isNextPlay) {
                var model = _this.model;

                var verticalVisibleSize = 2;
                var horizonVisibleSize = asset.getProductList().length;
                var verticalMaximumSize = verticalVisibleSize;
                var horizonMaximumSize = horizonVisibleSize;

                model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
                model.setRotate(false, false);
                model.setAsset(asset);
                model.setData(asset.getProductList());
                var buttonGroup = getButtonGroup();
                model.setButtonGroup(buttonGroup);
                model.setCoupon(coupon);
                model.setIsAgreeForEvent(isAgreeForEvent);
                model.setNextPlay(isNextPlay);
            };

            function getButtonGroup() {
                var buttonGroup = new ButtonGroup(2);
                buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
                //buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.PURCHASE_COUPON);
                //buttonGroup.getButton(2).setLabel(CCABase.StringSources.ButtonLabel.MONTYLY_COUPON);
                buttonGroup.getButton(1).setLabel(CCABase.StringSources.ButtonLabel.CANCEL);


                return buttonGroup;
            }

            /////////////////////////////
            SelectProductView.prototype.onKeyDown = function (event, param) {
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
                        }
                        _this.drawer.onUpdate();
                        break;
                    case tvKey.KEY_LEFT:
                        if (isButtonGroupState()) {
                            buttonGroup.previous();
                        } else {
                            _this.keyNavigator.keyLeft();
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
                            _this.model.setVIndex(SelectProductView.STATE_BUTTON_GROUP);
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
                        changeToSelectPayment();
                        break;
                    case CCABase.StringSources.ButtonLabel.CANCEL:
                        sendFinishViewEvent();
                        break;
                }
            }

            function changeToSelectPayment(){
                var param = {};
                param.asset = _this.model.getAsset();
                param.product = _this.model.getData()[_this.model.getHIndex()];
                param.coupon = _this.model.getCoupon();
                param.isAgreeForEvent = _this.model.getIsAgreeForEvent();
                param.isNextPlay = _this.model.isNextPlay();
                param.targetView = DefineView.SELECT_PAYMENT_VIEW;
                if(ProductType.BUNDLE == param.product.getProductType()) {
                    param.targetView = DefineView.BUNDLE_PRODUCT_VIEW;
                    _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, param);
                } else if(ProductType.SVOD == param.product.getProductType()) {
                    param.paymentType = PaymentType.Monthly;
                    _this.sendEvent(CCAEvent.CHANGE_VIEW, param);
                } else {
                    _this.sendEvent(CCAEvent.CHANGE_VIEW, param);    
                }
            }

            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            }

            function isButtonGroupState() {
                return _this.model.getVIndex() == SelectProductView.STATE_BUTTON_GROUP;
            }

        };


        SelectProductView.prototype = Object.create(View.prototype);
        SelectProductView.STATE_SELECT_PRODUCT = SelectProductDrawer.STATE_SELECT_PRODUCT;
        SelectProductView.STATE_BUTTON_GROUP = SelectProductDrawer.STATE_BUTTON_GROUP;

        return SelectProductView;
    });
