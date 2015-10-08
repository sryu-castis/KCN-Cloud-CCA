define(["framework/Drawer", "framework/event/CCAEvent"],
    function (Drawer, CCAEvent) {
    var LayoutDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        //@Comment: List 또는 layout 이 여러개 일땐 알아서 이름 맵핑해서 사용하시면 됩니다
        this.templateList = {'layout': new EJS({url: 'js/ui/mainMenuViewGroup/layout/LayoutTemplate.ejs'})};
        var _this = this;
        var isFirstDraw = false;

        LayoutDrawer.prototype.onCreateLayout = function () {
            _this = this;
            isFirstDraw = true;
            this.createContainer("mainMenu");
            reorderContainer();
        };

        LayoutDrawer.prototype.onPaint = function () {
            var result = this.templateList['layout'].render({model: this.model});
            this.getContainer().html(result);
        };
        LayoutDrawer.prototype.onAfterPaint = function () {
            /*if(!this.model.isNullData()) {
                sendCompleteDrawEvent();
            }*/
        };

        function reorderContainer() {
            //@Comment 복원시 mainMenu 컨테이너가 아래 있음으로해서 생기는 렌더링 이슈를 위한 처리
            if(_this.getContainer().prev()[0]) {
                var firstItem = $(".container").eq(0);
                _this.getContainer().insertBefore(firstItem);
            }
        }


        function sendCompleteDrawEvent() {
            if (isFirstDraw) {
                isFirstDraw = false;
                _this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
            }
        }
    };
    LayoutDrawer.prototype = Object.create(Drawer.prototype);

    return LayoutDrawer;
});
