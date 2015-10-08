define(["framework/Drawer", "ui/menuViewGroup/weeklyPopularityChartView/WeeklyPopularityChartModel", 
		"helper/UIHelper", "helper/DrawerHelper"], function (Drawer, Model, UIHelper, DrawerHelper) {
	var WeeklyPopularityChartDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {
        	'layout'	: new EJS({url: 'js/ui/menuViewGroup/weeklyPopularityChartView/ListTemplate.ejs'}),
        	'list'		: new EJS({url: 'js/ui/menuViewGroup/dailyPopularityChartView/PosterTemplate.ejs'})
        };
		var _this = this;

		WeeklyPopularityChartDrawer.prototype.onCreateLayout = function() {
			// this.setContainer($(".bg_right .subViewArea"));
			// var result = new EJS({url: 'js/ui/menuViewGroup/weeklyPopularityChartView/LayoutTemplate.ejs'})
			// 	.render({model:this.model});
			// this.getContainer().html(result);
			_this = this;
			this.setContainer($('#vod_ranking02 .center .mainarea_text_02'));
			_this.myRootElement = $('#vod_ranking02 .center .mainarea_text_02');

			//this.timerContainer = $('#vod_ranking02');
		};
		
		WeeklyPopularityChartDrawer.prototype.onPaint = function() {
			/*var result = new EJS({url: 'js/ui/menuViewGroup/previewView/LayoutTemplate.ejs'}).render({model:this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);*/
			if(this.model.getPopularityList()) {
				var type = _this.myRootElement.selector.search('vod_ranking02') < 0 ? 'searchRanking' : 'vodRanking';
				var result = _this.templateList.layout.render({model:this.model, 'UIHelper': UIHelper, 'type': type});
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

		/*function getEveryItems() {
			return _this.myRootElement.find('.list_group01 .list');
		};

		function getArrow () {
			return _this.myRootElement.find('.area_page .arw');
		}

		function getFocusIndexItem() {
			var vIndex = _this.model.getVIndex();
			console.log('vIndex: ' + vIndex);

			return getEveryItems().eq(vIndex);
		};
		function drawFocus () {
			drawUnFocus();
			getFocusIndexItem().addClass('focus');

			var arrow = getArrow();
			arrow.addClass('focus');
		};
		function drawUnFocus() {
			var everyList = getEveryItems();
			everyList.removeClass('dim');
			everyList.removeClass('focus');
			everyList.addClass('unfocus');
		};
		function drawDim() {
			var everyList = getEveryItems();
			everyList.removeClass('focus');
			everyList.removeClass('unfocus');
			everyList.addClass('dim');

			var arrow = getArrow();
			arrow.removeClass('focus');
		};*/

    };
	WeeklyPopularityChartDrawer.prototype = Object.create(Drawer.prototype);
	
	
	return WeeklyPopularityChartDrawer;
});
