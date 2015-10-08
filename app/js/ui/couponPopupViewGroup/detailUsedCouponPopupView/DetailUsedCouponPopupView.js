define(["framework/View", "framework/event/CCAEvent",
        "ui/couponPopupViewGroup/detailUsedCouponPopupView/DetailUsedCouponPopupDrawer", "ui/couponPopupViewGroup/baseUsedCouponPopupView/BaseUsedCouponPopupModel", 
        "framework/modules/ButtonGroup", "service/Communicator"],
        function(View, CCAEvent, DetailUsedCouponPopupDrawer, BaseUsedCouponPopupModel, ButtonGroup, Communicator) {
// event type 101(유료 쿠폰 구매), 102(유료 쿠폰 보너스), 301(수동 쿠폰 등록), 302(이벤트 당첨 축하 쿠폰),  303(쿠폰 발급 쿠폰),  
// event type 401(월정액 쿠폰 증정시), 402(월정액 쿠폰 보너스 증정)은 하단 문자가 다르나 우선 이 팝업을 사용하도록 하고 나중에는 변경하도록 한다.
    var DetailUsedCouponPopupView = function() {
        View.call(this, "detailUsedCouponPopupView");
        this.model = new BaseUsedCouponPopupModel();
        this.drawer = new DetailUsedCouponPopupDrawer(this.getID(), this.model);
        var _this = this;

        DetailUsedCouponPopupView.prototype.onInit = function() {

        };



        DetailUsedCouponPopupView.prototype.onGetData = function(param) {
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
        
        

        DetailUsedCouponPopupView.prototype.onKeyDown = function(event, param) {
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
    DetailUsedCouponPopupView.prototype = Object.create(View.prototype);
	
    return DetailUsedCouponPopupView;
});
