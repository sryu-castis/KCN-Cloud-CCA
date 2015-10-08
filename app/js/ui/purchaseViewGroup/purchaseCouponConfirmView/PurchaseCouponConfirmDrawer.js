define(["framework/Drawer", "ui/purchaseViewGroup/purchaseCouponConfirmView/PurchaseCouponConfirmModel", "helper/UIHelper"], function (Drawer, PurchaseCouponConfirmModel, UIHelper) {
    var PurchaseCouponConfirmDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/purchaseViewGroup/purchaseCouponConfirmView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        PurchaseCouponConfirmDrawer.prototype.onCreateLayout = function () {
            //@같은 컨테이너를 공유하도록 처리
            this.createContainer("purchasePopup");
        };

        PurchaseCouponConfirmDrawer.prototype.onPaint = function () {
        	var result = _this.templateList['layout'].render({model: this.model, 'UIHelper':UIHelper});
			this.getContainer().html(result);
			setButtonElement();
        };
        
        PurchaseCouponConfirmDrawer.prototype.onAfterPaint = function () {
        	if(_this.model.getVIndex() == 0) {	// focus on coupon
        		drawFocusForCoupon();
            }
        	else if(_this.model.getVIndex() == 1) {	// focus on inputfield
        		drawSelectForCoupon();
            }
            else    {	// focus on button
            	drawSelectForCoupon();
            }
        	drawButton();
        	drawInputField();

        	
        };
        
        function setButtonElement() {
			var buttonGroup = _this.model.getButtonGroup();
			if(buttonGroup != null)	{
				var buttonElementList = $('#purchasePopup  #popup_xlarge .area_btn >');
				var size = buttonGroup.getSize();
				for (var i = 0; i < size; i++) {
					buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
				}	
			}
			
		};
		
		function getFocusInputField() {
            var listItems = $('#purchasePopup  #popup_xlarge .body_serialbox_pw01');
            var focusItem = listItems.eq(0);
 
            return focusItem;
            
        };

        
        function getFocusIndexItem() {
            var focusIndex = _this.model.getHIndex();
            var listItems = $("#popup_xlarge .coupon_bg01");
            var focusItem = listItems.eq(focusIndex);
            return focusItem;
            
        };
        function drawFocusForInputField() {
        	var focusItem = getFocusInputField();
            focusItem.removeClass("unfocus");
            focusItem.addClass("focus");
        }

        function drawUnfocusForInputField()   {
        	var focusItem = getFocusInputField();
            focusItem.removeClass("focus");
            focusItem.addClass("unfocus");
        }
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

			if(_this.isActive() && !isFocusOnInputField() && !isFocusOnCoupon()) {
				buttonGroup.getFocusedButton().setFocus();
			}
		}
        function drawInputField() {
			var model = _this.model;
			var inputField = model.getInputField();

			if(inputField.getDefaultText() == CCABase.StringSources.failPasswordText) {
				$('#purchasePopup  #popup_xlarge .body_serialbox_pw01 ').addClass("error");
			} else {
				$('#purchasePopup  #popup_xlarge .body_serialbox_pw01 ').removeClass("error");
			}

			if (_this.isActive() && isFocusOnInputField()) {
				drawFocusForInputField();
			} else {
				drawUnfocusForInputField();
			}
		};
        function isFocusOnInputField() {
			return _this.model.getVIndex() == 1;
		}
        function isFocusOnCoupon() {
			return _this.model.getVIndex() == 0;
		}

        function drawFocusForCoupon() {
        	var focusItem = getFocusIndexItem();
            focusItem.addClass("focus");
            focusItem.removeClass("unfocus").removeClass("selected");
        }
        function drawSelectForCoupon() {
        	var focusItem = getFocusIndexItem();
            focusItem.addClass("selected");
            focusItem.removeClass("unfocus").removeClass("focus");
        }
        function drawUnfocusForCoupon()   {
        	var focusItem = getFocusIndexItem();
            focusItem.removeClass("focus");
            focusItem.addClass("unfocus");
        }
//        PurchaseCouponConfirmDrawer.prototype.onDestroy = function ()	{
//        	this.getContainer().hide();
//        }
    };
    PurchaseCouponConfirmDrawer.prototype = Object.create(Drawer.prototype);


    return PurchaseCouponConfirmDrawer;
});
