define(["framework/Drawer", "ui/mytvViewGroup/helpMenuView/HelpMenuModel", "helper/DrawerHelper"], function (Drawer, HelpMenuModel, DrawerHelper) {
    var HelpMenuDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/mytvViewGroup/helpMenuView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        HelpMenuDrawer.prototype.onCreateLayout = function () {
            var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
            this.setContainer(tempContainer);
        };

        HelpMenuDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['layout'].render({model: this.model});
			this.getContainer().html(result);
        };
        HelpMenuDrawer.prototype.onAfterPaint = function () {
        	if(this.active)  {
        		drawFocusForButton();
            }
            else     {
                drawUnfocusForButton();
            }
            
        };

        function drawFocusForButton()   {
            var focusIndex =_this.model.getButtonGroup().getIndex();
            var listItems = $("#mytv .bt_147");
            var focusItem = listItems.eq(focusIndex);
            focusItem.addClass("focus");
        }

        function drawUnfocusForButton() {
            var focusIndex =_this.model.getButtonGroup().getIndex();
            var listItems = $("#mytv .bt_147");
            var focusItem = listItems.eq(focusIndex);
            focusItem.removeClass("focus");
        }

    };
    HelpMenuDrawer.prototype = Object.create(Drawer.prototype);


    return HelpMenuDrawer;
});
