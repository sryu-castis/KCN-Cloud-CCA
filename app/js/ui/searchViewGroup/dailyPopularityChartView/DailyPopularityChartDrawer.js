define(["framework/Drawer", "ui/menuViewGroup/dailyPopularityChartView/DailyPopularityChartModel", 
	"helper/UIHelper", "helper/DrawerHelper"], function (Drawer, Model, UIHelper, DrawerHelper) {
	var DailyPopularityChartDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
		this.templateList = {
            'list': new EJS({url: 'js/ui/menuViewGroup/dailyPopularityChartView/ListTemplate.ejs'})
		};

		var _this = this;

		DailyPopularityChartDrawer.prototype.onCreateLayout = function() {
			_this = this;
			this.setContainer($('#ranking_search .center .mainarea_text_01'));
			_this.myRootElement = $('#ranking_search .center .mainarea_text_01');

		};
		
		DailyPopularityChartDrawer.prototype.onPaint = function() {
			/*var result = new EJS({url: 'js/ui/menuViewGroup/previewView/LayoutTemplate.ejs'}).render({model:this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);*/
			if(this.model.getPopularityList() && _this.myRootElement != undefined) {
				var type = _this.myRootElement.selector.search('vod_ranking02') < 0 ? 'searchRanking' : 'vodRanking';
				var result = _this.templateList.list.render({model:this.model, 'UIHelper': UIHelper, 'type': type});
				_this.myRootElement.html(result);
				_this.timerContainer = $('#SearchView');
			};
		};
		DailyPopularityChartDrawer.prototype.onAfterPaint = function() {
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
		DailyPopularityChartDrawer.prototype.updatePoster = function(asset) {
			var posterInfo = (asset == null) ? {} : this.model.posterInfo;
			var result = _this.templateList.poster.render({'asset':asset, 'chartType': posterInfo.chartType, 'ranking': posterInfo.ranking, 'UIHelper':UIHelper});
			var container = $("#vod_ranking02 .mainarea_poster");
			container.html(result);
		};
    };
	DailyPopularityChartDrawer.prototype = Object.create(Drawer.prototype);
	
	
	return DailyPopularityChartDrawer;
});

