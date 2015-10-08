define(["framework/Drawer", "ui/playerViewGroup/nextWatchPopupView/NextWatchPopupModel", "helper/UIHelper"], function (Drawer, NextWatchPopupModel, UIHelper) {
    var NextWatchPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/playerViewGroup/nextWatchPopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        NextWatchPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        NextWatchPopupDrawer.prototype.onPaint = function () {
        	var result = this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper});
            this.getContainer().html(result);
            setButtonElement();
            //this.timerContainer = $('.popup_large');
        };

        NextWatchPopupDrawer.prototype.onAfterPaint = function () {
        	drawFocusForButton();
        };

        function setButtonElement() {
            var buttonGroup = _this.model.getButtonGroup();
            var buttonElementList = $('#'+_id+' #popup_large .area_btn >');
            var size = buttonGroup.getSize();
            for (var i = 0; i < size; i++) {
                buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
            }
        };

        function drawFocusForButton() {
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
       
//        NextWatchPopupDrawer.prototype.onDestroy = function ()	{
//            this.getContainer().hide();
//        }
    };
    NextWatchPopupDrawer.prototype = Object.create(Drawer.prototype);


    return NextWatchPopupDrawer;
});
