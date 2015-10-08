define(["framework/Drawer", "ui/couponPopupViewGroup/purchaseMonthlyCouponPopupView/PurchaseMonthlyCouponPopupModel", "helper/UIHelper"], function (Drawer, PurchaseMonthlyCouponPopupModel, UIHelper) {
    var PurchaseMonthlyCouponPopupDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/couponPopupViewGroup/purchaseMonthlyCouponPopupView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        PurchaseMonthlyCouponPopupDrawer.prototype.onCreateLayout = function () {
        	
        };

        PurchaseMonthlyCouponPopupDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
			setButtonElement();
        };
        
        PurchaseMonthlyCouponPopupDrawer.prototype.onAfterPaint = function () {
        	drawInputField();
        	drawButton();
        };
        
        function setButtonElement() {
			var buttonGroup = _this.model.getButtonGroup();

			var buttonElementList = $('#'+_id+' #popup_large .area_btn >');
			var size = buttonGroup.getSize();
			for (var i = 0; i < size; i++) {
				buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
			}
		};
		function drawButton() {
			var buttonGroup = _this.model.getButtonGroup();
			for(var i = 0; i < buttonGroup.getSize(); i++) {
				if (buttonGroup.getButton(i).isActive()) {
					buttonGroup.getButton(i).onActive();
				} else {
					buttonGroup.getButton(i).onDeActive();
				}
				buttonGroup.getButton(i).setUnFocus();
			}

			if(_this.isActive() && !isFocusOnInputField()) {
				buttonGroup.getFocusedButton().setFocus();
			}
		}
		function getFocusIndexItem() {
            var focusIndex = _this.model.getHIndex();
            var listItems = $('#'+_id+' #popup_large .body_serialbox_pw01');
            var focusItem = listItems.eq(focusIndex);
 
            return focusItem;
            
        };
        function drawFocusForInputField() {
        	var focusItem = getFocusIndexItem();
            focusItem.addClass("focus");
            focusItem.removeClass("unfocus");
        }

        function drawUnfocusForInputField()   {
        	var focusItem = getFocusIndexItem();
            focusItem.removeClass("focus");
            focusItem.addClass("unfocus");
        }
        function drawInputField() {
			var model = _this.model;
			var inputField = model.getInputField();

			if(inputField.getDefaultText() == CCABase.StringSources.failPasswordText) {
				$('#'+_id+' #popup_large .body_serialbox_pw01 ').addClass("error");
			} else {
				$('#'+_id+' #popup_large .body_serialbox_pw01 ').removeClass("error");
			}

			if (_this.isActive() && isFocusOnInputField()) {
				drawFocusForInputField();
			} else {
				drawUnfocusForInputField();
			}
		};

        function isFocusOnInputField() {
			return _this.model.getVIndex() == 0;
		}
    };
    PurchaseMonthlyCouponPopupDrawer.prototype = Object.create(Drawer.prototype);


    return PurchaseMonthlyCouponPopupDrawer;
});
