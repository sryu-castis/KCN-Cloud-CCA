define(['framework/Drawer', 'helper/UIHelper', 'cca/DefineView', 'helper/DrawerHelper'],
	function (Drawer, UIHelper, DefineView, DrawerHelper) {
		var _this = null;
		var SubscriberBasedRecommendationDrawer = function (_id, _model) {
			Drawer.call(this, _id, _model);
			this.templateList = {
				'layout'	: new EJS({url: 'js/ui/menuViewGroup/subscriberBasedRecommendationView/LayoutTemplate.ejs'}),
				'assetList'	: new EJS({url: 'js/ui/menuViewGroup/subscriberBasedRecommendationView/ListTemplate.ejs'}),
				'bundleList': new EJS({url: 'js/ui/menuViewGroup/bundleListView/ListTemplate.ejs'})
			};
		}

		SubscriberBasedRecommendationDrawer.prototype = Object.create(Drawer.prototype);
		SubscriberBasedRecommendationDrawer.prototype.onCreateLayout = function () {
			_this = this;
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);

			var result = _this.templateList.layout.render({model: this.model, 'UIHelper': UIHelper, 'DefineView': DefineView});
			this.getContainer().html(result);
			_this.myRootElement = this.model.getViewType() == DefineView.BUNDLE_LIST_VIEW ? tempContainer.find('#product_pack') : tempContainer.find('#mania_reco');

			//this.timerContainer = _this.myRootElement;
		};
		SubscriberBasedRecommendationDrawer.prototype.onPaint = function () {
			var data = _this.model.getData();
			if(data) {
				// var listTemplate = _this.model.getViewType() == DefineView.BUNDLE_LIST_VIEW ? _this.templateList.bundleList : _this.templateList.assetList;
				var listTemplate = (this.model.getViewType() == DefineView.BUNDLE_LIST_VIEW) ? _this.templateList.bundleList : _this.templateList.assetList;
				var result = listTemplate.render({model: this.model, 'UIHelper': UIHelper, 'DefineView': DefineView});
				_this.myRootElement.html(result);
				//drawScrollBar();
				drawTotalCount();
			};

		};
		SubscriberBasedRecommendationDrawer.prototype.onAfterPaint = function () {
			var textListButton = getTextListButton();
			textListButton.hide();
			if(this.active) {
                drawScrollBar();
				drawFocus();
				drawIndicatorFocus();
				// if(textListButton != undefined) {
				// 	textListButton.show();
				// };
			} else {
                hideScrollBar();
                drawUnFocus();
                drawIndicatorUnfocus();
				// if(textListButton != undefined) {
				// 	textListButton.hide();
				// };
			};
		};		

		function getScrollMaxHeight() {
			return _this.myRootElement.find('.scrollbg').height();
		};

		function getScrollStepDistance() {
			return getScrollMaxHeight() / (_this.model.getVMax() + 1);
		};

		function getScrollBarHeight() {
			return getScrollStepDistance() * 2;
		};

		function drawScrollBar() {
			if(_this.model.getVMax() > 1) {
				var scrollbar = _this.myRootElement.find('.scroll');
				var scrollbarHeight = getScrollBarHeight();
				var scrollbarTop = getScrollStepDistance() * (_this.model.getVStartIndex() + _this.model.getVIndex());
				scrollbar.height(getScrollBarHeight());
				scrollbar.css('top', scrollbarTop);
				_this.myRootElement.find('.scrollbg').show();
			} else {
				_this.myRootElement.find('.scrollbg').hide();
			}
		};
        function hideScrollBar() {
            _this.myRootElement.find('.scrollbg').hide();
        };
		function drawTotalCount() {
			_this.getContainer().find('.info_text span.bold').html(_this.model.totalCount);
		};

		function getFocusIndexItem() {
			var vIndex = _this.model.getVIndex();
			var hIndex = _this.model.getHIndex();
//			console.log('vIndex: ' + vIndex + ', hIndex: ' + hIndex);
            drawUnFocus();

			var row = _this.myRootElement.find('.poster_group').eq(vIndex);
			var focusItem = row.find('.poster').eq(hIndex);
			return focusItem;
		};
		function getTextListButton() {
			return _this.myRootElement.find('.bt_bottom');
		};
		function drawFocus () {
			getFocusIndexItem().addClass('focus');
		};
		function drawUnFocus () {
			_this.myRootElement.find('.poster').removeClass('focus');
		};
		function drawIndicatorFocus()	{
			if(_this.model.getVMax() > 1) {
				_this.myRootElement.find('.dim').show();
			}
			else	{
				_this.myRootElement.find('.dim').hide();
			}
            
		}
		function drawIndicatorUnfocus()	{
			_this.myRootElement.find('.dim').hide();
            
		}

		return SubscriberBasedRecommendationDrawer;
});
