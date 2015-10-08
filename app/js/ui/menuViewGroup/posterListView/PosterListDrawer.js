define(['framework/Drawer', 'helper/UIHelper', 'cca/DefineView', 'helper/DrawerHelper'],
	function (Drawer, UIHelper, DefineView, DrawerHelper) {
		var _this = null;
		var MINIMUM_SCROLL_BAR_SIZE = 20;


		var PosterListDrawer = function (_id, _model, type) {
			this.type = type ? type : PosterListDrawer.TYPE_NORMAL_CATEGORY;
			Drawer.call(this, _id, _model);
			this.templateList = {
				'layout'	: new EJS({url: 'js/ui/menuViewGroup/posterListView/LayoutTemplate.ejs'}),
				'list'		: new EJS({url: 'js/ui/menuViewGroup/posterListView/ListTemplate.ejs'})
			};
//			console.log('_model: ' + _model);
			_this = this;
		}

		PosterListDrawer.prototype = Object.create(Drawer.prototype);
		PosterListDrawer.prototype.onCreateLayout = function () {
			_this = this;
			this.setContainer(DrawerHelper.getEmptySubViewContainer(getElementID() + ".bg_right .subViewArea"));
			var result = _this.templateList.layout.render({model: this.model});
			this.getContainer().html(result);
		};
		PosterListDrawer.prototype.onPaint = function () {
			if(this.model.getData()) {
				var result = _this.templateList.list.render({model: this.model, 'UIHelper': UIHelper});
				this.getContainer().find('#vod_list01').html(result);
                //if(this.active) {
                //    drawScrollBar();
                //}
				drawTotalCount();
			}
		};
		PosterListDrawer.prototype.onAfterPaint = function () {
			var textListButton = getTextListButton();
			if(this.active) {
                drawScrollBar();
				drawFocus();
				// if(textListButton != undefined && _this.type != PosterListDrawer.TYPE_SEARCH_RESULT_CATEGORY) {
					textListButton.show();
				// } else {
				// 	textListButton.hide();
				// }
				drawIndicatorFocus();
			} else {
                hideScrollBar();
				drawUnFocus();
				if(textListButton != undefined) {
					textListButton.hide();
				}
				drawIndicatorUnfocus();
			}
			drawInfoText();
		};
		PosterListDrawer.prototype.setActive = function (_value) {
			//@Comment 해당 드로어의 _this 가 바뀐 상태에서 onActive로 진입하여 _this 가 잘못매칭되어 있는 경우를 위한 방어코드
			_this = this;
			Drawer.prototype.setActive.call(this, _value);
		}

		function getElementID() {
			return '#' + _this.type + ' ';
		}

		function getScrollMaxHeight() {
			return _this.getContainer().find('.scrollbg').height();
		}

		function getScrollStepDistance() {
			return getScrollMaxHeight() / (_this.model.getVMax() + 1);
		}

		function getScrollBarHeight() {
			return Math.max(getScrollStepDistance() * 2, MINIMUM_SCROLL_BAR_SIZE);
			//return getScrollStepDistance() * 2;
		}

		function drawScrollBar() {
            if (_this.model.getVMax() > 2) {
				var scrollbar = _this.getContainer().find('.scroll');
				var scrollbarHeitght = getScrollBarHeight();
				var scrollbarTop = getScrollStepDistance() * (_this.model.getVStartIndex() + _this.model.getVIndex());
				scrollbar.height(scrollbarHeitght);
				scrollbar.css('top', scrollbarTop);
				_this.getContainer().find('.scrollbg').show();
			} else {
				_this.getContainer().find('.scrollbg').hide();
			}
		}

        function hideScrollBar() {
			_this.getContainer().find('.scrollbg').hide();
        }

		function drawTotalCount() {
			_this.getContainer().find('.info_text span.bold').html(_this.model.getTotalCount());
		}
		function getFocusIndexItem() {
			var vIndex = _this.model.getVIndex();
			var hIndex = _this.model.getHIndex();
//			console.log('vIndex: ' + vIndex + ', hIndex: ' + hIndex);
			drawUnFocus();

			var row = _this.getContainer().find('#vod_list01 .poster_group01').eq(vIndex);
			var focusItem = row.find('.poster').eq(hIndex);
			return focusItem;
		}
		function getTextListButton() {
			return _this.getContainer().find('#vod_list01 .bt_bottom');
		}
		function drawFocus () {
            //if( (_this.model.getVStartIndex() + _this.model.getVIndex()) < (_this.model.getVMax() - 1 ) )
   
			getFocusIndexItem().addClass('focus');
		}
		function drawUnFocus () {

			_this.getContainer().find('.poster_group01 .focus').removeClass('focus');
		}
		function drawIndicatorFocus()	{
			if(_this.model.getVMax() > 2) {
				_this.getContainer().find('.dim').show();
			}
			else	{
				_this.getContainer().find('.dim').hide();
			}
            
		}
		function drawIndicatorUnfocus()	{
			_this.getContainer().find('.dim').hide();
            
		}
		function drawInfoText()	{
			var infoText = "";
			if(getElementID().indexOf("#searchResultCategoryListView") > -1)	{
				infoText = CCABase.StringSources.posterSearchInfoText;
			}
			else	{
				infoText = CCABase.StringSources.posterVODInfoText;
			}
			_this.getContainer().find('.info_text span.normal').text(infoText);
		}
		PosterListDrawer.TYPE_NORMAL_CATEGORY = 'categoryListView'
		PosterListDrawer.TYPE_RESULT_CATEGORY = "resultCategoryListView";
		PosterListDrawer.TYPE_SEARCH_RESULT_CATEGORY = "searchResultCategoryListView";

		return PosterListDrawer;
});