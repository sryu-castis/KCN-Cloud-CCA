define(["framework/Drawer", 
        "ui/searchViewGroup/subscriberBasedRecommandAssetView/SubscriberBasedRecommandAssetModel", 
        "helper/UIHelper"], function (Drawer, Model, UIHelper) {
	
	var SubscriberBasedRecommandAssetDrawer = function(_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {
        	'layout' : new EJS({url: 'js/ui/searchViewGroup/subscriberBasedRecommandAssetView/LayoutTemplate.ejs'})
        };
		var _this = this;

		SubscriberBasedRecommandAssetDrawer.prototype.onCreateLayout = function() {
			_this = this;
			this.setContainer($('#ranking_search .right .mainarea_poster'));
			_this.myRootElement = $('#ranking_search .right .mainarea_poster');
		};
		SubscriberBasedRecommandAssetDrawer.prototype.onPaint = function () {
			var result = _this.templateList.layout.render({model: this.model, 'UIHelper': UIHelper});
			_this.myRootElement.html(result);
			_this.timerContainer = $('#SearchView');
		};
		 SubscriberBasedRecommandAssetDrawer.prototype.onAfterPaint = function () {
		    	if(this.active)  {
		    		drawFocus();
		        }
		        else     {
		            drawUnfocus(); 
		        }
		        
		    };
		    function getFocusIndexItem() {
		        var focusHIndex = _this.model.getHIndex();
		        var focusVIndex = _this.model.getVIndex();
		        
		        var poster_upleft = $("#ranking_search .poster_ea01");
		        var poster_upright = $("#ranking_search .poster_ea02");
		        var poster_downleft = $("#ranking_search .poster_ea03");
		        var poster_downright = $("#ranking_search .poster_ea04");
		        
		        var focusItem = poster_upleft; // default
		        if(focusHIndex == 0 && focusVIndex == 0){
		        	focusItem = poster_upleft;
		        }
		        else if(focusHIndex == 1 && focusVIndex == 0){
		        	focusItem = poster_upright;
		        }
		        else if(focusHIndex == 0 && focusVIndex == 1){
		        	focusItem = poster_downleft;
		        }
		        else if(focusHIndex == 1 && focusVIndex == 1){
		        	focusItem = poster_downright;
		        }
		        
		        return focusItem;
		        
		    };
		    function clearFocus()	{
		    	var poster_upleft = $("#ranking_search .poster_ea01");
		        var poster_upright = $("#ranking_search .poster_ea02");
		        var poster_downleft = $("#ranking_search .poster_ea03");
		        var poster_downright = $("#ranking_search .poster_ea04");
		    	poster_upleft.removeClass("focus");
		    	poster_upright.removeClass("focus");
		    	poster_downleft.removeClass("focus");
		    	poster_downright.removeClass("focus");
		    }
		    function drawFocus() {
		    	clearFocus();
		    	var focusItem = getFocusIndexItem();
		        focusItem.addClass("focus");
		    }
		    function drawUnfocus() {
		    	clearFocus();
		    }
    };
   
    SubscriberBasedRecommandAssetDrawer.prototype = Object.create(Drawer.prototype);
	
	
	return SubscriberBasedRecommandAssetDrawer;
});
