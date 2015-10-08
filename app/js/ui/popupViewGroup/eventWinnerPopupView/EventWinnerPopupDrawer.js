define(["framework/Drawer", "ui/popupViewGroup/eventWinnerPopupView/EventWinnerPopupModel"], function (Drawer, EventWinnerPopupModel) {
    var EventWinnerPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {
            'layout': new EJS({url: 'js/ui/popupViewGroup/eventWinnerPopupView/LayoutTemplate.ejs'}),
            'list'  : new EJS({url: 'js/ui/popupViewGroup/eventWinnerPopupView/ListTemplate.ejs'})
        };
        var _this = this;

        EventWinnerPopupDrawer.prototype.onCreateLayout = function () {
            var result = _this.templateList['layout'].render();
            this.getContainer().html(result);
            //_this.timerContainer = $('#popup_large');
        };

        EventWinnerPopupDrawer.prototype.onPaint = function () {
            var result = _this.templateList['list'].render({model: this.model});
            $('#popup_large .bg_mid').html(result);       
        };

        EventWinnerPopupDrawer.prototype.onAfterPaint = function () {
            drawArrows();
        };

        function getArrows() {
            return $('#popup_large .popup_list_body span:even')
        };
        function drawArrows() {
            if(_this.model.getTotalPage() > 0) {
                getArrows().show();
            } else {
                getArrows().hide();
            };
        };
    };
    EventWinnerPopupDrawer.prototype = Object.create(Drawer.prototype);

    return EventWinnerPopupDrawer;
});
