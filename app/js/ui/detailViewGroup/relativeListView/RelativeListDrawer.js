define(["framework/Drawer", "ui/detailViewGroup/relativeListView/RelativeListModel", "helper/UIHelper"], function (Drawer, Model, UIHelper) {
	var RelativeListDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
		this.templateList = {'list': new EJS({url: 'js/ui/detailViewGroup/relativeListView/ListTemplate.ejs'})};

		var _this = this;

		RelativeListDrawer.prototype.onCreateLayout = function() {
			this.setContainer($('#detail_view_full #vod_list'));
		};
		
		RelativeListDrawer.prototype.onPaint = function() {
			var result = this.templateList['list'].render({model:this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
		};
		RelativeListDrawer.prototype.onAfterPaint = function() {
			drawFocus();
		};

		function drawFocus() {
			drawUnFocus();

			if(_this.isActive()) {
				var contentGroupList = $('#detail_view_full #vod_list >');
				var focusIndex = _this.model.getHFocusIndex();
				$(contentGroupList[focusIndex]).addClass('focus');
			}
		}

		function drawUnFocus() {
			var itemList = $('#detail_view_full #vod_list >');
			for(var i = 0; i < itemList.length; i++) {
				$(itemList[i]).removeClass('focus');
			}
		}
    };
	RelativeListDrawer.prototype = Object.create(Drawer.prototype);
	
	
	return RelativeListDrawer;
});
