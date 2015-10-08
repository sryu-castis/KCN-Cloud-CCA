define(["framework/Drawer", "helper/DrawerHelper"], function (Drawer, DrawerHelper) {
	var ModDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {
        	'layout'		: new EJS({url: 'js/ui/menuViewGroup/modView/LayoutTemplate.ejs'})
        };

		ModDrawer.prototype.onCreateLayout = function() {
			DrawerHelper.cleanSubViewArea();
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);

			var result = this.templateList.layout.render();
			this.getContainer().html(result);
		};

		ModDrawer.prototype.onAfterPaint = function() {
			focusButton(this.active);
		};

		function focusButton(isFocus) {
			if(isFocus == true) {
				$('.joy_position').removeClass('unfocus').addClass('focus');
			} else {
				$('.joy_position').removeClass('focus').addClass('unfocus');
			}
		};

    };
	ModDrawer.prototype = Object.create(Drawer.prototype);

	return ModDrawer;
});
