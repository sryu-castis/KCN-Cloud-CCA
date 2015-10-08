define(["framework/View", "framework/event/CCAEvent",
        "ui/mytvViewGroup/couponGuideView/CouponGuideDrawer", "ui/mytvViewGroup/couponGuideView/CouponGuideModel",
        "service/Communicator", "cca/DefineView"],
        function(View, CCAEvent, CouponGuideDrawer, CouponGuideModel, Communicator, DefineView) {

    var CouponGuideView = null;
    CouponGuideView = function() {
        View.call(this, DefineView.COUPON_GUIDE_VIEW);
        this.model = new CouponGuideModel();
        this.drawer = new CouponGuideDrawer(this.getID(), this.model);
        var _this = this;

        CouponGuideView.prototype.onInit = function() {

        };

        CouponGuideView.prototype.onGetData = function(param) {
            getCouponGuideInfo();
        };

        function getCouponGuideInfo() {
            setData([{id:"1", title:"쿠폰 & 할인권이란?"},
                {id:"2", title:"VOD 쿠폰 요금제란?"}, 
                {id:"3", title:"쿠폰 이용안내"},
                {id:"4", title:"쿠폰 등록 안내"},
                {id:"5", title:"부가가치세 안내"},
                {id:"6", title:"환불 정책 안내"}
                ]);
        }

        function setData(guideList) {
            var model = _this.model;
           
            model.setData(guideList);
            model.setSize(7, 1, guideList.length, 1);
            model.setRotate(true, false);
        };

        CouponGuideView.prototype.onKeyDown = function(event, param) {
            var keyCode = param.keyCode;
            var tvKey = window.TVKeyValue;
//            console.log("CouponGuideView, onKeyDown: " + keyCode );
            switch (keyCode) {
            	case tvKey.KEY_BACK:
                case tvKey.KEY_LEFT:
                	_this.sendEvent(CCAEvent.FINISH_VIEW, getEventParamObject("categoryListView"));
                	break;
                case tvKey.KEY_EXIT:
                	_this.sendEvent(CCAEvent.FINISH_VIEW);
                    break;
                case tvKey.KEY_RIGHT:
                case tvKey.KEY_ENTER:
                	_this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, getEventParamObjectForGroup("couponGuideDetailViewGroup"));
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
        function getEventParamObject(targetView) {
            var model = _this.model;
            var param = {};
            param.targetView = targetView;
            param.index = model.getVIndex();
            param.startIndex = model.getVStartIndex();
            return param;
        }
        function getEventParamObjectForGroup(targetGroup) {
            var model = _this.model;
            var param = {};
            param.targetGroup = targetGroup;
            param.index = model.getVIndex();
            param.startIndex = model.getVStartIndex();
            return param;
        }
        this.onInit();
    };
    CouponGuideView.prototype = Object.create(View.prototype);

    return CouponGuideView;
});
