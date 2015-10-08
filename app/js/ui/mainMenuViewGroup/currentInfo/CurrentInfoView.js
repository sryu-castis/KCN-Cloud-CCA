define(["framework/View", "ui/mainMenuViewGroup/currentInfo/CurrentInfoModel", "ui/mainMenuViewGroup/currentInfo/CurrentInfoDrawer", "cca/model/Weather", "service/Communicator", "service/STBInfoManager"],
    function (View, CurrentInfoModel, CurrentInfoDrawer, Weather, Communicator, STBInfoManager) {


        var CurrentInfoView = function (id) {
            View.call(this, id);
            this.model = null;
            this.drawer = null;

            var _this = this;
            var clockIntervalId = null;

            var INTERVAL_TIME = 1000 * 60;

            CurrentInfoView.prototype.onInitialize = function () {
                this.model = new CurrentInfoModel();
                this.drawer = new CurrentInfoDrawer(this.getID(), this.model);
            };

            CurrentInfoView.prototype.onGetData = function (param) {
                this.model.setData(new Weather({ hourly : [{ station : {name:""}, sky : {name:"", code: "default"}, temperature : {tc : "", tmax : "", tmin : ""}}] }));
                this.model.setHeaderImage(param.getHeaderImage());
                Communicator.requestWeatherInfoHourly(requestCallBack, STBInfoManager.getSOCode());
            };

            CurrentInfoView.prototype.onBeforeStart = function () {
                _this = this;
                cancelClockInterval();
            };

            CurrentInfoView.prototype.onAfterStart = function () {
                startClockInterval();
            };

            CurrentInfoView.prototype.onStop = function () {
                cancelClockInterval();
            };
            CurrentInfoView.prototype.onUpdate = function () {
                //Communicator.requestWeatherInfo(requestCallBack, STBInfoManager.getSOCode());
            };

            CurrentInfoView.prototype.onKeyDown = function (event, param) {
                var keyCode = param.keyCode;
                var tvKey = window.TVKeyValue;
                switch (keyCode) {
                    case tvKey.KEY_UP:
                    case tvKey.KEY_DOWN:
                    case tvKey.KEY_LEFT:
                    case tvKey.KEY_BACK:
                    case tvKey.KEY_EXIT:
                    case tvKey.KEY_RIGHT:
                    case tvKey.KEY_ENTER:
                        break;
                    default:
                        break;
                }
            };

            function startClockInterval() {
                setInterval(function () {
                    _this.drawer.onRepaint();
                }, INTERVAL_TIME);
            }

            function cancelClockInterval() {
                clockIntervalId = null;
            }

            function requestCallBack(response) {
                initializeModel(response);
                _this.drawer.onUpdate();
            }

            function initializeModel(response) {
                var model = _this.model;
                if(Communicator.isSuccessResponseFromWeather(response)) {
                    model.setData(response.weather);
                }
            }

            this.onInitialize();
        };

        CurrentInfoView.prototype = Object.create(View.prototype);

        return CurrentInfoView;
    });