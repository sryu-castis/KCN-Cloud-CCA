define(["framework/Drawer", "ui/menuViewGroup/textListView/TextListModel", "helper/UIHelper", "helper/DrawerHelper"], function (Drawer, Model, UIHelper, DrawerHelper) {
	var TextListDrawer = function(_id, _model, type) {
        Drawer.call(this, _id, _model);
		this.type = type ? type : TextListDrawer.TYPE_NORMAL_CATEGORY;
		this.templateList = {
			'layout'	: new EJS({url: 'js/ui/menuViewGroup/textListView/LayoutTemplate.ejs'}),
			'list'		: new EJS({url: 'js/ui/menuViewGroup/textListView/ListTemplate.ejs'})
		};
		var _this = this;

		TextListDrawer.prototype.onCreateLayout = function() {
			_this = this;
			this.setContainer(DrawerHelper.getEmptySubViewContainer(getElementID() + ".bg_right .subViewArea"));
			var result = _this.templateList.layout.render({model: this.model});
			this.getContainer().html(result);

			//this.timerContainer = $('.vod_ranking');
		};
		
		TextListDrawer.prototype.onPaint = function() {
			if(this.model.getData()) {
				var result = _this.templateList.list.render({model: this.model, selectedItemIndex: getSelectedItemIndex(), 'UIHelper': UIHelper});
				_this.getContainer().find('#vod_ranking .center').html(result);
				drawTotalCount();
			};
		};
		TextListDrawer.prototype.onAfterPaint = function () {
			var posterListButton = getPosterListButton();
			if(this.active) {
				drawFocus();
				if(posterListButton != undefined) {
					posterListButton.show();
				}
			} else {
				drawUnFocus();
				if(posterListButton != undefined) {
					posterListButton.hide();
				}
			}
			drawInfoText();
		};
		TextListDrawer.prototype.setActive = function (_value) {
			//@Comment 해당 드로어의 _this 가 바뀐 상태에서 onActive로 진입하여 _this 가 잘못매칭되어 있는 경우를 위한 방어코드
			_this = this;
			Drawer.prototype.setActive.call(this, _value);
		}


		function getElementID() {
			return '#' + _this.type + ' ';
		}

		function drawTotalCount() {
			_this.getContainer().find('.info_text span.bold').html(_this.model.totalCount);
		};
		function getSelectedItemIndex() {
			return _this.model.getVIndex() * _this.model.getHVisibleSize() + _this.model.getHIndex();
		};
		function getFocusIndexItem() {
			var vIndex = _this.model.getVIndex();
			var hIndex = _this.model.getHIndex();
//			console.log('vIndex: ' + vIndex + ', hIndex: ' + hIndex);
			drawUnFocus();

			var col = _this.getContainer().find('#vod_ranking .list_group01').eq(hIndex);
			var focusItem = col.find('.list').eq(vIndex);
			return focusItem;
		};
		function getPosterListButton() {
			return _this.getContainer().find('#vod_ranking .bt_bottom');
		};
		function drawFocus () {
			getFocusIndexItem().addClass('focus');
		};
		function drawUnFocus () {
			_this.getContainer().find('#vod_ranking .list_group01 .focus').removeClass('focus');
		};
		function drawInfoText()	{
			var infoText = "";
			if(getElementID().indexOf("#searchResultCategoryListView") > -1)	{
				infoText = CCABase.StringSources.posterSearchInfoText;
			}
			else	{
				infoText = CCABase.StringSources.posterVODInfoText;
			}
			$(getElementID() + '.info_text span.normal').text(infoText);
		};
    };
	TextListDrawer.prototype = Object.create(Drawer.prototype);
	TextListDrawer.TYPE_NORMAL_CATEGORY = 'categoryListView'
	TextListDrawer.TYPE_RESULT_CATEGORY = "resultCategoryListView";
	TextListDrawer.TYPE_SEARCH_RESULT_CATEGORY = 'searchResultCategoryListView';
	
	return TextListDrawer;
});
