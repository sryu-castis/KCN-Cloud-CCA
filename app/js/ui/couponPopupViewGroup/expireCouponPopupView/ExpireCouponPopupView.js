define(["framework/View", "framework/event/CCAEvent",
        "ui/couponPopupViewGroup/expireCouponPopupView/ExpireCouponPopupDrawer", "ui/couponPopupViewGroup/baseUsedCouponPopupView/BaseUsedCouponPopupModel", 
        "framework/modules/ButtonGroup", "service/Communicator"],
        function(View, CCAEvent, ExpireCouponPopupDrawer, BaseUsedCouponPopupModel, ButtonGroup, Communicator) {

    var ExpireCouponPopupView = function() {
        View.call(this, "expireCouponPopupView");
        this.model = new BaseUsedCouponPopupModel();
        this.drawer = new ExpireCouponPopupDrawer(this.getID(), this.model);
        var _this = this;

        ExpireCouponPopupView.prototype.onInit = function() {

        };


        ExpireCouponPopupView.prototype.onGetData = function(param) {
        	setData(param);
        };
        
        function setData(param) {
        	
			var model = _this.model;
			
			var verticalVisibleSize = 1;
			var horizonVisibleSize = param.buttonType;
			var verticalMaximumSize = 1;
			var horizonMaximumSize = 2;

			model.setSize(verticalVisibleSize, horizonVisibleSize, verticalMaximumSize, horizonMaximumSize);
			model.setPossessionCoupon(param.possessionCoupon);
			var buttonGroup = new ButtonGroup(1);
			buttonGroup.getButton(0).setLabel(CCABase.StringSources.ButtonLabel.CONFIRM);
		};
        
        

		ExpireCouponPopupView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            var buttonGroup = _this.model.getButtonGroup();
//            console.log("CommonPopupView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_RIGHT:
            		buttonGroup.next();
					_this.drawer.onUpdate();
					break;
                case tvKey.KEY_LEFT:
                	if(buttonGroup.hasPreviousButton()) {
						buttonGroup.previous();
						_this.drawer.onUpdate();
					}
                	break;
                case tvKey.KEY_EXIT:
                case tvKey.KEY_BACK:
                	_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                    break;
                case tvKey.KEY_ENTER:
                	_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                	break;
                case tvKey.KEY_UP:
                	_this.keyNavigator.keyUp();
                	_this.drawer.onUpdate();
                    break;
                case tvKey.KEY_DOWN:
                    _this.keyNavigator.keyDown();
                	_this.drawer.onUpdate();
                    break;
                default:
                    break;
            }
        };
        

        this.onInit();
    };
    ExpireCouponPopupView.prototype = Object.create(View.prototype);
	
    return ExpireCouponPopupView;
});
