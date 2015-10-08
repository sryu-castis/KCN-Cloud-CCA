define(["framework/Drawer", "ui/purchaseViewGroup/purchaseMobileConfirmView/PurchaseMobileConfirmModel", "helper/UIHelper", "helper/DateHelper"],
    function (Drawer, Model, UIHelper, DateHelper) {
        var PurchaseMobileConfirmDrawer = function (_id, _model) {
            Drawer.call(this, _id, _model);
            this.templateList = {'layout': new EJS({url: 'js/ui/purchaseViewGroup/purchaseMobileConfirmView/LayoutTemplate.ejs'})};
            var _this = this;

            PurchaseMobileConfirmDrawer.prototype.onCreateLayout = function () {
                this.createContainer("purchasePopup");
            };

            PurchaseMobileConfirmDrawer.prototype.onPaint = function () {
                var result = this.templateList['layout'].render({model: this.model, UIHelper:UIHelper, DateHelper:DateHelper});
                this.getContainer().html(result);
                setButtonElement();
            };

            PurchaseMobileConfirmDrawer.prototype.onAfterPaint = function () {
                drawButton();
            };

            function setButtonElement() {
                var buttonGroup = _this.model.getButtonGroup();

                var buttonElementList = $('#purchasePopup .area_btn >');
                var size = buttonGroup.getSize();
                for (var i = 0; i < size; i++) {
                    buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
                }
            }

            function drawButton() {
                var buttonGroup = _this.model.getButtonGroup();
                for(var i = 0; i < buttonGroup.getSize(); i++) {
                    if (buttonGroup.getButton(i).isActive()) {
                        buttonGroup.getButton(i).onActive();
                    } else {
                        buttonGroup.getButton(i).onDeActive();
                    }
                    buttonGroup.getButton(i).setUnFocus();
                }

                if(_this.isActive()) {
                    buttonGroup.getFocusedButton().setFocus();
                }
            }

        };
        PurchaseMobileConfirmDrawer.prototype = Object.create(Drawer.prototype);


        return PurchaseMobileConfirmDrawer;
    });
