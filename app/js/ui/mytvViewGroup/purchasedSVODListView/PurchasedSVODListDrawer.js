define(["framework/Drawer", "ui/mytvViewGroup/purchasedSVODListView/PurchasedSVODListModel", "helper/DateHelper", "helper/DrawerHelper"], function (Drawer, PurchasedSVODListModel ,DateHelper, DrawerHelper) {
    var PurchasedSVODListDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/mytvViewGroup/purchasedSVODListView/LayoutTemplate.ejs'}), 
        		'list': new EJS({url: 'js/ui/mytvViewGroup/purchasedSVODListView/ListTemplate.ejs'}) };
        var _this = this;
        var marqueeText = null;

        PurchasedSVODListDrawer.prototype.onCreateLayout = function () {
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);
        	var result = _this.templateList['layout'].render({model:this.model});
			this.getContainer().html(result);
        };

        PurchasedSVODListDrawer.prototype.onPaint = function () {
//			console.log("PurchasedSVODListDrawer.prototype.onPaint")
        	var result = _this.templateList['list'].render({model: this.model, DateHelper: DateHelper});
			$("#mytv").html(result);
			setButtonElement();
			//_this.timerContainer = $('.bg_right .subViewArea');
        };
        
        PurchasedSVODListDrawer.prototype.onAfterPaint = function () {
        	_this.hideButtonGroup();
        	//setPageIndex();
        };
        
        PurchasedSVODListDrawer.prototype.hideButtonGroup = function () {
        	$("#mytv .inbt").hide();
        	_this.model.setHIndex(0);
        	if(_this.active)  {
                drawFocus();
            } else {
                drawUnfocus();
            }
        }

        PurchasedSVODListDrawer.prototype.showButtonGroup = function () {
        	_this.model.setHIndex(1);
        	drawSelected();
        	
        	var buttonElements = $("#mytv .postion");
        	buttonElements.removeClass("bt2_1").removeClass("bt2_2").removeClass("bt2_3").removeClass("bt2_4").removeClass("bt2_5").removeClass("bt2_6");
        	buttonElements.addClass("bt2_"+(_this.model.getVIndex()+1));
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
		
		PurchasedSVODListDrawer.prototype.drawButtonGroup = function () {
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
        
        //function setPageIndex() {
        //	$(".pagenum .now").text(_this.model.getCurrentPageIndex()+1);
        //	$(".pagenum .all").text("/"+_this.model.getTotalPage());
        //}
        
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
    PurchasedSVODListDrawer.prototype = Object.create(Drawer.prototype);


    return PurchasedSVODListDrawer;
});
