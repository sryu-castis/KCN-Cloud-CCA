define(["framework/Drawer", "helper/DrawerHelper"], function (Drawer, DrawerHelper) {
    var RecommendContentsDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);

        var listTemplate = new EJS({url: 'js/ui/mainMenuViewGroup/recommendContents/ListTemplate.ejs'});
        var _this = this;
        var isFirstDraw = false;

        RecommendContentsDrawer.prototype.onCreateLayout = function () {
            this.setContainer($('#index_main_bg #index_area_poster'));
            isFirstDraw = true;
        };

        RecommendContentsDrawer.prototype.onPaint = function () {
            if(!this.model.isNullData()) {
                listTemplate.update(this.getContainer()[0], {model: this.model});
            }
        };

        RecommendContentsDrawer.prototype.onAfterPaint = function () {
            if(!this.model.isNullData()) {
                drawFocus();
                if(isFirstDraw) {
                    setLoadTimer();
                }
            }
            isFirstDraw = false;
        }

        function setLoadTimer() {
            var posterTagList = _this.getContainer().find(".poster img");
            var imageList = [];
            for(var i = 0; i < posterTagList.length; i++) {
                imageList.push(posterTagList[i])
            }
            imageList.push(_this.getContainer().find(".eventposter img")[0]);
            DrawerHelper.setLoadTimer(imageList);
        }

        function drawFocus() {
            drawUnFocus();

            var contentList = _this.getContainer().find(".poster");
            var promotionPoster = _this.getContainer().find(".eventposter");

            var focusIndex = _this.model.getHIndex();

            if (_this.isActive()) {
                if (isPromotionArea()) {
                    $(promotionPoster).addClass('focus');
                } else {
                    $(contentList[focusIndex]).addClass('focus');
                }
            }
        }

        function drawUnFocus() {
            var contentList = _this.getContainer().find(".poster");
            var promotionPoster = _this.getContainer().find(".eventposter");

            for (var i = 0; i < contentList.length; i++) {
                $(contentList[i]).removeClass('focus');
            }
            $(promotionPoster).removeClass('focus');
        }

        function isPromotionArea() {
            var hIndex = _this.model.getHIndex();
            var hMax = _this.model.getHMax();

            return hIndex == hMax;
        }
    };
    RecommendContentsDrawer.prototype = Object.create(Drawer.prototype);

    return RecommendContentsDrawer;
});