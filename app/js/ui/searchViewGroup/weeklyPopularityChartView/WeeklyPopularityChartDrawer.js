define(["framework/Drawer", "ui/menuViewGroup/weeklyPopularityChartView/WeeklyPopularityChartModel", 
		"helper/UIHelper", "helper/DrawerHelper"], function (Drawer, Model, UIHelper, DrawerHelper) {
	var WeeklyPopularityChartDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {
        	'list'		: new EJS({url: 'js/ui/menuViewGroup/weeklyPopularityChartView/ListTemplate.ejs'})
        };
		var _this = this;

		WeeklyPopularityChartDrawer.prototype.onCreateLayout = function() {
			_this = this;
			this.setContainer($('#ranking_search .mainarea_text_02:even'));
			_this.myRootElement = $('#ranking_search .mainarea_text_02:even');
		};
		
		WeeklyPopularityChartDrawer.prototype.onPaint = function() {
			/*var result = new EJS({url: 'js/ui/menuViewGroup/previewView/LayoutTemplate.ejs'}).render({model:this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);*/
			if(this.model.getPopularityList()) {
				var type = _this.myRootElement.selector.search('vod_ranking02') < 0 ? 'searchRanking' : 'vodRanking';
				var result = _this.templateList.list.render({model:this.model, 'UIHelper': UIHelper, 'type': type});
				_this.myRootElement.html(result);
			};
		};
		WeeklyPopularityChartDrawer.prototype.onAfterPaint = function() {
			if(this.active) {
				_this.myRootElement.addClass('focus');
				_this.myRootElement.removeClass('unfocus');
				// drawFocus();
				DrawerHelper.drawFocus(_this);
				var arrow = _this.myRootElement.find('.arw');
				arrow.addClass('focus');
				arrow.removeClass('unfocus');
			} else {
				_this.myRootElement.removeClass('focus');
				_this.myRootElement.addClass('unfocus');
				// drawDim();
				DrawerHelper.drawDim(_this);
				var arrow = _this.myRootElement.find('.arw');
				arrow.addClass('unfocus');
				arrow.removeClass('focus');
			};
		};
		WeeklyPopularityChartDrawer.prototype.updatePoster = function(asset) {
			var posterInfo = (asset == null) ? {} : this.model.posterInfo;
			var result = _this.templateList.list.render({'asset':asset, 'chartType': posterInfo.chartType, 'ranking': posterInfo.ranking, 'UIHelper':UIHelper});
			var container = $("#vod_ranking02 .mainarea_poster");
			container.html(result);
		};
    };
	WeeklyPopularityChartDrawer.prototype = Object.create(Drawer.prototype);
	
	
	return WeeklyPopularityChartDrawer;
});
