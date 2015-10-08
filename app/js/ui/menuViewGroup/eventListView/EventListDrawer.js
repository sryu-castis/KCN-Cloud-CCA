define(["framework/Drawer", "ui/menuViewGroup/eventListView/EventListModel", "helper/UIHelper", "helper/DrawerHelper"],
	function (Drawer, EventListModel, UIHelper, DrawerHelper) {
	var EventListDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {
        	'onLayout'		: new EJS({url: 'js/ui/menuViewGroup/eventListView/LayoutTemplate.ejs'}),
        	'offLayout'	: new EJS({url: 'js/ui/menuViewGroup/finishedEventListView/LayoutTemplate.ejs'}),
        	'list'			: new EJS({url: 'js/ui/menuViewGroup/eventListView/ListTemplate.ejs'})
        };
		var _this = this;
		EventListDrawer.prototype.onCreateLayout = function() {
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);

			var layout = this.model.eventStatus == EventListDrawer.TYPE_ON_LAYOUT ? this.templateList.onLayout : this.templateList.offLayout
			var result = layout.render({model:this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
			this.myRootElement = tempContainer.find('#mytv .list_wrap');
			_this = this;

			//this.timerContainer = $('#mytv');
		};
		
		EventListDrawer.prototype.onPaint = function() {
			if(_this.model.getData()) {
				var result = _this.templateList.list.render({model:this.model, 'UIHelper':UIHelper});
				this.myRootElement.html(result);
			};
		};
		EventListDrawer.prototype.onAfterPaint = function() {
			if(this.active) {
				drawUnfocus();
				drawFocus();
			} else {
				drawUnfocus();
			};
			drawPager();
			drawArrow();
		};

		function getEveryRow() {
			return _this.myRootElement.find('tr:gt(0)');
		};

		function getArrow() {
			return _this.getContainer().find('#mytv .page .pagedown');
		};

		function getPager() {
			return _this.getContainer().find('#mytv .page .pagenum');
		}
		function drawPager() {
			var pager = getPager();
			var eventList = _this.model.getData();
			if(eventList == null || eventList == 0) {
				pager.hide();
			} else {
				var now = pager.find('.now');
				var all = pager.find('.all');

				// var totalPage = Math.ceil(eventList.length / _this.model.getVVisibleSize());
			 //    var currentPage = _this.model.getVStartIndex() / _this.model.getVVisibleSize() + 1;
			 	var totalCount = eventList.length;
			 	var index = _this.model.getVStartIndex() + _this.model.getVIndex() + 1;
				now.text(index);
				all.text(totalCount);
				pager.show();
			};
		};

		function drawArrow() {
			var arrow = getArrow();
			if(_this.model.getData() != undefined && _this.model.getData().length > _this.model.getVMax()-1) {
				arrow.show();
			} else {
				arrow.hide();
			};
		};

		function drawFocus() {
			var rows = getEveryRow();
			var vIndex = _this.model.getVIndex();
			rows.eq(vIndex).removeClass('unfocus').addClass('focus');

			var arrow = getArrow();
			arrow.removeClass('unfocus').addClass('focus');
		};

		function drawUnfocus() {
			getEveryRow().removeClass('focus').addClass('unfocus');
			getArrow().removeClass('focus').addClass('unfocus');
		};
    };
	EventListDrawer.prototype = Object.create(Drawer.prototype);
	EventListDrawer.TYPE_ON_LAYOUT 	= 10;
	EventListDrawer.TYPE_OFF_LAYOUT = 20
	
	return EventListDrawer;
});
