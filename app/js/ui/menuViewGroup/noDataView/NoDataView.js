define(["framework/View", "framework/event/CCAEvent", "cca/type/ViewerType",
        "ui/menuViewGroup/noDataView/NoDataDrawer", "ui/menuViewGroup/noDataView/NoDataModel", "cca/DefineView"],
    function (View, CCAEvent, ViewerType, NoDataDrawer, NoDataModel, DefineView) {

        var NoDataView = function () {
            View.call(this, DefineView.NO_DATA_VIEW);
            this.model = new NoDataModel();
            this.drawer = new NoDataDrawer(this.getID(), this.model);

            var _this = this;

            NoDataView.prototype.onInit = function() {

            };

            NoDataView.prototype.onGetData = function (param) {
                _this = this;

                var messageType = param.messageType;
                var message = CCABase.StringSources.noData[messageType];
                message = (message != undefined) ? message : CCABase.StringSources.noData[ViewerType.DEFAULT];
                if(param.errorCode) {
                    message += " (" + param.errorCode + ")";
                }
                this.model.setMessage(message);
                this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
            };

            NoDataView.prototype.onActive = function () {
                sendFinishViewEvent();
            };            

            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };

            this.onInit();
        };

        NoDataView.prototype = Object.create(View.prototype);

        return NoDataView;
    });