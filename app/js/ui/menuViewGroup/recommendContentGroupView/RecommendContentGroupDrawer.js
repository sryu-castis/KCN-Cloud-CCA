define(["framework/Drawer", "ui/menuViewGroup/recommendContentGroupView/RecommendContentGroupModel", 
	"helper/UIHelper", "helper/DrawerHelper"], function (Drawer, Model, UIHelper, DrawerHelper) {
	var RecommendContentGroupDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {
        	'list'	: new EJS({url: 'js/ui/menuViewGroup/recommendContentGroupView/ListTemplate.ejs'})
        };
		var _this = this;

		RecommendContentGroupDrawer.prototype.onCreateLayout = function() {
			this.timerContainer = $('#vod_reco').parent();
		};
		
		RecommendContentGroupDrawer.prototype.onPaint = function() {
			if(_this.model.getData()) {
				var result = _this.templateList.list.render({model:this.model, 'UIHelper': UIHelper});
				$('#vod_reco .area_right').html(result);
			};
		};
		RecommendContentGroupDrawer.prototype.onAfterPaint = function() {
			if(this.active) {
				drawFocus();
			} else {
				drawUnfocus();
			};
		};

		function getFocusItem() {
			var row = _this.model.getVIndex();
			var column = _this.model.getHIndex();
			return $('#vod_reco .vod_list .poster_group').eq(row).find('ul.poster').eq(column);
		};

		function drawFocus() {
			drawUnfocus();
			var item = getFocusItem();
			item.addClass('focus');
		};

		function drawUnfocus() {
			var everyItem = $('#vod_reco .vod_list ul');
			everyItem.removeClass('focus');
		};

    };
	RecommendContentGroupDrawer.prototype = Object.create(Drawer.prototype);
	
	
	return RecommendContentGroupDrawer;
});
