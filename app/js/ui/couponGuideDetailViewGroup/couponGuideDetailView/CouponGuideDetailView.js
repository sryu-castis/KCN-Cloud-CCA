define(["framework/View", "framework/event/CCAEvent",
        "ui/couponGuideDetailViewGroup/couponGuideDetailView/CouponGuideDetailDrawer", "ui/couponGuideDetailViewGroup/couponGuideDetailView/CouponGuideDetailModel",
        "service/Communicator"],
        function(View, CCAEvent, 
        		CouponGuideDetailDrawer, CouponGuideDetailModel, 
        		Communicator) {

    var CouponGuideDetailView = null;
    CouponGuideDetailView = function() {
        View.call(this, "couponGuideDetailView");
        this.model = new CouponGuideDetailModel();
        this.drawer = new CouponGuideDetailDrawer(this.getID(), this.model);
        var _this = this;

        CouponGuideDetailView.prototype.onInit = function() {

        };

        CouponGuideDetailView.prototype.onGetData = function(param) {
        	setData(param);
        };

        function setData(param) {
            var model = _this.model;
           
            model.setData(param.index);
        };

        CouponGuideDetailView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
            switch (keyCode) {
                case tvKey.KEY_RIGHT:
                	break;
                case tvKey.KEY_LEFT:
                case tvKey.KEY_BACK:
                	_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                	break;
                case tvKey.KEY_ENTER:
                	if(_this.model.getData() != 2)	{// 쿠폰 이용 안내 -1 화면의 경우 제외
                		_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);	
                	}
                	break;
                case tvKey.KEY_EXIT:
                	_this.sendEvent(CCAEvent.FINISH_VIEWGROUP);
                    break;
                case tvKey.KEY_UP:
                	_this.keyNavigator.keyUp();
                	if(_this.model.getData() == 6)	{
                		_this.model.setData(2);	
                	}
                	_this.drawer.onUpdate();
                    break;
                case tvKey.KEY_DOWN:
                    _this.keyNavigator.keyDown();
                    if(_this.model.getData() == 2)	{
                		_this.model.setData(6);	
                	}
                	_this.drawer.onUpdate();
                    break;
                default:
                    break;
            }
        };
        
        this.onInit();
    };
    CouponGuideDetailView.prototype = Object.create(View.prototype);

    return CouponGuideDetailView;
}
);
