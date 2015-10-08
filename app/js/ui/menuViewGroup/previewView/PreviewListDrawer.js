define(["framework/Drawer", "ui/menuViewGroup/previewView/PreviewListModel", "helper/UIHelper", 'helper/DrawerHelper'],
	function (Drawer, Model, UIHelper, DrawerHelper) {
	var PreviewListDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
		this.templateList = {'layout': new EJS({url: 'js/ui/menuViewGroup/previewView/LayoutTemplate.ejs'})};
		var _this = this;

		PreviewListDrawer.prototype.onCreateLayout = function() {
			_this = this;
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);
			//this.timerContainer = tempContainer;
		};
		
		PreviewListDrawer.prototype.onPaint = function() {
			var result = this.templateList['layout'].render({model:this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
		};
		PreviewListDrawer.prototype.onAfterPaint = function() {
			drawDim();
		};

		function drawDim() {
			/*if(_this.model.getVVisibleSize() >= _this.model.getVMax()) {
				$('.tx_dim_2').hide();
			} else {
				$('.tx_dim_2').show();
			}*/
		}
    };
	PreviewListDrawer.prototype = Object.create(Drawer.prototype);
	
	
	return PreviewListDrawer;
});
