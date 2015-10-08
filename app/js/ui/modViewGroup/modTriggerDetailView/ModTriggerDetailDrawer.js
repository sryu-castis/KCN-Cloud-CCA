define(["framework/Drawer", "cca/PopupValues", 'helper/UIHelper'], function (Drawer, PopupValues, UIHelper) {
    var ModTriggerDetailDrawer = function (_id, _model) {
        Drawer.call(this, _id, _model);
        this.templateList = {'layout': new EJS({url: 'js/ui/modViewGroup/modTriggerDetailView/LayoutTemplate.ejs'})};
        var _this = this;
        var marqueeText = null;

        ModTriggerDetailDrawer.prototype.onCreateLayout = function () {
            //this.createContainer("modView");
        };

        ModTriggerDetailDrawer.prototype.onPaint = function () {
            var result = _this.templateList['layout'].render({model: this.model, UIHelper:UIHelper});
            this.getContainer().html(result);
            setButtonElement();
            //_this.timerContainer = $('#popup_large');
        };

        ModTriggerDetailDrawer.prototype.onAfterPaint = function () {
            drawButton();
        };

        ModTriggerDetailDrawer.prototype.onUpdate = function() {
            Drawer.prototype.onUpdate.call(_this);
            drawSynopsis();
        };

        ModTriggerDetailDrawer.prototype.onShow = function() {
            Drawer.prototype.onShow.call(_this);
            drawSynopsis();
        };

        function setButtonElement() {
            var buttonGroup = _this.model.getButtonGroup();
            var buttonElementList = $('#'+_id+' .area_btn >');
            var size = buttonGroup.getSize();
            for (var i = 0; i < size; i++) {
                buttonGroup.getButton(i).setElement(buttonElementList.eq(i));
            }
        };

        function drawButton() {
            var buttonGroup = _this.model.getButtonGroup();
            for(var i = 0; i < buttonGroup.getSize(); i++) {
                if (buttonGroup.getButton(i).isActive()) {
                    buttonGroup.getButton(i).onActive();
                } else {
                    buttonGroup.getButton(i).onDeActive();
                }
                buttonGroup.getButton(i).setUnFocus();
            }

            if(_this.isActive() && !isSynopsisState()) {
                buttonGroup.getFocusedButton().setFocus();
            }
        }

        function drawSynopsis() {
            if(_this.model.getExtContentInfo() != null) {
                drawSynopsisPager()
                drawSynopsisFocus();
                drawSynopsisPadding();
                drawSynopsisScroll();
            }
        }

        function drawSynopsisPager() {
            var pageSize = getSynopsisSize();
            $('.story_navi').html('');
            if(pageSize <= 10) { //10개 이상이면 보여주지 않음.
                for(var i =0; i < pageSize; i++) {
                    var dot = $('<span class="page unfocus"></span>');
                    $('.story_navi').append(dot)
                }
            }
            drawSynopsisPagerFocus();
        }

        function getSynopsisSize() {
            var synopsisElement = $('.story_area .story')[0];
            console.log("synopsisElement.scrollHeight="+synopsisElement.scrollHeight);
            var pageSize = Math.ceil(synopsisElement.scrollHeight / 40);
            _this.model.setHVisibleSize(pageSize);
            _this.model.setHMax(pageSize);
            return pageSize;
        }

        function drawSynopsisPadding () {
            var pageSize = getSynopsisSize();
            //var lineHeight = 20;
            var width = 330;
            var synopsisElement = $('.story_area .story')[0];
            var scrollHeight = synopsisElement.scrollHeight;
            var paddingHeight = pageSize * 40 - scrollHeight;
            synopsisElement.innerHTML += '<div style="width:' + width + 'px; height:' + paddingHeight + 'px;"></div>';
        }

        function drawSynopsisPagerFocus() {
            var dot  		= $('.story_navi > .page').eq(_this.model.getHIndex());
            var arrowLeft	= $('.story_area .arw_left');
            var arrowRight	= $('.story_area .arw_right');

            if(dot) {
                dot.removeClass('unfocus');
                dot.addClass('focus');
            }

            if(isSynopsisState() && _this.isActive()) {
                if(_this.model.getHIndex() < _this.model.getHVisibleSize() - 1) {
                    arrowRight.removeClass('unfocus');
                    arrowRight.addClass('focus');
                } else {
                    arrowRight.removeClass('focus');
                    arrowRight.addClass('unfocus');
                }
                if(_this.model.getHIndex() > 0) {
                    arrowLeft.removeClass('unfocus');
                    arrowLeft.addClass('focus');
                } else {
                    arrowLeft.removeClass('focus');
                    arrowLeft.addClass('unfocus');
                }
            } else {
                arrowLeft.removeClass('focus');
                arrowRight.removeClass('focus');
                arrowLeft.addClass('unfocus');
                arrowRight.addClass('unfocus');
            }
        }

        function drawSynopsisFocus() {
            var synopsis = $('.story_area');
            if(isSynopsisState() && _this.isActive()) {
                synopsis.removeClass('unfocus');
                synopsis.addClass('focus');
            } else {
                synopsis.removeClass('focus');
                synopsis.addClass('unfocus');
            }
        }

        function drawSynopsisScroll() {
            // $('.synopsis .story').scrollTop( (_this.model.getHIndex() * 57) );
            $('.story_area .story').scrollTop( (_this.model.getHIndex() * 40) );
            /*if(synopsisElement.offsetHeight < synopsisElement.scrollHeight) {
             $('.synopsis .story').scrollTop(55 * (_this.model.getHIndex() + 1));
             }*/

        }


        function isSynopsisState() {
            return _this.model.getVIndex() == 0;
        }
    };
    ModTriggerDetailDrawer.prototype = Object.create(Drawer.prototype);


    return ModTriggerDetailDrawer;
});
