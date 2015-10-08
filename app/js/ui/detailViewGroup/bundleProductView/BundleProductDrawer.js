define(["framework/Drawer", "ui/detailViewGroup/bundleProductView/BundleProductModel", "helper/DateHelper", "helper/UIHelper"], function (Drawer, Model, DateHelper, UIHelper) {
	var BundleProductDrawer = function(_id, _model) {
		Drawer.call(this, _id, _model);
		this.templateList = {
			'layout' 	: new EJS({url: 'js/ui/detailViewGroup/bundleProductView/LayoutTemplate.ejs'}),
			'list'		: new EJS({url: 'js/ui/detailViewGroup/bundleProductView/ListTemplate.ejs'})
		};
		var _this = this;

		BundleProductDrawer.prototype.onCreateLayout = function() {
			var result = _this.templateList['layout'].render({model:this.model, 'DateHelper':DateHelper, 'UIHelper' : UIHelper});
			this.getContainer().html(result);

			//this.timerContainer = $('#pack .bg_02');
		};

		BundleProductDrawer.prototype.onPaint = function() {
			var posters = getPosters();
			if(_this.model.getData() != undefined && posters.length == 0) {
				var result = _this.templateList['list'].render({model:this.model, 'DateHelper':DateHelper, 'UIHelper' : UIHelper});
				$('#pack .bg_02').html(result);
				setButtonElement();
			};
		};

		BundleProductDrawer.prototype.onAfterPaint = function() {
			var bundleProduct = _this.model.getData();
			if(UIHelper.isPurchasedProduct(bundleProduct) == false) {
				showButtons();
				hideText();
				drawPosterUnfocus();
			} else {
				showText();
				hideButtons();
				drawPosterFocus();
			};
			
		};

		function getPosters() {
			return $('#pack .area_poster .poster');
		}

		function showButtons() {
			$('#pack .btn_align').show();
			var buttonGroup = _this.model.getButtonGroup();
			if(_this.model.getButtonGroup().getIndex() == 0) {
				buttonGroup.getButton(0).setFocus();
				buttonGroup.getButton(1).setUnFocus();
			} else {
				buttonGroup.getButton(1).setFocus();
				buttonGroup.getButton(0).setUnFocus();
			};
		};

		function setButtonElement () {
			var buttonGroup = _this.model.getButtonGroup();
			var buttonList = _this.getContainer().find('.bt_147');
			for (var index = 0; index < buttonList.size(); index++) {
				buttonGroup.getButton(index).setElement(buttonList.eq(index));
			};
		};

		function hideButtons() {
			$('#pack .btn_align').hide();
		};

		function showText() {
			var bottomText = $('#pack .text_align');
			var hIndex = _this.model.getHIndex();
			var assetTitle = _this.model.getData().getBundleAssetList()[hIndex].getDisplayName();
			var html = assetTitle + " 시청을 원하시면 리모컨의 <span>\"OK\"</span> 버튼을 눌러주세요.";
			bottomText.html(html);
			bottomText.show();
		};

		function hideText() {
			$('#pack .text_align').hide();
		};

		function drawPosterFocus() {
			var hIndex = _this.model.getHIndex();
			var posters = getPosters();
			posters.removeClass('focus');
			posters.eq(hIndex).addClass('focus');
		};

		function drawPosterUnfocus() {
			getPosters().removeClass('focus');
		};

	};
	BundleProductDrawer.prototype = Object.create(Drawer.prototype);


	return BundleProductDrawer;
});
