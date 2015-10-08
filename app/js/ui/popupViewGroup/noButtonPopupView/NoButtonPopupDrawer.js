define(["framework/Drawer", "cca/PopupValues"], function (Drawer, PopupValues) {
    var NoButtonPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/popupViewGroup/noButtonPopupView/LayoutTemplate.ejs'})
                            , 'layout_medium': new EJS({url: 'js/ui/popupViewGroup/noButtonPopupView/LayoutMediumTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        NoButtonPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        NoButtonPopupDrawer.prototype.onPaint = function () {
            var result = null;
            if(this.model.getParam().popupType == PopupValues.PopupType.NO_BUTTON_MEDIUM) {
                result = _this.templateList['layout_medium'].render({model: this.model});
            } else {
                result = _this.templateList['layout'].render({model: this.model});
            }
			this.getContainer().html(result);
        };
        
        NoButtonPopupDrawer.prototype.onAfterPaint = function () {
        };
    };
    NoButtonPopupDrawer.prototype = Object.create(Drawer.prototype);


    return NoButtonPopupDrawer;
});
