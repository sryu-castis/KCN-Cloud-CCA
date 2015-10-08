define(["framework/Drawer", "ui/playerViewGroup/exitPopupView/ExitPopupModel", "helper/UIHelper"], function (Drawer, ExitPopupModel, UIHelper) {
    var ExitPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/playerViewGroup/exitPopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        ExitPopupDrawer.prototype.onCreateLayout = function () {
            
        };

        ExitPopupDrawer.prototype.onPaint = function () {
        	var result = this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper});
            this.getContainer().html(result);
            setButtonElement();
            //this.timerContainer = $('.popup_large');
        };

        ExitPopupDrawer.prototype.onAfterPaint = function () {
            drawButton();
            drawItem();
        };

        function setButtonElement() {
            var buttonGroup = _this.model.getButtonGroup();
            if(buttonGroup != null){
            	var buttonElementList = $('#' + _this.id + ' #popup_large .area_btn_finish >');
                var size = buttonGroup.getSize();
                for (var i = 0; i < size; i++) {
                    buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
                }
            }
            
        };

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

                if(_this.isActive() && isButtonGroupState()) {
                    buttonGroup.getFocusedButton().setFocus();
                }
            }
            
        }

        function drawItem() {
            var item = $('#popup_large .poster_list');
            item.removeClass("focus");

            if (isButtonGroupState()) {
                item.addClass("unfocus");
            } else {
                item.eq(_this.model.getHFocusIndex()).removeClass("unfocus");
                item.eq(_this.model.getHFocusIndex()).addClass("focus");
            }
        }


        function isButtonGroupState() {
            return _this.model.getVIndex() == 0;
        }
        
    };
    ExitPopupDrawer.prototype = Object.create(Drawer.prototype);


    return ExitPopupDrawer;
});