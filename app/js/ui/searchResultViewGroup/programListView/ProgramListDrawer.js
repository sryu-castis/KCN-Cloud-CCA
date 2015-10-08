define(["framework/Drawer", "ui/searchResultViewGroup/programListView/ProgramListModel", "helper/UIHelper", "helper/DrawerHelper"], function (Drawer, ProgramListModel, UIHelper, DrawerHelper) {
	var ProgramListDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {
        	'layout'		: new EJS({url: 'js/ui/searchResultViewGroup/programListView/LayoutTemplate.ejs'}),
        	'list'			: new EJS({url: 'js/ui/searchResultViewGroup/programListView/ListTemplate.ejs'})
        };
		var _this = this;
		ProgramListDrawer.prototype.onCreateLayout = function() {
			this.setContainer(DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea"));
			var result = _this.templateList.layout.render({model:this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
			this.myRootElement = this.getContainer().find('#detail_program');
			_this = this;

			//this.timerContainer = this.myRootElement;
		};
		
		ProgramListDrawer.prototype.onPaint = function() {
			if(_this.model.getData() != undefined) {
				var result = _this.templateList.list.render({model:this.model, 'UIHelper':UIHelper});
				_this.myRootElement.html(result);

				setTotalCount();
			};
		};
		ProgramListDrawer.prototype.onAfterPaint = function() {
			if(this.active) {
				drawUnfocus();
				drawFocus();
			} else {
				drawUnfocus();
			};
			drawArrow();
		};

		function getEveryRow() {
			return _this.getContainer().find('.list');
		};

		function getArrow() {
			return _this.getContainer().find('.arw_down');
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
			var selectedRow = rows.eq(vIndex);
			selectedRow.removeClass('unfocus').addClass('focus');
			selectedRow.find('.text').css('display', 'none');
			selectedRow.find('.graph').css('display', 'inline');
			// selectedRow.find('.text').hide();
			// selectedRow.find('.graph').show();

			var arrow = getArrow();
			arrow.removeClass('unfocus').addClass('focus');
		};

		function drawUnfocus() {
			var rows = getEveryRow();
			rows.removeClass('focus').addClass('unfocus');
			rows.find('.text').show();
			rows.find('.graph').hide();
			getArrow().removeClass('focus').addClass('unfocus');
		};

		function setTotalCount() {
			var totalCount = _this.model.getData().length;
			_this.getContainer().find('.info_text_none span.bold').text(totalCount);
		};
    };
	ProgramListDrawer.prototype = Object.create(Drawer.prototype);
	
	return ProgramListDrawer;
});
