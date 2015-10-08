define(["framework/Drawer", "framework/event/CCAEvent", "helper/UIHelper"],
    function (Drawer, CCAEvent, UIHelper) {
        var ServiceMenuDrawer = function (_id, _model) {
            Drawer.call(this, _id, _model);

            //this.templateList = {'layout': new EJS({url: 'js/ui/mainMenuViewGroup/serviceMenu/LayoutTemplate.ejs'})};
            var listTemplate = new EJS({url: 'js/ui/mainMenuViewGroup/serviceMenu/ListTemplate.ejs'});
            var _this = this;
            var isFirstDraw = false;

            ServiceMenuDrawer.prototype.onCreateLayout = function () {
                isFirstDraw = true;
                this.setContainer($("#index_main_bg #index_area_app"));
            };

            ServiceMenuDrawer.prototype.onPaint = function () {
                if(!this.model.isNullData()) {
                    listTemplate.update(this.getContainer()[0], {model: this.model, UIHelper: UIHelper});
                }
            };
            ServiceMenuDrawer.prototype.onAfterPaint = function () {
                if(!this.model.isNullData()) {
                    drawFocusOnItem();
                }
            };
            ServiceMenuDrawer.prototype.onDrawForCloud = function () {

            }

            function sendCompleteDrawEvent() {
                if (isFirstDraw) {
                    isFirstDraw = false;
                    _this.sendEvent(CCAEvent.COMPLETE_TO_DRAW_VIEW);
                }
            }

            function getFocusIndexItem() {
                if (!_this.model.isNullData()) {
                    var focusIndex = _this.model.getHIndex();
                    var listItems = _this.container.find('ul');
                    var focusItem = listItems.eq(focusIndex);
                    return focusItem;
                } else {
                    return null;
                }
            }

            function drawFocusOnItem() {
                drawUnFocus();
                var focusItem = getFocusIndexItem();

                if (focusItem) {
                    if (_this.isActive()) {
                        _this.setFocus(focusItem);
                        var serviceMenuList = _this.model.getData();
                        focusItem.find("img").attr("src", serviceMenuList[_this.model.getHIndex()].getFocusImage() );
                    } else {
                        _this.setUnFocus(focusItem);
                    }
                }
            }

            function drawUnFocus() {
                var itemList = _this.getContainer().find("ul");
                var serviceMenuList = _this.model.getData();

                for(var i = 0; i < itemList.length; i++) {
                    $(itemList[i]).removeClass('focus').addClass('unfocus');
                    $(itemList[i]).find("img").attr("src", serviceMenuList[i].getUnFocusImage() );

                }
            }
        };
        ServiceMenuDrawer.prototype = Object.create(Drawer.prototype);

        return ServiceMenuDrawer;
    });
