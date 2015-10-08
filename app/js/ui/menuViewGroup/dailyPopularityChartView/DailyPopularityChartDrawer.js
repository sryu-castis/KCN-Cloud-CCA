define(["framework/Drawer", "ui/menuViewGroup/dailyPopularityChartView/DailyPopularityChartModel", 
	"helper/UIHelper", "helper/DrawerHelper"], function (Drawer, Model, UIHelper, DrawerHelper) {
	var DailyPopularityChartDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
		this.templateList = {
			'layout'	: new EJS({url: 'js/ui/menuViewGroup/dailyPopularityChartView/LayoutTemplate.ejs'}),
			'list'		: new EJS({url: 'js/ui/menuViewGroup/dailyPopularityChartView/ListTemplate.ejs'}),
			'poster'	: new EJS({url: 'js/ui/menuViewGroup/dailyPopularityChartView/PosterTemplate.ejs'})
		};

		var _this = this;

		DailyPopularityChartDrawer.prototype.onCreateLayout = function() {
			_this = this;
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);

			var result = this.templateList.layout.render();
			this.getContainer().html(result);
			_this.myRootElement = tempContainer.find('#vod_ranking02 .center .mainarea_text_01');

			//this.timerContainer = $('#vod_ranking02');
		};
		
		DailyPopularityChartDrawer.prototype.onPaint = function() {
			/*var result = new EJS({url: 'js/ui/menuViewGroup/previewView/LayoutTemplate.ejs'}).render({model:this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);*/
			if(this.model.getPopularityList() && _this.myRootElement != undefined) {
				var type = _this.myRootElement.selector.search('vod_ranking02') < 0 ? 'searchRanking' : 'vodRanking';
				var result = _this.templateList.list.render({model:this.model, 'UIHelper': UIHelper, 'type': type});
				_this.myRootElement.html(result);
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

		/*function getEveryItems() {
			return _this.myRootElement.find('.list_group01 .list');
		};

		function getArrow() {
			return _this.myRootElement.find('.area_page .arw');
		};

		function getFocusIndexItem() {
			var vIndex = _this.model.getVIndex();
			console.log('vIndex: ' + vIndex);

			return getEveryItems().eq(vIndex);
		};
		function drawFocus () {
			drawUnfocus();
			getFocusIndexItem().addClass('focus');

			var arrow = getArrow();
			arrow.addClass('focus');
		};
		function drawUnfocus() {
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
	DailyPopularityChartDrawer.prototype = Object.create(Drawer.prototype);
	
	
	return DailyPopularityChartDrawer;
});
