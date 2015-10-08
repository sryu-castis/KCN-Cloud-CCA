define(["framework/Drawer", "ui/popupViewGroup/smartPhonePopupView/SmartPhonePopupModel", "helper/UIHelper"], function (Drawer, SmartPhonePopupModel, UIHelper) {
    var SmartPhonePopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/popupViewGroup/smartPhonePopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        SmartPhonePopupDrawer.prototype.onCreateLayout = function () {
            _this = this;
            //this.createContainer(_id);
        };

        SmartPhonePopupDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['layout'].render({model: _this.model, UIHelper:UIHelper});
			this.getContainer().html(result);
			setButtonElement();
            setInputFieldElement();
        };
        
        SmartPhonePopupDrawer.prototype.onAfterPaint = function () {
            drawButton();
            drawInputField();
        };
        
        function setButtonElement() {
			var buttonGroup = _this.model.getButtonGroup();

            var buttonElementList = $("#"+_this.id+" .area_btn >");
			var size = buttonGroup.getSize();
			for (var i = 0; i < size; i++) {
				buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
			}
		};

        function setInputFieldElement() {
            var inputField = _this.model.getInputField();
            inputField.setElement($("#"+_this.id+" .body_mobilebox"));
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
    SmartPhonePopupDrawer.prototype = Object.create(Drawer.prototype);


    return SmartPhonePopupDrawer;
});
