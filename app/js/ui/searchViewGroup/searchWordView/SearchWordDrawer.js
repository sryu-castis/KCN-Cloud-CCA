define(['framework/Drawer', 'helper/UIHelper'],
	function (Drawer, UIHelper) {
		var _this = null;
		var SearchWordDrawer = function (_id, _model) {
			Drawer.call(this, _id, _model);
			this.templateList = {
				'list'	:  new EJS({url: 'js/ui/searchViewGroup/searchWordView/ListTemplate.ejs'})
			};
			_this = this;
			this.myRootElement = null;
		};

		SearchWordDrawer.prototype = Object.create(Drawer.prototype);
		SearchWordDrawer.prototype.onCreateLayout = function () {
			var container = $('#ranking_search .word');
			this.setContainer(container);
		};
		SearchWordDrawer.prototype.onPaint = function () {
			if(_this.model.getData()) {
				var wordListResult = _this.templateList.list.render({model: _this.model});
				_this.getContainer().html(wordListResult);	
			};
		};
		SearchWordDrawer.prototype.onAfterPaint = function () {
			if(this.active) {
				drawFocus();
			} else {
				drawUnfocus();
			};
		};	

		function drawFocus() {
			drawUnfocus();
			var vIndex = _this.model.getVIndex();
			$('#ranking_search .word li').eq(vIndex).addClass('focus');
		};

		function drawUnfocus() {
			$('#ranking_search .word li').removeClass('focus');
		};

		return SearchWordDrawer;
});