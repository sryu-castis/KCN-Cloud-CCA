define(['framework/Drawer', 'helper/UIHelper', 'service/STBInfoManager', 'service/CCAInfoManager'],
	function (Drawer, UIHelper, STBInfoManager, CCAInfoManager) {
		var _this = null;
		var SearchDrawer = function (_id, _model) {
			Drawer.call(this, _id, _model);
			this.templateList = {
				'layout'	: new EJS({url: 'js/ui/searchViewGroup/searchView/LayoutTemplate.ejs'})
			};
//			console.log('_model: ' + _model);
			_this = this;
		}

		SearchDrawer.prototype = Object.create(Drawer.prototype);
		SearchDrawer.prototype.onCreateLayout = function () {
			// this.setContainer($(".bg_right .subViewArea"));
			// this.setContainer($('body'));
			var result = _this.templateList.layout.render({model: this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
		};
		SearchDrawer.prototype.onPaint = function () {
			redrawCoinBalance();
		};
		SearchDrawer.prototype.onAfterPaint = function () {
			if(this.active) {
				drawFocus();
			} else {
				drawUnfocus();
			};
		};		

		function drawFocus() {
			var searchBar = $('#ranking_search .bar_search');
			searchBar.removeClass('unfocus');
			searchBar.addClass('focus');
			var input = searchBar.find('.text');
			input.removeClass('default');
		};

		function drawUnfocus() {
			var searchBar = $('#ranking_search .bar_search');
			searchBar.removeClass('focus');
			searchBar.addClass('unfocus');
			var input = searchBar.find('.text');
			input.addClass('default');
		};

		function redrawCoinBalance() {
			if(STBInfoManager.isB2B() && !CCAInfoManager.hasPaymentCoupon()) {
                $('#ranking_search .coupon_search').html('');
            }else{
                var coin = UIHelper.addThousandSeparatorCommas(_this.model.getBalanceOfCoin());
                var coupon = UIHelper.addThousandSeparatorCommas(_this.model.getCountOfCoupon());
                $('#ranking_search .coupon_search .row01 .text_coupon').html(coupon + '장');
                $('#ranking_search .coupon_search .row02 .text_coupon').html(coin + '원');
            }
		};
		return SearchDrawer;
});