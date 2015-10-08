define(["framework/View", "framework/event/CCAEvent", "service/Communicator", "cca/DefineView",
        "ui/mainMenuViewGroup/layout/LayoutDrawer","ui/mainMenuViewGroup/layout/LayoutModel",
        'service/CCAInfoManager', 'main/CSSHandler'
    ],
		function(View, CCAEvent, Communicator, DefineView, LayoutDrawer, LayoutModel, CCAInfoManager, CSSHandler) {

	var LayoutView = function(id) {
        View.call(this, id);

		this.model = null;
		this.drawer = null;
        var _this = this;

        LayoutView.prototype.onInitialize = function() {
            this.model = new LayoutModel();
            this.drawer = new LayoutDrawer(this.getID(), this.model);
            addEventListener();
        };

        LayoutView.prototype.onBeforeStart = function(param) {
            _this.model.setData(param);
            _this = this;
        };
        LayoutView.prototype.onAfterStart = function() {
            sendCompleteDrawEvent();
        };

		LayoutView.prototype.onGetData = function(param) {
        };

        LayoutView.prototype.onKeyDown = function(event, param) {
        };

        function addEventListener() {
            removeEventListener();
            $(_this.drawer).bind(CCAEvent.COMPLETE_TO_DRAW_VIEW, sendCompleteDrawEvent);
        }

        function removeEventListener() {
            $(_this.drawer).unbind();
        }

        function sendCompleteDrawEvent() {
            _this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
        }

        this.onInitialize();
	};
    LayoutView.prototype = Object.create(View.prototype);

	return LayoutView;
});