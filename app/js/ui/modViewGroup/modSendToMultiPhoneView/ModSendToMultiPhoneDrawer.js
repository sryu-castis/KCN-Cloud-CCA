define(["framework/Drawer", "cca/PopupValues", "helper/UIHelper"], function (Drawer, PopupValues, UIHelper) {
    var ModSendToMultiPhoneDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/modViewGroup/modSendToMultiPhoneView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        ModSendToMultiPhoneDrawer.prototype.onCreateLayout = function () {

        };

        ModSendToMultiPhoneDrawer.prototype.onPaint = function () {
            var result = _this.templateList['layout'].render({model: this.model, UIHelper:UIHelper});
            this.getContainer().html(result);
            setButtonElement();
            //setInputFieldElement()
        };

        ModSendToMultiPhoneDrawer.prototype.onAfterPaint = function () {
            drawButton();
        };

        //function setInputFieldElement() {
        //    var inputField = _this.model.getInputField();
        //    inputField.setElement($("#"+_id+" .option_box_0"+_this.model.getData().length-1+" .option_phone02"));
        //};

        function setButtonElement() {
            var buttonGroup = _this.model.getButtonGroup();
            var buttonElementList = $('#'+_id+' .area_btn >');
            var size = buttonGroup.getSize();
            for (var i = 0; i < size; i++) {
                buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
            }
        };

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

            if(_this.isActive() && _this.model.getVIndex() == _this.model.getVVisibleSize()-1) {
                buttonGroup.getFocusedButton().setFocus();
            }
        }
    };
    ModSendToMultiPhoneDrawer.prototype = Object.create(Drawer.prototype);


    return ModSendToMultiPhoneDrawer;
});
