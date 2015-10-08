define(["framework/Drawer", "ui/popupViewGroup/choicePopupView/ChoicePopupModel"], function (Drawer, ChoicePopupModel) {
    var ChoicePopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/popupViewGroup/choicePopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        ChoicePopupDrawer.prototype.onCreateLayout = function () {
            _this = this;
            //this.createContainer(_id);
        };

        ChoicePopupDrawer.prototype.onPaint = function () {
            console.log(this.model);
            var result = _this.templateList['layout'].render({model: this.model});
            this.getContainer().html(result);
            setButtonElement();
        };

        ChoicePopupDrawer.prototype.onAfterPaint = function () {
            drawButton();
        };

        function setButtonElement() {
            var buttonGroup = _this.model.getButtonGroup();
            var buttonElementList = $('#'+_this.id+' #popup_m .area_btn >');
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

            if(_this.isActive()) {
                buttonGroup.getFocusedButton().setFocus();
            }
        }
    };
    ChoicePopupDrawer.prototype = Object.create(Drawer.prototype);


    return ChoicePopupDrawer;
});
