define(["framework/Drawer", "helper/UIHelper"],
    function (Drawer, UIHelper) {
        var VodMenuDrawer = function (_id, _model) {
            Drawer.call(this, _id, _model);

            var listTemplate = new EJS({url: 'js/ui/mainMenuViewGroup/vodMenu/LayoutTemplate.ejs'});
            var _this = this;

            VodMenuDrawer.prototype.onCreateLayout = function () {
                this.setContainer($('#index_main_bg #index_area_menu'));
            };

            VodMenuDrawer.prototype.onPaint = function () {
                if(!this.model.isNullData()) {
                    listTemplate.update(this.getContainer()[0], {model: this.model, UIHelper: UIHelper});
                }
            };
            VodMenuDrawer.prototype.onAfterPaint = function () {
                if(!this.model.isNullData()) {
                    drawFocus();
                }
            };

            function drawFocus() {
                drawUnFocus();

                var menuList = _this.getContainer().find("ul");
                var focusIndex = _this.model.getHIndex();
                var categoryList = _this.model.getData();

                if(_this.isActive()) {
                    $(menuList[focusIndex]).addClass('focus');
                    $(menuList[focusIndex]).find("img").attr("src", categoryList[_this.model.getHIndex()].getFocusImage() );
                }
            }

            function drawUnFocus() {
                var menuList = _this.getContainer().find("ul");
                var categoryList = _this.model.getData();

                for(var i = 0; i < menuList.length; i++) {
                    $(menuList[i]).removeClass('focus');
                    $(menuList[i]).find("img").attr("src", categoryList[i].getUnFocusImage() );
                }
            }
        };
        VodMenuDrawer.prototype = Object.create(Drawer.prototype);

        return VodMenuDrawer;
    });
