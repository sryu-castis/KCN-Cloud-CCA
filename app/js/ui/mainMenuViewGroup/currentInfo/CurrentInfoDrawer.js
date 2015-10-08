define(["framework/Drawer", "helper/DateHelper", "helper/UIHelper", "helper/WeatherHelper", "service/STBInfoManager", "helper/CommunicatorHelper"], function (Drawer, DateHelper, UIHelper, WeatherHelper, STBInfoManager, CommunicatorHelper) {

    var CurrentInfoDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);

        var layoutTemplate = new EJS({url: 'js/ui/mainMenuViewGroup/currentInfo/LayoutTemplate.ejs'});
        var _this = this;

        CurrentInfoDrawer.prototype.onCreateLayout = function () {
            this.setContainer($('#index_main_bg #index_area_header'));
        };

        CurrentInfoDrawer.prototype.onPaint = function () {
            if(!this.model.isNullData()) {
                layoutTemplate.update(this.getContainer()[0], {model: this.model, UIHelper: UIHelper, WeatherHelper: WeatherHelper, STBInfoManager: STBInfoManager});
            }
        };

        CurrentInfoDrawer.prototype.onAfterPaint = function () {
            drawWeatherIcon();
            drawTitleImage();
            updateTime();
            processForB2B();
        };

        function processForB2B() {
            if(CommunicatorHelper.isSeoKyungSO()) {
                $(".weatherWithBar").css("visibility", "hidden");
            }
        }

        function drawWeatherIcon() {
            var weatherIcon = _this.container.find(".weather .weath");
            weatherIcon.attr("class", "weath");
            weatherIcon.addClass(_this.model.getData().getSkyCode().toLowerCase());
        }

        function drawTitleImage() {
            var imageURL = _this.model.getHeaderImage();
            var titleImage = _this.container.find(".banner img");
            if(imageURL.length > 1) {
                titleImage.attr("src", imageURL);
                titleImage.removeClass("default");
            } else {
                titleImage.addClass("default");
            }
        }

        function updateTime() {
            var currentDate = new Date();
            var hours = currentDate.getHours();
            if(hours != 12){
                hours = DateHelper.leadingZeros(hours % 12, 2);
            }
            var minute = DateHelper.leadingZeros(currentDate.getMinutes(), 2);
            var apm = currentDate.getHours() >= 12 ? "pm" : "am";
            var month = DateHelper.leadingZeros(currentDate.getMonth() + 1, 2);
            var date = DateHelper.leadingZeros(currentDate.getDate(), 2);
            var dayOfWeek = DateHelper.getDayOfWeek(currentDate);

            _this.getContainer().find(".min").text(hours + ":" + minute);
            _this.getContainer().find(".ap").text(apm);
            _this.getContainer().find(".day").text(month + "월 " + date + "일 (" + dayOfWeek + ")");
        }
    };

    CurrentInfoDrawer.prototype = Object.create(Drawer.prototype);

    return CurrentInfoDrawer;
});