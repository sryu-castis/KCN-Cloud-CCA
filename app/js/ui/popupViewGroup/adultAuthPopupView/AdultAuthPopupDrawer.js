define(["framework/Drawer", "ui/popupViewGroup/adultAuthPopupView/AdultAuthPopupModel"], function (Drawer, AdultAuthPopupModel) {
    var AdultAuthPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/popupViewGroup/adultAuthPopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        AdultAuthPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        AdultAuthPopupDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['layout'].render({model: this.model});
			this.getContainer().html(result);
            setButtonElement();
            setInputFieldElement();
        };
        
        AdultAuthPopupDrawer.prototype.onAfterPaint = function () {
            drawButton();
            drawInputField();
        };


        function setButtonElement() {
            var buttonGroup = _this.model.getButtonGroup();

            var buttonElementList = $("#"+_id+" .area_btn >");
            var size = buttonGroup.getSize();
            for (var i = 0; i < size; i++) {
                buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
            }
        };

        function setInputFieldElement() {
            var inputField = _this.model.getInputField();
            inputField.setElement($("#"+_id+" .body_serialbox_confirm01"));
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
        };

        function isFocusOnInputField() {
            return _this.model.getVIndex() == 0;
        }
    };
    AdultAuthPopupDrawer.prototype = Object.create(Drawer.prototype);


    return AdultAuthPopupDrawer;
});
