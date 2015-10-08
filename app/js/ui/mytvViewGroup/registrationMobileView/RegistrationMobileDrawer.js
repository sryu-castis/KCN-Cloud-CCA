define(["framework/Drawer", "ui/mytvViewGroup/registrationMobileView/RegistrationMobileModel", "framework/modules/Button", "helper/DateHelper", "helper/DrawerHelper"],
		function (Drawer, RegistrationMobileModel, Button, DateHelper, DrawerHelper) {
    var RegistrationMobileDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/mytvViewGroup/registrationMobileView/LayoutTemplate.ejs'}), 
        		'list': new EJS({url: 'js/ui/mytvViewGroup/registrationMobileView/ListTemplate.ejs'}) };
        var _this = this;
        var marqueeText = null;

        RegistrationMobileDrawer.prototype.onCreateLayout = function () {
			var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
			this.setContainer(tempContainer);
        	var result = _this.templateList['layout'].render({model:this.model});
			this.getContainer().html(result);
        };

        RegistrationMobileDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['list'].render({model: this.model, 'DateHelper': DateHelper});
			$("#mytv .vodbox_list tbody").html(result);
			setButtonElement();
			//_this.timerContainer = $('.bg_right .subViewArea');
        };
        
        RegistrationMobileDrawer.prototype.onAfterPaint = function () {
        	_this.hideButtonGroup();
        	setPageIndex();
        };
        
        RegistrationMobileDrawer.prototype.hideButtonGroup = function () {
        	$("#mytv .inbt").hide();
        	_this.model.setHIndex(0);
        	if(_this.active)  {
				if(isRegisterButtonState()) {
					drawRegiterButtonFocus();
					drawListUnfocus();
				} else {
					drawRegiterButtonUnFocus();
					drawListFocus();
				}
            } else {
				drawRegiterButtonUnFocus();
				drawListUnfocus();
            }
        }

        RegistrationMobileDrawer.prototype.showButtonGroup = function () {
        	_this.model.setHIndex(1);
			drawListSelected();
        	
        	var buttonElements = $("#mytv .postion");
			buttonElements.removeClass("bt2_1").removeClass("bt2_2").removeClass("bt2_3").removeClass("bt2_4");
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

			var button = _this.model.getRegisterButton();
			button.setElement($('#mytv .btn3'));
		};
		
		RegistrationMobileDrawer.prototype.drawButtonGroup = function () {
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

		function drawRegiterButtonFocus() {
			var registerButton = _this.model.getRegisterButton().getElement();
			registerButton.addClass("focus").removeClass("unfocus");
		}

		function drawRegiterButtonUnFocus() {
			var registerButton = _this.model.getRegisterButton().getElement();
			registerButton.addClass("unfocus").removeClass("focus");
		}

        function getListFocusIndexItem() {
			var focusIndex = _this.model.getVIndex();
			var listItems = $("#mytv tbody tr");
			var focusItem = listItems.eq(focusIndex);
            return focusItem;
        };

        function drawListFocus() {
			var focusItem = getListFocusIndexItem();
			focusItem.addClass("focus").removeClass("unfocus").removeClass("selected");
			$("#mytv .pagedown").removeClass("unfocus").addClass("focus");
        }

        function drawListUnfocus()   {
        	var focusItem = getListFocusIndexItem();
        	focusItem.addClass("unfocus").removeClass("focus").removeClass("selected");
        	$("#mytv .pagedown").addClass("unfocus").removeClass("focus");
        }
        
        function drawListSelected()   {
        	var focusItem = getListFocusIndexItem();
        	focusItem.addClass("selected").removeClass("focus").removeClass("unfocus");
        	$("#mytv .pagedown").addClass("unfocus").removeClass("focus");
        }

		function isRegisterButtonState() {
			return _this.model.getState() == RegistrationMobileModel.STATE_REGISTER_BUTTON;
		}

    };
    RegistrationMobileDrawer.prototype = Object.create(Drawer.prototype);


    return RegistrationMobileDrawer;
});
