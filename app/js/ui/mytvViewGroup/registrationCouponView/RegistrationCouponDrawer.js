define(["framework/Drawer", "ui/mytvViewGroup/registrationCouponView/RegistrationCouponModel", "helper/DrawerHelper"],
    function (Drawer, RegistrationCouponModel, DrawerHelper) {
    var RegistrationCouponDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/mytvViewGroup/registrationCouponView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        RegistrationCouponDrawer.prototype.onCreateLayout = function () {
            DrawerHelper.cleanSubViewArea();
            var tempContainer = DrawerHelper.getEmptySubViewContainer(".bg_right .subViewArea");
            this.setContainer(tempContainer);
        };

        RegistrationCouponDrawer.prototype.onPaint = function () {
//            console.log(this.model);
            var result = _this.templateList['layout'].render({model: this.model});
			this.getContainer().html(result);
			setButtonElement();
        };
        RegistrationCouponDrawer.prototype.onAfterPaint = function () {
        	if(this.model.getErrorCode() == 0)	{
        		$("#mytv .text").addClass("normal").removeClass("error");
        	}
        	else 	{
        		$("#mytv .text").addClass("error").removeClass("normal");
        	}
        	if(this.active)  {
                if(_this.model.getVIndex() == 0) {// coupon number
                    drawFocusForCoupon();
//                    drawUnfocusForButton();
//                    drawButton();
                }
                else    {
//                    drawFocusForButton();
                    drawUnfocusForCoupon();
                }
            }
            else     {
                drawUnfocusForCoupon(); // 사실 이건 없어도 되지만...
//                drawUnfocusForButton();
//                drawButton();
            }
        	
        	drawButton();
        };
        function getFocusIndexItem() {
            var focusIndex = _this.model.getHIndex();
            var listItems = $("#mytv .pwbox");
            var focusItem = listItems.eq(focusIndex);
            return focusItem;
            
        };
        function drawFocusForCoupon() {
        	var focusItem = getFocusIndexItem();
            focusItem.addClass("focus");
            focusItem.removeClass("unfocus");
        }

        function drawUnfocusForCoupon()   {
        	var focusItem = getFocusIndexItem();
            focusItem.removeClass("focus");
            focusItem.addClass("unfocus");
        }
        function setButtonElement() {
            var buttonGroup = _this.model.getButtonGroup();
            var buttonElementList = $('#mytv .btn_align >');
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
        function isFocusOnInputField() {
			return _this.model.getVIndex() == 0;
		}
//        function drawFocusForButton()   {
//        	var buttonGroup = _this.model.getButtonGroup();
//            var focusIndex =_this.model.getButtonGroup().getIndex();
//            var listItems = $("#mytv .bt_147");
//            var focusItem = listItems.eq(focusIndex);
//            focusItem.addClass("focus");
//        }
//
//        function drawUnfocusForButton() {
//            var focusIndex =_this.model.getButtonGroup().getIndex();
//            var listItems = $("#mytv .bt_147");
//            var focusItem = listItems.eq(focusIndex);
//            focusItem.removeClass("focus");
//        }

    };
    RegistrationCouponDrawer.prototype = Object.create(Drawer.prototype);


    return RegistrationCouponDrawer;
});
