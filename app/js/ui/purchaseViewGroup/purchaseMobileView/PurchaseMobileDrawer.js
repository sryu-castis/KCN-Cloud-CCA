define(["framework/Drawer", "ui/purchaseViewGroup/purchaseMobileView/PurchaseMobileModel", "helper/UIHelper", "helper/DateHelper"],
    function (Drawer, Model, UIHelper, DateHelper) {
        var PurchaseMobileDrawer = function (_id, _model) {
            Drawer.call(this, _id, _model);
            this.templateList = {'layout': new EJS({url: 'js/ui/purchaseViewGroup/purchaseMobileView/LayoutTemplate.ejs'})};
            var _this = this;

            PurchaseMobileDrawer.prototype.onCreateLayout = function () {
                this.createContainer("purchasePopup");
            };

            PurchaseMobileDrawer.prototype.onPaint = function () {
                var result = this.templateList['layout'].render({model: this.model, UIHelper:UIHelper, DateHelper:DateHelper});
                this.getContainer().html(result);
                setButtonElement();
                setInputFieldElement();
            };

            PurchaseMobileDrawer.prototype.onAfterPaint = function () {
                drawButton();
                drawInputField();
            };

            function setButtonElement() {
                var buttonGroup = _this.model.getButtonGroup();

                var buttonElementList = $('#purchasePopup .area_btn >');
                var size = buttonGroup.getSize();
                for (var i = 0; i < size; i++) {
                    buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
                }
            }

            function setInputFieldElement() {
                var inputField = _this.model.getInputField();
                inputField.setElement($("#purchasePopup .body_serialbox_mobile01"));
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

                if(_this.isActive() && !isFocusOnInputField()) {
                    buttonGroup.getFocusedButton().setFocus();
                }
            }

            function drawInputField() {
                var model = _this.model;
                var inputField = model.getInputField();

                if (_this.isActive() && isFocusOnInputField()) {
                    inputField.setFocus();
                } else {
                    inputField.setUnFocus();
                }
            }

            function isFocusOnInputField() {
                return _this.model.getVIndex() == 0;
            }

        };
        PurchaseMobileDrawer.prototype = Object.create(Drawer.prototype);


        return PurchaseMobileDrawer;
    });
