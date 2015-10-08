define(["framework/Drawer", "ui/purchaseViewGroup/selectProductView/SelectProductModel", "helper/UIHelper"],
    function (Drawer, Model, UIHelper) {
        var SelectProductDrawer = function (_id, _model) {
            Drawer.call(this, _id, _model);
            this.templateList = {'layout': new EJS({url: 'js/ui/purchaseViewGroup/selectProductView/LayoutTemplate.ejs'}), 'list': new EJS({url: 'js/ui/purchaseViewGroup/selectProductView/ListTemplate.ejs'})};
            var _this = this;

            SelectProductDrawer.prototype.onCreateLayout = function () {
                //@같은 컨테이너를 공유하도록 처리
                this.createContainer("purchasePopup");

            };
            SelectProductDrawer.prototype.onPaint = function () {
                var resultLayout = this.templateList['layout'].render({model:this.model, 'UIHelper':UIHelper});
                this.getContainer().html(resultLayout);
                var resultList = this.templateList['list'].render({model:this.model, 'UIHelper':UIHelper});
                $("#purchasePopup #popup_large .area_option").html(resultList);
                setButtonElement();

            };
            SelectProductDrawer.prototype.onAfterPaint = function () {
                drawButton();
                drawProduct();
            };

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
                if(buttonGroup != null){
                	for(var i = 0; i < buttonGroup.getSize(); i++) {
                        if (buttonGroup.getButton(i).isActive()) {
                            buttonGroup.getButton(i).onActive();
                        } else {
                            buttonGroup.getButton(i).onDeActive();
                        }
                        buttonGroup.getButton(i).setUnFocus();
                    }
                }

                if(_this.isActive() && isButtonGroupState()) {
                    buttonGroup.getFocusedButton().setFocus();
                }
            }

            function drawProduct() {
                var box = $('#popup_large .area_option .box');
                if (!isButtonGroupState()) {
                    box.find('.select').removeClass('select');
                    box.find('.focus').removeClass('focus');
                    box.eq(_this.model.getHFocusIndex()).addClass("focus");
                } else {
                    box.eq(_this.model.getHFocusIndex()).addClass("select");
                }
            }

            function isButtonGroupState() {
                return _this.model.getVIndex() == SelectProductDrawer.STATE_BUTTON_GROUP;
            }

        };
        SelectProductDrawer.prototype = Object.create(Drawer.prototype);
        SelectProductDrawer.STATE_SELECT_PRODUCT = 0;
        SelectProductDrawer.STATE_BUTTON_GROUP = 1;

        return SelectProductDrawer;
    });
