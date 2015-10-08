define([ "framework/ViewGroup", "framework/event/CCAEvent", "framework/utils/ViewHistoryStack",
         "ui/couponGuideDetailViewGroup/couponGuideDetailView/CouponGuideDetailView",
         "ui/menuViewGroup/coinBalanceView/CoinBalanceView",
        ],
    function(ViewGroup, CCAEvent, ViewHistoryStack, 
    		CouponGuideDetailView, CoinBalanceView) {

    var CouponGuideDetailViewGroupManager = function(id) {
        ViewGroup.call(this, id);
        var historyStack = null;
        var couponGuideDetailView = new CouponGuideDetailView();
        var coinBalanceView = new CoinBalanceView();
		var _this = this;

		CouponGuideDetailViewGroupManager.prototype.onInit = function() {
            addEventListener();
		};

		CouponGuideDetailViewGroupManager.prototype.onStart = function(param) {
			ViewGroup.prototype.onStart.call(this);
            historyStack = new ViewHistoryStack();

			startViewGroup(param);
		};
		CouponGuideDetailViewGroupManager.prototype.onStop = function() {
			couponGuideDetailView.onStop();

        }
		CouponGuideDetailViewGroupManager.prototype.onHide = function() {
			couponGuideDetailView.onHide();

		};

		CouponGuideDetailViewGroupManager.prototype.onShow = function() {
			couponGuideDetailView.onShow();
		};

		CouponGuideDetailViewGroupManager.prototype.onUpdate = function() {
			couponGuideDetailView.onUpdate();
		};

        function startViewGroup(param) {
        	couponGuideDetailView.onStart(param);
        	couponGuideDetailView.onActive();
        	coinBalanceView.onStart();
        }


		function addEventListener() {
			removeEventListener();

			$(couponGuideDetailView).bind(CCAEvent.FINISH_VIEWGROUP, couponGuideDetailFinishViewGroupListener);
		}

		function removeEventListener() {
			$(couponGuideDetailView).unbind();
		}

		function couponGuideDetailFinishViewGroupListener(event, param)	{
			_this.sendEvent(event, param);        
		}
        this.onInit();
	};
	CouponGuideDetailViewGroupManager.prototype = Object.create(ViewGroup.prototype);


    return CouponGuideDetailViewGroupManager;
});