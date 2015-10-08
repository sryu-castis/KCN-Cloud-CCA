define(["framework/Drawer", "ui/purchaseViewGroup/selectProductView/SelectProductModel", "helper/UIHelper", "service/CouponManager"],
    function (Drawer, Model, UIHelper, CouponManager) {
        var SelectPaymentDrawer = function (_id, _model) {
            Drawer.call(this, _id, _model);
            this.templateList = {'layout': new EJS({url: 'js/ui/purchaseViewGroup/selectPaymentView/LayoutTemplate.ejs'}), 'list': new EJS({url: 'js/ui/purchaseViewGroup/selectPaymentView/ListTemplate.ejs'})};
            var _this = this;
            var timer = null;

            SelectPaymentDrawer.prototype.onCreateLayout = function () {
                //@같은 컨테이너를 공유하도록 처리
                this.createContainer("purchasePopup");
            };
            SelectPaymentDrawer.prototype.onPaint = function () {
                var resultLayout = this.templateList['layout'].render({model:this.model, 'UIHelper':UIHelper});
                this.getContainer().html(resultLayout);
                var resultList = this.templateList['list'].render({model:this.model, 'UIHelper':UIHelper});
                $("#purchasePopup #popup_large .area_option").html(resultList);
                setButtonElement();

            };
            SelectPaymentDrawer.prototype.onAfterPaint = function () {
                drawButton();
                drawPayment();
                drawTVPoint();
            }

            SelectPaymentDrawer.prototype.onAfterDestroy = function() {
                cleanTimer();
            }

            function setButtonElement() {
                var buttonGroup = _this.model.getButtonGroup();

                var buttonElementList = $('#purchasePopup #popup_large .area_btn >');
                var size = buttonGroup.getSize();
                for (var i = 0; i < size; i++) {
                    buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
                }
            }

            function drawButton() {
                var buttonGroup = _this.model.getButtonGroup();
                if(buttonGroup != null)	{
                	for(var i = 0; i < buttonGroup.getSize(); i++) {
                        if (buttonGroup.getButton(i).isActive()) {
                            buttonGroup.getButton(i).onActive();
                        } else {
                            buttonGroup.getButton(i).onDeActive();
                        }
                        buttonGroup.getButton(i).setUnFocus();
                    }

                    if(_this.isActive() && isButtonGroupState()) {
                        buttonGroup.getFocusedButton().setFocus();
                    }
                } 
            }

            function drawPayment() {
                var box = $('#popup_large .area_option .box');
                if (!isButtonGroupState()) {
                    box.find('.select').removeClass('select');
                    box.find('.focus').removeClass('focus');
                    box.eq(_this.model.getHFocusIndex()).addClass("focus");
                } else {
                    box.eq(_this.model.getHFocusIndex()).addClass("select");
                }
            }

            function drawTVPoint() {
                if(CouponManager.isCompletedRequestForTVBalances()) {
                    var tvpointBalanceArea = $("#popup_large .box.tv div.body p.coupon_balance span.text");
                    var tvpoint = UIHelper.addThousandSeparatorCommas(CouponManager.getTVPointBalance()) + "P";
                    tvpointBalanceArea.html(tvpoint);

                    var productPrice = UIHelper.getProductPriceWithVAT(_this.model.getProduct().getPrice());
                    var tvpointPaymentTypeTail = UIHelper.getTVPointPaymentTail(productPrice, CouponManager.getTVPointBalance());
                    var tvpointPaymentTypeTailClassName = CouponManager.getTVPointBalance() > 0 ? 'normal' : 'red';

                    var tvPointTextArea = $("#popup_large .box.tv div.body p.info_01").removeClass().addClass("info_01 " + tvpointPaymentTypeTailClassName);
                    tvPointTextArea.html(tvpointPaymentTypeTail);
                    cleanTimer();
                } else {
                    timer = setTimeout(function() {
                        drawTVPoint();
                    }, 200);
                }
            }

            function cleanTimer() {
                clearTimeout(timer);
                timer = null;
            }

            function isButtonGroupState() {
                return _this.model.getVIndex() == 1;
            }

        };
        SelectPaymentDrawer.prototype = Object.create(Drawer.prototype);


        return SelectPaymentDrawer;
    });
