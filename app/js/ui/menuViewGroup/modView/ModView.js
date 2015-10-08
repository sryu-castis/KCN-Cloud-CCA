define(["framework/View", "framework/event/CCAEvent", "cca/type/ViewerType",
        "ui/menuViewGroup/modView/ModDrawer", "framework/Model", 'main/CSSHandler', 'service/Communicator', 'cca/DefineView', 'cca/PopupValues'],
    function (View, CCAEvent, ViewerType, ModDrawer, Model, CSSHandler, Communicator, DefineView, PopupValues) {

        var ModView = function () {
            View.call(this, DefineView.MOD_VIEW);
            this.model = new Model();
            this.drawer = new ModDrawer(this.getID(), this.model);

            var _this = this;

            ModView.prototype.onInit = function() {

            };

            ModView.prototype.onGetData = function (param) {
            };     

            ModView.prototype.onKeyDown = function (event, param) {
                var model = _this.model;
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;

                switch (keyCode) {
                    case tvKey.KEY_LEFT:
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_EXIT:
                    case tvKey.KEY_BACK:
                        sendFinishViewEvent();
                        break;
                    case tvKey.KEY_ENTER:
                        runMonkey3();
                        break;
                }
            };

            function runMonkey3() {
                Communicator.requestSetExtSvcSource(function(result){
                    if(Communicator.isSuccessResponseFromHAS(result) == true) {
                        CSSHandler.runThirdApp(CSSHandler.APP_ID_MONKEY3);
                    } else {
                        _this.sendEvent(CCAEvent.CHANGE_VIEWGROUP, {targetGroup:DefineView.POPUP_VIEWGROUP, popupType:PopupValues.PopupType.ERROR, id:result.resultCode});
                    }
                }, 'MK3', 0, 0, 'content');
            }

            function sendFinishViewEvent() {
                _this.sendEvent(CCAEvent.FINISH_VIEW);
            };

            this.onInit();
        };

        ModView.prototype = Object.create(View.prototype);

        return ModView;
    });