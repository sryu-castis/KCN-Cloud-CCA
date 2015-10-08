define(["framework/Drawer", "ui/menuViewGroup/categoryListView/CategoryListModel",
    "helper/NavigationHelper"],
    function (Drawer, CategoryListModel, NavigationHelper) {
    var CategoryListDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        //@Comment: List 또는 layout 이 여러개 일땐 알아서 이름 맵핑해서 사용하시면 됩니다
        this.templateList = {'layout': new EJS({url: 'js/ui/menuViewGroup/categoryListView/LayoutTemplate.ejs'}), 'list': new EJS({url: 'js/ui/menuViewGroup/categoryListView/ListTemplate.ejs'})};
        var _this = this;
        this.isFirstDepth = false;

        CategoryListDrawer.prototype.onCreateLayout = function () {
            _this = this;
            var result = this.templateList['layout'].render({model: this.model});
            this.getContainer().html(result);

            if(!this.isFirstDepth) {
                this.timerContainer = $(getElementID() + '.bg_menu_list');
            }
        };

        CategoryListDrawer.prototype.onPaint = function () {
            var result = this.templateList['list'].render({model: this.model});
            $(getElementID() + '.menu_list').html(result);
        };
        CategoryListDrawer.prototype.onAfterPaint = function () {
            drawFocusOnBG();
            drawFocusOnCategory();
            drawIndicator();
            drawMenuTypeIcon();
            drawTitleArea();
        };
        CategoryListDrawer.prototype.setActive = function (_value) {
            //@Comment 해당 드로어의 _this 가 바뀐 상태에서 onActive로 진입하여 _this 가 잘못매칭되어 있는 경우를 위한 방어코드
            _this = this;
            Drawer.prototype.setActive.call(this, _value);
        }
        CategoryListDrawer.prototype.setFirstDepth = function (_value) {
            this.isFirstDepth = _value;
        }

        function drawFocusOnBG() {
            if (_this.isActive()) {
                $(getElementID() + '.bg_left').removeClass('unfocus');
                $(getElementID() + '.bg_left').addClass('focus');

            } else {
                $(getElementID() + '.bg_left').removeClass('focus');
                $(getElementID() + '.bg_left').addClass('unfocus');
            }
        }

        function drawTitleArea() {
            var model = _this.model;
            var currentCategoryName, parentCategoryName = "";

            if(model.getParentCategory()) {
                parentCategoryName = model.getParentCategory().getCategoryName();
            }
            if (model.getCurrentCategory()) {
                currentCategoryName = model.getCurrentCategory().getCategoryName();
            }
            $(getElementID() + '.text_tit_s').html(parentCategoryName);
            $(getElementID() + '.text_tit').html(currentCategoryName);
        }

        function getElementID() {
            return '#' + _this.id + ' ';
        }

        function getFocusIndexItem() {
            if(!_this.model.isNullData()) {
                var focusIndex = _this.model.getVIndex();
                var listItems = $(getElementID() + '.menu_box');
                var focusItem = listItems.eq(focusIndex);
                return focusItem;
            }
        };

        function drawFocusOnCategory() {
            var focusItem = getFocusIndexItem();

            if(focusItem) {
                // if(_this.model.getVFocusedItem().getPresentationType() == "MODPage") {
                //     focusItem.addClass('mod');
                // }
                focusItem.removeClass('unfocus');
                focusItem.addClass('focus');
            }
        }

        function drawIndicator() {
            var categoryIndicator = $(getElementID() + '.tx_dim');
            if(_this.isActive()) {
                //_this.setFocus(categoryIndicator);
                //categoryIndicator.show();
            } else {
                //_this.setUnFocus(categoryIndicator);
                //categoryIndicator.hide();
            }

        }

        function drawMenuTypeIcon() {
            var categoryIconName = _this.model.getDetailIconType();
            if(categoryIconName == null || categoryIconName.length == 0) {
                categoryIconName = getMenuIconName ();
            }
            var menuTypeIcon = $(getElementID() + '.bg_left .tit_area');
            menuTypeIcon.attr('class', 'tit_area');
            menuTypeIcon.addClass(categoryIconName);
        }


        function getMenuIconName() {
            var rootCategoryName = _this.model.getRootCategoryName();
            var categoryIconName = "";
            switch (rootCategoryName) {
                case "오늘의 추천":
                    categoryIconName = "menu_icon1";
                    break;
                case "영화":
                    categoryIconName = "menu_icon2";
                    break;
                case "최신드라마/예능":
                    categoryIconName = "menu_icon3";
                    break;
                case "TV 다시보기":
                case "TV다시보기":
                    categoryIconName = "menu_icon4";
                    break;
                case "애니메이션/키즈":
                    categoryIconName = "menu_icon5";
                    break;
                case "교육/EBS":
                    categoryIconName = "menu_icon6";
                    break;
                case "마이 TV":
                case "마이TV":
                    categoryIconName = "menu_icon7";
                    break;
                case "연관추천":
                    categoryIconName = "menu_icon6";
                    break;
                case "통합검색":
                    categoryIconName = "menu_icon10";
                    break;
                default :
                    categoryIconName = "menu_icon2";
                    break;
            }
            return categoryIconName;
        }

    };
    CategoryListDrawer.prototype = Object.create(Drawer.prototype);

    return CategoryListDrawer;
});
