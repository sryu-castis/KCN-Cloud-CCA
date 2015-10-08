define(["framework/Drawer", "helper/DrawerHelper"], function (Drawer, DrawerHelper) {
	var NoDataDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {
        	'layout'		: new EJS({url: 'js/ui/menuViewGroup/noDataView/LayoutTemplate.ejs'})
        };

		NoDataDrawer.prototype.onCreateLayout = function() {
			DrawerHelper.cleanSubViewArea();
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);

			var result = this.templateList.layout.render({'message': this.model.getMessage()});
			this.getContainer().html(result);
		};

    };
	NoDataDrawer.prototype = Object.create(Drawer.prototype);

	return NoDataDrawer;
});
