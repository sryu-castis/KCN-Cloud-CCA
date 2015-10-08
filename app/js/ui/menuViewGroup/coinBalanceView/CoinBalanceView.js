define(["framework/View", "framework/event/CCAEvent",
        "ui/menuViewGroup/coinBalanceView/CoinBalanceViewDrawer", "ui/menuViewGroup/coinBalanceView/CoinBalanceModel",
        "service/Communicator", "cca/type/VisibleTimeType", "cca/DefineView"],
    function (View, CCAEvent, CoinBalanceViewDrawer, CoinBalanceModel, Communicator, VisibleTimeType, DefineView) {

        var CoinBalanceView = function () {
            View.call(this, DefineView.COIN_BALANCE_VIEW);
            this.model = new CoinBalanceModel();
            this.drawer = new CoinBalanceViewDrawer(this.getID(), this.model);

            var _this = this;

            CoinBalanceView.prototype.onInit = function() {

            };

            CoinBalanceView.prototype.onBeforeStart = function () {
                _this = this;
            };
            CoinBalanceView.prototype.onAfterStart = function() {
                //this.hideTimerContainer();
                this.setVisibleTimer(VisibleTimeType.TEXT_TYPE);
            };

            CoinBalanceView.prototype.onGetData = function (param) {
            };



            this.onInit();
        };

        CoinBalanceView.prototype = Object.create(View.prototype);

        return CoinBalanceView;
    });