define(["framework/Drawer", "ui/detailViewGroup/episodePeerListView/EpisodePeerListModel", "helper/UIHelper"], function (Drawer, Model, UIHelper) {
	var EpisodePeerListDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
		this.templateList = {'layout': new EJS({url: 'js/ui/detailViewGroup/detailView/LayoutTemplate.ejs'}), 'list': new EJS({url: 'js/ui/detailViewGroup/episodePeerListView/ListTemplate.ejs'})};

		var _this = this;

		EpisodePeerListDrawer.prototype.onCreateLayout = function() {
			//@같은 컨테이너를 공유하도록 처리
			this.createContainer("detailGroup");

			var result = this.templateList['layout'].render({model:this.model, 'UIHelper' : UIHelper});
			this.getContainer().html(result);
			//this.timerContainer = $('#detail_view_full .series');
			//$('.detailTemplateArea').hide();
		};
		
		EpisodePeerListDrawer.prototype.onPaint = function() {
			var result = this.templateList['list'].render({model:this.model, 'UIHelper':UIHelper});
			$('#detail_view_full .series').html(result);
		};
		EpisodePeerListDrawer.prototype.onAfterPaint = function() {
			drawFocus();
		};

		function drawFocus() {
			drawUnFocus();

			var episodeList = $('#detail_view_full .series > .num');
			var focusIndex = _this.model.getVIndex();

			if(_this.isActive()) {
				$(episodeList[focusIndex]).removeClass('selected');
				$(episodeList[focusIndex]).addClass('focus');
			} else {
				$(episodeList[focusIndex]).addClass('selected');
			}
		}

		function drawUnFocus() {
			var itemList = $('#detail_view_full .series > .num');
			for(var i = 0; i < itemList.length; i++) {
				$(itemList[i]).removeClass('focus');
			}
		}
    };
	EpisodePeerListDrawer.prototype = Object.create(Drawer.prototype);
	
	
	return EpisodePeerListDrawer;
});
