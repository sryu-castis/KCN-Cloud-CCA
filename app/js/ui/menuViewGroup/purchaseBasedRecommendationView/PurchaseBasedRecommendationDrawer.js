define(["framework/Drawer", "ui/menuViewGroup/purchaseBasedRecommendationView/PurchaseBasedRecommendationModel", 
	"helper/UIHelper", "helper/DrawerHelper"], function (Drawer, Model, UIHelper, DrawerHelper) {
	var PurchaseBasedRecommendationDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {
        	'layout'	: new EJS({url: 'js/ui/menuViewGroup/purchaseBasedRecommendationView/LayoutTemplate.ejs'}),
        	'list'		: new EJS({url: 'js/ui/menuViewGroup/purchaseBasedRecommendationView/ListTemplate.ejs'})
        };
		var _this = this;

		PurchaseBasedRecommendationDrawer.prototype.onCreateLayout = function() {
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);

			var result = _this.templateList.layout.render({model:this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);

			//this.timerContainer = $('#vod_reco');
		};
		
		PurchaseBasedRecommendationDrawer.prototype.onPaint = function() {
			if(_this.model.getPurchaseLogList() != undefined && _this.model.getPurchaseLogList() != null) {
				var result = _this.templateList.list.render({model:this.model});
				this.getContainer().find('#vod_reco .list_group').html(result);
			};
		};
		PurchaseBasedRecommendationDrawer.prototype.onAfterPaint = function() {
			if(this.active) {
				drawFocus();
				drawFocusOnArrow();
			} else {
				drawUnfocus();
				drawUnfocusOnArrow();
			};
		};

		function getFocusItem() {
			var index = _this.model.getVIndex();
			return _this.getContainer().find('#vod_reco .list li').eq(index);
		};

		function drawFocus() {
			drawUnfocus();
			var item = getFocusItem();
			item.removeClass('unfocus');
			item.addClass('focus');
		};

		function drawUnfocus() {
			var everyItem = _this.getContainer().find('#vod_reco .list li');
			everyItem.removeClass('focus');
			everyItem.addClass('unfocus');
		};

		function getArrow() {
			return _this.getContainer().find('#vod_reco .page .pagedown');
		};

		function drawFocusOnArrow() {
			var arrow = getArrow();
			arrow.removeClass('unfocus');
			arrow.addClass('focus');
		};

		function drawUnfocusOnArrow() {
			var arrow = getArrow();
			arrow.removeClass('focus');
			arrow.addClass('unfocus');
		};

    };
	PurchaseBasedRecommendationDrawer.prototype = Object.create(Drawer.prototype);
	
	
	return PurchaseBasedRecommendationDrawer;
});
