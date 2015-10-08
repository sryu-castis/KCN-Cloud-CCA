define(["framework/Drawer", "ui/mytvViewGroup/wishListView/WishListModel", "helper/DateHelper", "helper/DrawerHelper"], function (Drawer, WishListModel ,DateHelper, DrawerHelper) {
    var WishListDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/mytvViewGroup/wishListView/LayoutTemplate.ejs'}), 
        		'list': new EJS({url: 'js/ui/mytvViewGroup/wishListView/ListTemplate.ejs'}) };
        var _this = this;
        var marqueeText = null;

        WishListDrawer.prototype.onCreateLayout = function () {
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);
        	var result = _this.templateList['layout'].render({model:this.model});
			this.getContainer().html(result);
        };

        WishListDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['list'].render({model: this.model, DateHelper: DateHelper});
			$("#mytv .vodbox_list tbody").html(result);
			setButtonElement();
			//_this.timerContainer = $('.bg_right .subViewArea');
        };
        
        WishListDrawer.prototype.onAfterPaint = function () {
        	_this.hideButtonGroup();
        	setPageIndex();
        };
        
        WishListDrawer.prototype.hideButtonGroup = function () {
        	$("#mytv .inbt").hide();
        	_this.model.setHIndex(0);
        	if(_this.active)  {
                drawFocus();
            } else {
                drawUnfocus();
            }
        }

        WishListDrawer.prototype.showButtonGroup = function () {
        	_this.model.setHIndex(1);
        	drawSelected();
        	
        	var buttonElements = $("#mytv .postion");
        	buttonElements.removeClass("bt1").removeClass("bt2").removeClass("bt3").removeClass("bt4").removeClass("bt5").removeClass("bt6");
        	buttonElements.addClass("bt"+(_this.model.getVIndex()+1));
			_this.model.getButtonGroup().setIndex(0);
        	_this.drawButtonGroup();

        	$("#mytv .inbt").show();
        }
        
        function setButtonElement() {
			var buttonGroup = _this.model.getButtonGroup();

			var buttonElementList = $('#mytv .postion >');
			var size = buttonGroup.getSize();
			for (var i = 0; i < size; i++) {
				buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
			}
		};
		
		WishListDrawer.prototype.drawButtonGroup = function () {
			var buttonGroup = _this.model.getButtonGroup();
//			console.log("buttonGroup.getSize()="+buttonGroup.getSize());
			var focusedIndex = buttonGroup.getIndex();
			for(var i = 0; i < buttonGroup.getSize(); i++) {
				if(i == focusedIndex) {
					buttonGroup.getButton(i).setFocus();
				} else {
					buttonGroup.getButton(i).setUnFocus();
				}
			}
		}
        
        function setPageIndex() {
        	if(_this.model.getData() != null && _this.model.getData().length > 0)	{
        		$(".page").show();
				var currentIndex = _this.model.getVIndex() + (_this.model.getCurrentPageIndex()*_this.model.getPageSize()) +1;
        		$(".pagenum .now").text(currentIndex);
            	$(".pagenum .all").text("/"+_this.model.getTotalCount());
        	}
        	else	{
        		$(".page").hide();
        	}
        	
        }
        
        function getFocusIndexItem() {
            var focusIndex = _this.model.getVIndex();
            var listItems = $("#mytv tbody tr");
            var focusItem = listItems.eq(focusIndex);
            return focusItem;
            
        };
        function drawFocus() {
        	var focusItem = getFocusIndexItem();
            focusItem.addClass("focus").removeClass("unfocus").removeClass("selected");
            $("#mytv .pagedown").removeClass("unfocus").addClass("focus");
        }

        function drawUnfocus()   {
        	var focusItem = getFocusIndexItem();
        	focusItem.addClass("unfocus").removeClass("focus").removeClass("selected");
        	$("#mytv .pagedown").addClass("unfocus").removeClass("focus");
        }
        
        function drawSelected()   {
        	var focusItem = getFocusIndexItem();
        	focusItem.addClass("selected").removeClass("focus").removeClass("unfocus");
        	$("#mytv .pagedown").addClass("unfocus").removeClass("focus");
        }

    };
    WishListDrawer.prototype = Object.create(Drawer.prototype);


    return WishListDrawer;
});
